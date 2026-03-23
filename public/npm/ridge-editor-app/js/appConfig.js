import { getStoreStatus, fullscreenLoading, showAlert, showConfirm, showMessage, uploadAppPackage, selectFile } from '/npm/ridge-common/js/utils.js'

export default {
  name: 'RidgeAppConfig',
  events: [{
    label: '配置保存',
    value: 'saved'
  }],
  state: {
    packageName: '',
    packageIcon: '',
    packageCover: '', // 覆盖图
    packageVersion: '',
    packageAuthor: '',
    packageDescription: '',
    homeMobile: '',
    homeDesktop: '',
    homeTablet: '',
    packageListData: [],
    packageKeywords: [],
    packageHomePage: '',
    dialogAppConfig: false, // 应用配置对话框
    dialogAppPublish: false,
    showLocalRecoverDialog: false, // 显示恢复本地地址对话框
    userAppTree: [], // 用户应用列表树
    homePages: { // 首页支持
      mobileEnabled: false,
      desktopEnabled: false,
      tabletEnabled: false,
      homeMobile: 'index', // 移动端首页
      homeDesktop: 'index', // 桌面首页
      homeTablet: 'index'  // 平板首页
    },
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
      // this.appService = this.composite.context.services.appService
  },

  destory () {
  },

  watch: {
  },

  actions: {
    openDialogAppConfig () {
      this.updateState()
      this.dialogAppConfig = true
    },
    async initUserStore () {
      this.userStoreStatus = await getStoreStatus()
      if (this.userStoreStatus == null) {
        this.cloudDisabled = true
      } else {
        this.cloudDisabled = true
        this.publishDisabled = !this.userStoreStatus.allowPublish
        this.userAppTree = this.userStoreStatus.userAppTree
      }
    },

    

    async updateState () {
      const packageObject = await this.appService.getPackageJSONObject()
      this.packageObject = packageObject
      this.state.packageName = packageObject.name ?? ''
      this.state.packageIcon = packageObject.icon ?? 'icon.png'
      this.state.packageCover = packageObject.cover ?? 'cover.png'
      this.state.packageVersion = packageObject.version ?? ''
      this.state.packageAuthor = packageObject.author ?? ''
      this.state.packageDescription = packageObject.description ?? ''

      if (packageObject.ridgeEntries) {
        this.homePages = {
          mobileEnabled: packageObject.ridgeEntries.mobile ? true: false,
          desktopEnabled: packageObject.ridgeEntries.desktop ? true: false,
          tabletEnabled: packageObject.ridgeEntries.tablet ? true: false,
          homeMobile: packageObject.ridgeEntries.mobile, // 移动端首页
          homeDesktop: packageObject.ridgeEntries.desktop, // 桌面首页
          homeTablet: packageObject.ridgeEntries.tablet  // 平板首页
        }
      }

      this.state.packageListData = []
      for (const packageName in packageObject.dependencies || {}) {
        const object = await this.composite.context.loader.getPackageJSON(packageName)
        if (object) {
          this.state.packageListData.push(object)
        }
      }
    },

    async getPackageObject () {
      const packageObject = await this.appService.getPackageJSONObject()

      const ridgeEntries = {
      }

      if (this.homePages.mobileEnabled) {
        ridgeEntries.mobile = this.homePages.homeMobile
      }
      if (this.homePages.desktopEnabled) {
        ridgeEntries.desktop = this.homePages.homeDesktop
      }
      if (this.homePages.tabletEnabled) {
        ridgeEntries.tablet = this.homePages.homeTablet
      }
      
      return Object.assign({}, packageObject, {
        name: this.state.packageName,
        icon: this.state.packageIcon,
        cover: this.state.packageCover,
        version: this.state.packageVersion,
        author: this.state.packageAuthor,
        description: this.state.packageDescription,
        keywords: this.state.packageKeywords,
        ridgeEntries,
        dependencies: this.packageObject.dependencies
      })
    },

    async save () { // 保存到浏览器存储
      await this.appService.savePackageJSONObject(await this.getPackageObject())
      this.dialogAppConfig = false
      this.emit('saved')
      showMessage('应用配置已经保存')
    },

    async deleteDependency (scope) { // 删除依赖
      delete this.packageObject.dependencies[scope.item.name]

      this.state.packageListData = this.state.packageListData.filter(p => p.name !== scope.item.name)
    },

    openBilibili() {
      window.open('https://space.bilibili.com/621457166', '_blank')
    },
    openHelpDoc() {
      window.open('https://ridgeui.com/#/pages/document', '_blank')
    },

    openHistoryDialog() { // 打开本地历史对话框
      this.showLocalRecoverDialog = true
    },

    closeConfigDialog () {
      this.state.dialogAppConfig = false
    }
  }
}
