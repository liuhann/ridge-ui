// src/store/useStore.js
import { create } from 'zustand'
import { alphabetid } from '../utils/string'
import LocalRepoService from '../service/LocalRepoService'
import ApplicationService from '../service/ApplicationService'

const localRepoService = new LocalRepoService()

const useStore = create((set, get) => ({
  // 初始化状态
  appList: [],
  loadingAppFiles: true,
  currentAppName: '',
  currentAppFilesTree: [],

  openApp: async id => {
    const appInfo = await localRepoService.getApp(id)

    if (appInfo) {
      const appService = localRepoService.getAppService(id)
      localRepoService.setCurrentApp(id, appService)
      await appService.updateAppFileTree()
      set({
        currentAppName: appInfo.name,
        currentAppFilesTree: appService.getAppFileTree()
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

  setCurrentAppName: name => {
    set({
      currentAppName: name
    })
  },

  initAppStore: async () => {
    const appList = await localRepoService.getLocalAppList()
    set({
      loadingAppFiles: true,
      appList
    })
    let appService = null
    if (appList.length === 0) { // 无应用默认创建
      const newAppId = alphabetid(6)
      const newAppName = '未命名应用'
      appService = new ApplicationService(alphabetid(6))
      appService.importHelloArchive()
      await localRepoService.persistanceApp(newAppId, newAppName)
      localRepoService.setCurrentApp(newAppId, appService)
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
      currentAppFilesTree: appService.getAppFileTree()
    })
  },

  updateAppList: async () => {
    const appList = localRepoService.getLocalAppList()
    set({
      appList
    })
  },

  createFolder: async (parentId, name) => {
    try {
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

export { localRepoService }
export default useStore
