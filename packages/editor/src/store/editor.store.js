import { create } from 'zustand'
import { localRepoService } from './app.store'

import { cloneDeep } from 'ridgejs/src/utils/object'

const editorStore = create((set, get) => ({
  // 页面编辑状态
  isPreview: false,
  currentOpenPageId: null,
  zoom: 1,
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

  componentTreeData: [],
  // 非状态 作为服务
  editorComposite: null,

  openedFileContentMap: new Map(),
  pageTransformMap: new Map(),
  pageZoomMap: new Map(),
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

  updateTreeData: () => {
    const { editorComposite } = get()
    if (editorComposite) {
      const componentTreeData = editorComposite.getCompositeElementTree?.() || []
      set({ componentTreeData })
    } else {
      set({ componentTreeData: [] })
    }
  },

  setWorkspaceControl: workspaceControl => {
    set({
      workspaceControl
    })
  },

  selectElement: async element => {
    set({
      currentEditNodeId: element.getId(),
      currentEditNodeRect: { ...element.config.style }
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
    const { editorComposite, unsavedPages, currentOpenPageId } = get()
    editorComposite.updatePageConfig(config)
    set({
      unsavedPages: [...unsavedPages, currentOpenPageId]
    })
  },

  updateOutLine: () => {

  },

  updateNodeRect: (rect) => {
    const { currentOpenPageId, unsavedPages, currentEditNodeRect } = get()
    set({
      unsavedPages: [...unsavedPages, currentOpenPageId]
    })
    set({
      currentEditNodeRect: { ...currentEditNodeRect, ...rect }
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
    const { currentOpenPageId, unmountWorkspace, openedFileContentMap, pageZoomMap, pageTransformMap, workspaceControl, openedPages, setZoom, updateTreeData } = get()
    const appService = localRepoService.getCurrentAppService()
    if (currentOpenPageId === id) {
      return
    }
    // 关闭之前打开的页面 （非当前页面）
    if (currentOpenPageId) {
      unmountWorkspace(true)
    }
    const pageName = page.name.replace(/\.json$/, '')

    let pageObject = null

    if (openedPages.find(p => p.id === id) && openedFileContentMap.get(id)) { // 之前打开过
      pageObject = openedFileContentMap.get(id)
    } else if (page) {
      pageObject = cloneDeep(page.json)
    }
    pageObject.name = pageName

    const editorComposite = await workspaceControl.loadPage(pageObject, page.path, appService)

    const transform = pageTransformMap.get(id)
    if (transform) {
      workspaceControl.setTransform(transform)
    } else {
      workspaceControl.setTransform({})
    }

    const zoom = pageZoomMap.get(id)
    if (zoom) {
      setZoom(zoom)
    } else {
      setZoom(1)
    }

    set({
      currentOpenPageId: id,
      openedPages: openedPages.find(p => p.id === id)
        ? openedPages
        : [...openedPages, {
            id: page.id,
            name: pageName
          }],
      editorComposite
    })
    updateTreeData()
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

  unmountWorkspace: (cache) => {
    const { editorComposite, workspaceControl, openedFileContentMap, pageZoomMap, pageTransformMap, zoom, currentOpenPageId } = get()

    if (cache) {
      // 缓存当前图纸
      openedFileContentMap.set(currentOpenPageId, editorComposite.exportPageJSON())
      pageTransformMap.set(currentOpenPageId, workspaceControl.getTransform())
      pageZoomMap.set(currentOpenPageId, zoom)
    }
    editorComposite.unmount()
    workspaceControl.disable()

    set({
      editorComposite: null,
      componentTreeData: []
    })
  },

  // 关闭所有页面
  closeAllPages: async () => {
    const { openedFileContentMap, pageZoomMap, unmountWorkspace, pageTransformMap } = get()
    unmountWorkspace(false)
    openedFileContentMap.clear()
    pageZoomMap.clear()
    pageTransformMap.clear()
    set({
      currentOpenPageId: null,
      unsavedPages: [],
      openedPages: []
    })
  },

  // 切换到另一页面
  switchPage: async id => {
    const { currentOpenPageId, unmountWorkspace, openedFileContentMap, pageZoomMap, pageTransformMap, workspaceControl, setZoom, updateTreeData } = get()
    if (currentOpenPageId === id) {
      return
    }

    // 关闭之前打开的页面 （非当前页面）
    if (currentOpenPageId) {
      unmountWorkspace(true)
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
      const zoom = pageZoomMap.get(id)
      if (zoom) {
        setZoom(zoom)
      } else {
        setZoom(1)
      }
      set({
        currentOpenPageId: id,
        editorComposite
      })

      updateTreeData()
    }
  },

  // 关闭页面
  closePage: async (id) => {
    const { openedFileContentMap, pageZoomMap, openedPages, currentOpenPageId, unmountWorkspace, openPage } = get()

    const leftOpenedPages = openedPages.filter(p => p.id !== id)
    openedFileContentMap.delete(id)
    pageZoomMap.delete(id)
    if (currentOpenPageId === id) { // 关闭当前页
      unmountWorkspace(false)
      set({
        currentOpenPageId: null
      })
      if (leftOpenedPages.length > 0) {
        await openPage(leftOpenedPages[0].id, openedFileContentMap.get(leftOpenedPages[0].id))
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

  setZoom: (zoom) => {
    const { workspaceControl } = get()
    workspaceControl.setZoom(zoom)
    set({
      zoom
    })
  },

  handleWheel: (event) => {
    if (!event.ctrlKey) return
    // ✅ 彻底阻止浏览器默认行为：页面缩放 / 滚动
    event.preventDefault()
    event.stopPropagation()

    const { zoom, setZoom } = get()

    // 计算目标缩放值
    let targetZoom = zoom + (event.deltaY > 0 ? -1 : 1) * 0.01
    targetZoom = Math.min(Math.max(0.1, targetZoom), 2) // 限制 0.1 ~ 2

    setZoom(targetZoom)
  }
}))

export default editorStore
