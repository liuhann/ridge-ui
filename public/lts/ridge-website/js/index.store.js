export default {
  name: 'WebSiteIndex',
  state: {
    index: 'bootstrap',
    theme: 'light',
    mobilePreviewVisible: false, // 移动预览打开
    mobilePreviewApp: '', // 移动预览应用名
    mobilePreviewPage: '', // 移动预览应用页面
    tabletPreviewVisible: false, // 平板预览打开
    tabletPreviewApp: '', // 平板预览应用名
    tabletPreviewPage: '', // 平板预览应用页面
  },
  actions: {
    toggleTheme(newTheme) {
      this.theme = newTheme
    },

    openMobilePreview (payload) { // 打开移动预览
      this.mobilePreviewVisible = true
      this.mobilePreviewApp = payload.app
      this.mobilePreviewPage = payload.page
    },

    openTabletPreview (payload) { // 打开平板预览
      if (payload.page) {
        window.open('/npm/' + payload.app + '/' + payload.page)  
      } else {
        window.open('/npm/' + payload.app + '/')  
      }
    }
  }
}
