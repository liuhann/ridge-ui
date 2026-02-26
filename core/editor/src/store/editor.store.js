import { create } from 'zustand'
import { localRepoService } from './app.store'

import { cloneDeep } from 'ridgejs/src/utils/object'

const editorStore = create((set, get) => ({
  isPreview: false,
  currentOpenPageId: null,
  pageOpened: false,
  collapseLeft: false,
  imagePreviewVisible: false,
  imagePreviewSrc: '',

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

  },

  selectPage: async () => {

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

  openPage: async page => {
    const { currentOpenPageId, closeCurrentPage, openedFileContentMap, pageTransformMap, workspaceControl } = get()
    if (currentOpenPageId === page.id) {
      return
    }

    if (currentOpenPageId) {
      closeCurrentPage(true)
    }

    set({
      currentOpenPageId: page.id,
      pageOpened: true
    })
    openedFileContentMap.set(page.id, page.content)

    const editorComposite = await workspaceControl.loadPage(cloneDeep(page.content))
    const transform = pageTransformMap.get(page.id)
    if (transform) {
      workspaceControl.setTransform(transform)
    } else {
      workspaceControl.setTransform({})
    }
    set({
      editorComposite
    })
  },

  openCode: async file => {

  },

  closeCurrentPage (keep) {
    const { currentOpenPageId, openedFileContentMap, editorComposite, pageTransformMap, setPageOpened } = get()
    if (keep) {
      openedFileContentMap.set(currentOpenPageId, editorComposite.exportPageJSON())
      pageTransformMap.set(currentOpenPageId, workspaceControl.getTransform())
    } else {
      openedFileContentMap.delete(currentOpenPageId)
    }
    if (editorComposite) {
      editorComposite.unmount()
    }

    set({
      currentOpenPageId: null,
      editorComposite: null
    })
    workspaceControl.disable()

    if (openedFileContentMap.length === 0) {
      setPageOpened(false)
    }
  },

  createFolder: async (parentId, name) => {
    try {
      const appService = localRepoService.getCurrentAppService()
      await appService.createDirectory(parentId, name)
      await get().initAppStore()
      return true
    } catch (e) {
      return false
    }
  },

  fileRename: async (fileId, name) => {
    const renamed = await appService.rename(fileId, name)
    if (renamed === 1) {
      await get().initAppStore()
    }
    return renamed
  }
}))

export default editorStore
