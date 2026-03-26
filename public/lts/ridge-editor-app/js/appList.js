import { downloadAppPackage, getStoreStatus, fullscreenLoading, showAlert, removeApp, fetchRidgeCloudAPI } from '/npm/ridge-common/js/utils.js'
export default {
  name: 'AppList',
  state: {
    userApps: [],
    quotaPercent: 2,  // 存储使用百分比
    quotaText: '',  // 存储使用文本
    currentBtnDisabled: true, // 按钮置灰
    currentTreeApp: '',
    currentAppName: '',
    currentAppVersion: '',
    currentAppDesc: '',
    currentAppUpload: '',
    size: '', // 包大小
    appGlobalUrl: '', // 应用访问地址
    currentAppPublishStatus: '', // 发布状态
    currentAppCollectStatus: '' // 收录状态
  },

  async setup () {
    this.appService = this.composite.context.services.appService
    this.reload()
  },
  
  actions: {
    async reload () {
      const storeStatus = await getStoreStatus()
      if (storeStatus && storeStatus.userAppTree) {
        this.userApps = storeStatus.userAppTree
        this.quotaPercent = storeStatus.quotaPercentL
        this.quotaText = storeStatus.quotaText
        if (this.userApps.length > 0) {
          this.currentTreeApp = this.userApps[0].key
          this.currentBtnDisabled = false
          this.treeNodeChange()
        } else {
          this.currentBtnDisabled = true
        }
      }
    },
    
    async openApp () { // 打开应用
      const close = fullscreenLoading()
      try {
        const zipData = await downloadAppPackage(this.currentAppName)
        await this.appService.importAppArchive(zipData)
        await showAlert('应用已经导入，点击确认刷新页面')
        location.reload()
      } catch (e) {
        await showAlert('应用打开异常')
        this.openingApp = false
      } finally {
        close()
      }
    },

    async removeApp () {
      const close = fullscreenLoading()
      try {
        await removeApp(this.currentAppName)
        await this.reload()
      } catch (e) {
        // 
      } finally {
        close()
      }
    },

    treeNodeChange () {
      const resultDict = {
        success: '已成功发布',
        queue: '发布中',
        'not-allowed': '发布失败：无权限'
      }
      const currentSelectedApp = this.userApps.find(app => app.key === this.currentTreeApp)
      this.currentAppName = currentSelectedApp.item.name
      this.currentAppVersion = currentSelectedApp.item.version
      this.currentAppDesc = currentSelectedApp.item.description
      this.currentAppUpload = currentSelectedApp.item.updatedAt
      this.currentAppCollectStatus = '未收录'
      if (currentSelectedApp.item.published === true) {
        this.currentAppPublishStatus = '已发布'
        this.appGlobalUrl = 'https://ridgeui.com/npm/' + this.currentAppName + '/'
        if (currentSelectedApp.item.collect === true) {
          this.currentAppCollectStatus = '已收录'
        }
      } else {
        this.currentAppPublishStatus = '未发布'
        this.appGlobalUrl = ''
      }
    },


    async requestForCollection () { // 提交收录
      const requesting = await fetchRidgeCloudAPI('/api/repo/request/commit', {
        method: 'POST',
        body: {
          name: this.currentAppName
        }
      })

      showAlert('应用已经提交收录')
    }
  }
}
