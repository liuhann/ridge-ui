// src/store/useStore.js
import { create } from 'zustand'
import { alphabetid, trim, camelCase } from '../utils/string'
import LocalRepoService from '../service/LocalRepoService'
import ApplicationService from '../service/ApplicationService'
import { stringToBlob } from '../utils/blob'

import helloZipApp from '../ridge-app-hello-1.0.0.zip'

const localRepoService = new LocalRepoService()

const useStore = create((set, get) => ({
  // 初始化状态
  appList: [],
  loadingAppFiles: true,
  currentAppName: '',
  currentAppId: '',
  currentAppFilesTree: [],

  appService: null,

  initAppStore: async () => {
    const { importAppFile, openApp } = get()

    const appList = await localRepoService.getLocalAppList()

    if (appList.length === 0) { // 无应用默认创建
      if (!localRepoService.importedHello()) {
        await importAppFile(helloZipApp)
        window.localStorage.setItem('ridge-imported-hello', true)
      }
    }
    const currentAppId = await localRepoService.getCurrentAppId()

    if (currentAppId) {
      openApp(currentAppId)
    }
    set({
      loadingAppFiles: false,
      appList
    })
  },
  openApp: async id => {
    const appInfo = await localRepoService.getApp(id)

    if (appInfo) {
      const appService = localRepoService.getAppService(id)
      localRepoService.setCurrentApp(id, appService)

      await appService.updateAppFileTree()
      set({
        appService,
        currentAppId: id,
        currentAppName: appInfo.name,
        currentAppFilesTree: appService.getFileTree()
      })
    }
  },

  removeApp: async id => {
    await localRepoService.removeApp(id)
    const appList = await localRepoService.getLocalAppList()
    set({
      appList
    })
  },

  importAppFile: async file => {
    const newAppId = alphabetid(6)
    const appService = new ApplicationService(newAppId)
    await appService.importAppArchive(file)

    await localRepoService.persistanceApp(newAppId, (await appService.getAppPackageJSON()).description)

    const appList = await localRepoService.getLocalAppList()
    set({
      loadingAppFiles: true,
      appList
    })
  },

  setCurrentAppName: name => {
    set({
      currentAppName: name
    })
  },

  exitToAppList: () => {
    localRepoService.setCurrentApp(null)
    set({
      currentAppName: null
    })
  },

  updateAppList: async () => {
    const appList = localRepoService.getLocalAppList()
    set({
      appList
    })
  },

  createFolder: async (parentId, name) => {
    const { appService } = get()
    try {
      await appService.createDirectory(parentId, name)
      set({
        currentAppFilesTree: appService.getFileTree()
      })
      return true
    } catch (e) {
      return false
    }
  },

  uploadFile: async (parentId, file) => {
    const appService = localRepoService.getCurrentAppService()
    try {
      await appService.createFile(parentId, file.name, file)
      set({
        currentAppFilesTree: appService.getFileTree()
      })
      return true
    } catch (e) {
      return false
    }
  },

  createFile: async (parentId, name, fileContent, mimeType) => {
    const appService = localRepoService.getCurrentAppService()

    await appService.createFile(parentId, name, stringToBlob(fileContent, mimeType))
    set({
      currentAppFilesTree: appService.getFileTree()
    })
  },

  deleteFile: async (fileId) => {
    const { appService } = get()
    await appService.deleteFile(fileId)

    set({
      currentAppFilesTree: appService.getFileTree()
    })
  },

  getFilePath: async (fileId) => {
    const appService = localRepoService.getCurrentAppService()
    const file = appService.getFile(fileId)
    if (file) {
      return file.path
    }
  },

  checkNewNameValid: (id, newName) => {
    const appService = localRepoService.getCurrentAppService()
    return appService.checkNewNameValid(id, newName)
  },

  checkCreateNameValid: (pid, name) => {
    const appService = localRepoService.getCurrentAppService()
    return appService.filterFiles(file => file.parent === pid && camelCase(trim(name)) === camelCase(trim(file.name))).length === 0
  },

  renameFile: async (fileId, name) => {
    const appService = localRepoService.getCurrentAppService()
    const renamed = await appService.rename(fileId, name)
    if (renamed === 1) {
      await appService.updateAppFileTree()
      set({
        currentAppFilesTree: appService.getFileTree()
      })
    }
    return renamed
  },

  moveFile: async (fileId, parentId) => {
    const appService = localRepoService.getCurrentAppService()
    const moved = await appService.move(fileId, parentId)
    if (moved) {
      set({
        currentAppFilesTree: appService.getFileTree()
      })
    }
    return moved
  }
}))

export { localRepoService }
export default useStore
