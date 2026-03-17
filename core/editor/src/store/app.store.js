// src/store/useStore.js
import { create } from 'zustand'
import { alphabetid } from '../utils/string'
import LocalRepoService from '../service/LocalRepoService'
import ApplicationService from '../service/ApplicationService'
import { stringToBlob } from '../utils/blob'
import { trim, camelCase } from '../utils/string'

const localRepoService = new LocalRepoService()

const useStore = create((set, get) => ({
  // 初始化状态
  appList: [],
  loadingAppFiles: true,
  currentAppName: '',
  currentAppId: '',
  currentAppFilesTree: [],

  openApp: async id => {
    const appInfo = await localRepoService.getApp(id)

    if (appInfo) {
      const appService = localRepoService.getAppService(id)
      localRepoService.setCurrentApp(id, appService)
      await appService.updateAppFileTree()
      set({
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

  initAppStore: async () => {
    const { importAppFile } = get()

    const appList = await localRepoService.getLocalAppList()
    set({
      loadingAppFiles: true,
      appList
    })

    if (appList.length === 0) { // 无应用默认创建
      if (!localRepoService.importedHello()) {
        let appService = null
        await importAppFile()
        appService.importHelloArchive()
        await localRepoService.persistanceApp(newAppId, (await appService.getAppPackageJSON()).description)
      }
    }
    const currentAppId = await localRepoService.getCurrentAppId()

    if (currentAppId) {
      const appInfo = await localRepoService.getApp(currentAppId)
      set({
        currentAppName: appInfo.name
      })
      appService = localRepoService.getAppService(currentAppId)
    }

    await appService.updateAppFileTree()
    set({
      currentAppFilesTree: appService.getFileTree()
    })
  },

  updateAppList: async () => {
    const appList = localRepoService.getLocalAppList()
    set({
      appList
    })
  },

  createFolder: async (parentId, name) => {
    const appService = localRepoService.getCurrentAppService()
    try {
      await appService.createDirectory(parentId, name)
      await appService.updateAppFileTree()
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

  fileRename: async (fileId, name) => {
    const appService = localRepoService.getCurrentAppService()
    const renamed = await appService.rename(fileId, name)
    if (renamed === 1) {
      await appService.updateAppFileTree()
      set({
        currentAppFilesTree: appService.getFileTree()
      })
    }
    return renamed
  }
}))

export { localRepoService }
export default useStore
