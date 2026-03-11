import { create } from 'zustand'
import { localRepoService } from './app.store'

import { cloneDeep } from 'ridgejs/src/utils/object'

const editorStore = create((set, get) => ({

  // 状态 驱动展示
  isPreview: false,
  currentOpenPageId: null,
  zoom: 100,
  openedPages: [],
  unsavedPages: [],
  pageOpened: false,
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

  updateNodeRect: (rect) => {
    const { currentOpenPageId, unsavedPages } = get()
    set({
      unsavedPages: [...unsavedPages, currentOpenPageId]
    })
    set({
      currentEditNodeRect: rect
    })
  },
  openFile: async id => {
    const appService = localRepoService.getCurrentAppService()

    if (appService) {
      const file = await appService.getFile(id)
      if (file) {
        if (file.type === 'page') {
          get().openPage(file)
        } else if (file.mimeType.startsWith('text/')) {
          get().openCode(file)
        } else if (file.mimeType.startsWith('image/')) {
          get().openImage(file)
        }
      }
    }
  },

  // 打开页面
  openPage: async page => {
    const { currentOpenPageId, unmountWorkspace, closeCurrentPage, openedFileContentMap, pageTransformMap, workspaceControl, openedPages } = get()
    if (currentOpenPageId === page.id) {
      return
    }

    // 关闭之前打开的页面 （非当前页面）
    if (currentOpenPageId) {
      unmountWorkspace()
    }

    let pageObject = cloneDeep(page.json)
    if (openedPages.find(p => p.id === page.id) && openedFileContentMap.get(page.id)) { // 之前打开过
      pageObject = openedFileContentMap.get(page.id)
    }

    const editorComposite = await workspaceControl.loadPage(pageObject)

    const transform = pageTransformMap.get(page.id)
    if (transform) {
      workspaceControl.setTransform(transform)
    } else {
      workspaceControl.setTransform({})
    }

    set({
      currentOpenPageId: page.id,
      openedPages: openedPages.find(p => p.id === page.id)
        ? openedPages
        : [...openedPages, {
            id: page.id,
            name: page.name
          }],
      pageOpened: true,
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

  // 关闭打开的页面
  closeCurrentPage: (keep) => {
    const { currentOpenPageId, openedFileContentMap, editorComposite, pageTransformMap, setPageOpened, workspaceControl, openedPages, closePage } = get()

    if (editorComposite) {
      editorComposite.unmount()
    }
    workspaceControl.disable()

    if (keep) {
      openedFileContentMap.set(currentOpenPageId, editorComposite.exportPageJSON())
      pageTransformMap.set(currentOpenPageId, workspaceControl.getTransform())
    } else {
      closePage(currentOpenPageId)
    }

    set({
      currentOpenPageId: null,
      editorComposite: null
    })

    if (openedFileContentMap.length === 0) {
      setPageOpened(false)
    }
  },

  // 关闭所有页面
  closeAllPages: () => {
    get().closeCurrentPage(false)

    const { openedFileContentMap, openedPages } = get()

    for (const page of openedPages) {
      openedFileContentMap.delete(page.id)
    }
    set({
      openedPages: []
    })
  },

  // 关闭页面
  closePage: (id) => {
    const { openedFileContentMap, openedPages } = get()

    openedFileContentMap.delete(id)
    set({
      openedPages: openedPages.filter(p => p.id !== id)
    })
  },

  openCode: async file => {

  },

  zoomChange: () => {

  }

}))

export default editorStore
