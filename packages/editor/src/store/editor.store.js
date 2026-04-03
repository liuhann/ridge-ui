import { create } from 'zustand'
import { localRepoService } from './app.store'

import { cloneDeep } from 'ridgejs/src/utils/object'

const editorStore = create((set, get) => ({
  // 页面编辑状态
  isPreview: false,
  currentOpenPageId: null,
  zoom: 100,
  openedPages: [],
  unsavedPages: [],

  collapseLeft: false,
  imagePreviewVisible: false,
  imagePreviewSrc: '',

  currentEditNodeId: '',
  currentEditNodeRect: {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },

  // 非状态 作为服务
  editorComposite: null,
  openedFileContentMap: new Map(),
  pageTransformMap: new Map(),
  codeEditorRef: null,
  workspaceControl: null,

  initStore: ({
    workspaceRef,
    viewPortContainerRef,
    codeEditorRef
  }) => {
    set({
      codeEditorRef
    })
  },

  setWorkspaceControl: workspaceControl => {
    set({
      workspaceControl
    })
  },

  selectElement: async element => {
    set({
      currentEditNodeId: element.getId()
    })
  },

  selectPage: async () => {
    set({
      currentEditNodeId: ''
    })
  },

  updateElementConfig: (config, fieldUpdate) => {
    const clonedConfig = cloneDeep(config)

    const { editorComposite, currentEditNodeId, currentOpenPageId, workspaceControl, unsavedPages } = get()

    const targetElement = editorComposite.getNode(currentEditNodeId)
    targetElement.updateConfig(clonedConfig, fieldUpdate)

    set({
      unsavedPages: [...unsavedPages, currentOpenPageId]
    })
    workspaceControl && workspaceControl.updateMovable()
  },

  updatePageConfig: config => {

  },

  updateOutLine: () => {

  },

  updateNodeRect: (rect) => {
    const { currentOpenPageId, unsavedPages } = get()
    set({
      unsavedPages: [...unsavedPages, currentOpenPageId]
    })
    set({
      currentEditNodeRect: { ...rect }
    })
  },

  openFile: async id => {
    const { openPage, openCode, openImage } = get()
    const appService = localRepoService.getCurrentAppService()

    if (appService) {
      const file = await appService.getFile(id)
      if (file && file.mimeType) {
        if (file.type === 'page') {
          openPage(id, file)
        } else if (file.mimeType.startsWith('text/')) {
          openCode(file)
        } else if (file.mimeType.startsWith('image/')) {
          openImage(file)
        }
      }
    }
  },

  // 打开页面
  openPage: async (id, page) => {
    const { currentOpenPageId, unmountWorkspace, openedFileContentMap, pageTransformMap, workspaceControl, openedPages } = get()
    const appService = localRepoService.getCurrentAppService()
    if (currentOpenPageId === id) {
      return
    }
    // 关闭之前打开的页面 （非当前页面）
    if (currentOpenPageId) {
      unmountWorkspace()
    }

    let pageObject = null

    if (openedPages.find(p => p.id === id) && openedFileContentMap.get(id)) { // 之前打开过
      pageObject = openedFileContentMap.get(id)
    } else if (page) {
      pageObject = cloneDeep(page.json)
    }

    const editorComposite = await workspaceControl.loadPage(pageObject, page.path, appService)

    const transform = pageTransformMap.get(id)
    if (transform) {
      workspaceControl.setTransform(transform)
    } else {
      workspaceControl.setTransform({})
    }

    set({
      currentOpenPageId: id,
      openedPages: openedPages.find(p => p.id === id)
        ? openedPages
        : [...openedPages, {
            id: page.id,
            name: page.name
          }],
      editorComposite
    })
  },

  saveCurrentPage: async () => {
    const { currentOpenPageId, editorComposite, unsavedPages } = get()

    if (currentOpenPageId && editorComposite) {
      const appService = localRepoService.getCurrentAppService()
      appService.updateFileContent(currentOpenPageId, JSON.stringify(editorComposite.exportPageJSON(), null, 2))
      set({
        unsavedPages: unsavedPages.filter(pid => pid !== currentOpenPageId)
      })
    }
  },

  unmountWorkspace: () => {
    const { editorComposite, workspaceControl, openedFileContentMap, pageTransformMap, currentOpenPageId } = get()

    if (editorComposite) {
      // 缓存当前图纸
      openedFileContentMap.set(currentOpenPageId, editorComposite.exportPageJSON())
      pageTransformMap.set(currentOpenPageId, workspaceControl.getTransform())
      editorComposite.unmount()
    }
    workspaceControl.disable()

    set({
      editorComposite: null
    })
  },

  // 关闭所有页面
  closeAllPages: async () => {
    const { openedFileContentMap, unmountWorkspace, pageTransformMap } = get()
    unmountWorkspace()
    openedFileContentMap.clear()
    pageTransformMap.clear()
    set({
      currentOpenPageId: null,
      unsavedPages: [],
      openedPages: []
    })
  },

  // 切换到另一页面
  switchPage: async id => {
    const { currentOpenPageId, unmountWorkspace, openedFileContentMap, pageTransformMap, workspaceControl } = get()
    if (currentOpenPageId === id) {
      return
    }

    // 关闭之前打开的页面 （非当前页面）
    if (currentOpenPageId) {
      unmountWorkspace()
    }

    if (openedFileContentMap.get(id)) { // 之前打开过
      const pageObject = openedFileContentMap.get(id)
      const editorComposite = await workspaceControl.loadPage(pageObject)
      const transform = pageTransformMap.get(id)
      if (transform) {
        workspaceControl.setTransform(transform)
      } else {
        workspaceControl.setTransform({})
      }
      set({
        currentOpenPageId: id,
        editorComposite
      })
    }
  },

  // 关闭页面
  closePage: async (id) => {
    const { openedFileContentMap, openedPages, currentOpenPageId, unmountWorkspace, openPage } = get()

    const leftOpenedPages = openedPages.filter(p => p.id !== id)
    openedFileContentMap.delete(id)
    if (currentOpenPageId === id) { // 关闭当前页
      unmountWorkspace()
      if (leftOpenedPages.length === 0) {
        set({
          currentOpenPageId: null
        })
      } else {
        await openPage(leftOpenedPages[0].id)
      }
    }
    set({
      openedPages: leftOpenedPages
    })
  },

  openCode: async file => {
    const { codeEditorRef } = get()
    codeEditorRef?.current?.openFile(file)
  },

  openImage: file => {
    set({
      imagePreviewSrc: file.url,
      imagePreviewVisible: true
    })
  },

  closeImagePreview: () => {
    set({
      imagePreviewSrc: '',
      imagePreviewVisible: false
    })
  },

  saveCode: async (id, code) => {
    const appService = localRepoService.getCurrentAppService()

    await appService.updateFileContent(id, code)
  },

  zoomChange: () => {

  }

}))

export default editorStore
