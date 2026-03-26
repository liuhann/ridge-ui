import LocalStorageUtil from '/npm/ridge-common/js/storage.js'

export default {
  name: 'LauncherIndex',
  state: {
    pageOpened: false, // 应用是否打开
    switchTabIndex: 1, // 整体切换索引
    currentPageKey: 'home', // 当前显示页面
    currentPageTitle: '' , // 当前页面标题
    openedPageList: [], // 当前打开的页面列表
    recentHistoriesApps: [], // 最近打开的应用
    currentOpenedApps: [], // 当前打开得应用
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
          title: appObject.description,
          id: appName,
          packageName: appName,
          pagePath: index
        })
      }
      this.currentPageTitle = appObject.description
      this.currentPageKey = appObject.name
      this.switchTabIndex = 2
      this.pageOpened = true
    },

    minimizePage () { // 最小化
      this.pageOpened = false
    },
    closePage () { // 关闭页面
      this.pageOpened = false
      
      setTimeout( () => {
        this.openedPageList = this.openedPageList.filter( e => e.id !== this.currentPageKey)
      }, 300)
    }
  }
  
}
