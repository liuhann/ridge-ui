import { getStoreStatus, deleteApp } from './utils.js'
export default {
  name: 'UserProfile',
  state: {
    id: '',
    avatar: '', // 头像
    type: '',
    typeLabel: '',
    showPromote: false,
    confirmed: '',
    payments: [],
    userApps: [],
    userAppTree: [],
    quotaPercent: 2,
    quotaText: '',
    npmToken: '',
    showAppList: false,
    currentTreeApp: '',
    currentAppName: '',
    currentAppVersion: '',
    currentAppDesc: '',
    currentAppUpload: '',
    currentAppPublishStatus: ''
  },

  async setup () {
    this.fetchUserStoreData()
  },

  actions: {
    async fetchUserStoreData () {
      const storeStatus = await getStoreStatus()

      Object.assign(this.state, storeStatus)

      if (this.currentTreeApp === '' && this.userApps.length) {
        this.currentTreeApp = this.userApps[0].name
        this.treeNodeChange()
      }
    },

    async removeApp () {
      await deleteApp(this.currentTreeApp)
      await this.fetchUserStoreData()
    },

    treeNodeChange () {
      const resultDict = {
        success: '已成功发布',
        queue: '发布中',
        'not-allowed': '发布失败：无权限'
      }
      const currentSelectedApp = this.userApps.find(app => app.name === this.currentTreeApp)
      this.currentAppName = currentSelectedApp.name
      this.currentAppVersion = currentSelectedApp.version
      this.currentAppDesc = currentSelectedApp.description
      this.currentAppUpload = currentSelectedApp.updatedAt
      this.currentAppPublishStatus = resultDict[currentSelectedApp.publishResult] || '未知'
    }
  }
}
