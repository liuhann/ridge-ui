import { getStoreStatus, fullscreenLoading, showAlert, showConfirm, showMessage, uploadAppPackage, selectFile } from '/npm/ridge-common/js/utils.js'

export default {
  name: 'RidgeAppShare',
  state: {
    packageName: '', // 应用名称
    usageText: '', // 应用使用情况
    publishOnSave: false,    // 选择保存同时发布
    publishedUrl: '', // 发布后应用访问地址
    appPublishing: false, // 应用发布中
    cloudDisabled: true, // 禁用云功能    
    publishDisabled: true // 禁止发布
  },
  computed: {
    collectionDisabled () {
      return this.publishOnSave.length === 0
    },
    scopedPackageIcon (scoped) { // Scope-组件包-图标
      return this.composite.context.baseUrl + '/' + scoped.item.name + '/' + scoped.item.logo
    },
    scopedPackageName: scoped => { // Scope-组件包-名称
      return scoped.item.name
    },
    scopedPackageDesc: scoped => { // Scope-组件包-描述
      return scoped.item.description
    },
    scopedPackageVersion: scoped => { // Scope-组件包-版本
      return scoped.item.version
    }
  },

  async setup () {
    this.appService = this.composite.context.services.appService
    this.initShare()
    this.initUserStore()
  },

  destory () {
  },

  watch: {
  },

  actions: {
    async initUserStore () {
      this.userStoreStatus = await getStoreStatus()
      if (this.userStoreStatus == null) {
        this.cloudDisabled = true
      } else {
        this.usageText = '应用限额：' + this.userStoreStatus.quotaText
        if (this.userStoreStatus.quotaTextL >= 100 && !this.userStoreStatus.userAppTree.find(app => app.key === this.packageName)) { 
          this.cloudDisabled = true
        } else {
          this.cloudDisabled = false
        }
        if (this.userStoreStatus.rule.npm) {
          this.publishDisabled = false
        }
      }
    },

    async initShare () {
      const packageObject = await this.appService.getPackageJSONObject()
      this.packageObject = packageObject
      this.state.packageName = packageObject.name ?? ''
      this.publishedUrl = `https://ridgeui.com/npm/${packageObject.name}/`
    },

    async publishApp () { // 发布应用
      const cancel = fullscreenLoading()
      const appService = this.composite.context.services.appService
      const result = await uploadAppPackage(await this.getPackageObject(), await appService.getAppFileBlob(), this.publishOnSave)
      cancel()
      if (result === '1') {
        showMessage('应用包上传到云端成功')
      } else {
        showAlert(result)
      }
    },

    async importAppZip () { // 导入应用
      if (await showConfirm('导入应用将会覆盖现有工作区内容，请提前做好备份。是否继续?')) {
        const file = await selectFile()
        if (file) {
          await this.appService.importAppArchive(file)
          await showAlert('导入完成，点击确认刷新页面')
          location.reload()   
        }
      }
    },

    async exportAppZip () { // 导出应用
      await this.appService.exportAppArchive()
    },

    async getPackageObject () {
      return await this.appService.getPackageJSONObject()
    }
  }
}
