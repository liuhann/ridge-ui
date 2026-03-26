import LocalStorageUtil from '/npm/ridge-common/js/storage.js'

export default {
  name: 'LauncherIndex',
  state: {
    currentPageKey: 'home', // 当前显示页面
    openedPageList: [], // 当前打开的页面
    recentHistoriesApps: [], // 最近打开的应用
    hideClose: false  // 显示关闭按钮
  },

  watch: {
    currentPageKey (val) {
      if (this.currentPageKey === 'home' || this.currentPageKey === 'user') {
        this.hideClose = false
      } else {
        this.hideClose = true
      }
    }
  },

  setup () {
    this.store = new LocalStorageUtil('launcher')
    this.recentHistoriesApps = this.store.getObject("histories") || []
  },

  actions: {
    openPage (scope) { // 打开页面
      let appObject = null
      let isLocal = false
      if (scope.name) {
        appObject = scope
        isLocal = true
      } else if (Array.isArray(scope) && scope[0] && scope[0].item && scope[0].item.name) {
        appObject = scope[0].item
      }

      if (appObject) {
        this._openAppPage(appObject, isLocal)
      }
    },

    _openAppPage (appObject, isLocal) { // 按应用名称打开应用
      const existedIndex = this.openedPageList.findIndex( page => page.title === appObject.name)

      if (!isLocal) {
        this.recentHistoriesApps = [appObject, ...this.recentHistoriesApps.filter(x => x.name && x.name !== appObject.name)]
        this.store.saveObject('histories', this.recentHistoriesApps)
      }
      if (existedIndex === -1) {
        const appName = appObject.name
        const index = appObject.ridgeEntries?.mobile || 'mobile'
        this.openedPageList.unshift({
          title: appName,
          key: appName,
          packageName: appName,
          pagePath: index
        })
      }
      this.currentPageKey = appObject.name
    },

    closePage () { // 关闭页面
      this.openedPageList = this.openedPageList.filter( e => e.key !== this.currentPageKey)
      this.currentPageKey = 'home'
    }
  }
  
}
