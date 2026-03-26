import { fetchRidgeCloudAPI } from '/npm/ridge-common/js/utils.js'

export default {
  name: 'RepoComponents',
  properties: [{
    label: '类型',
    name: 'type',
    type: 'string'
  }],
  state: {
    packageList: [], // 组件包列表
    showPreviewMobileDialog: false, // 移动预览
    mobileCurrentApp: '', // 移动应用
    mobileCurrentPage: '', // 移动页面
    showPreviewPadDialog: false, // 平板预览
    padCurrentApp: '', // 平板应用
    padCurrentPage: '', // 平板页面
    installVisible: false // 安装按钮可见性
  },

  computed: {
    itemPackageName (scope) { // 单项-包名称
      return scope.item.name
    },
    itemPackageIcon (scope) { // 单项-包图标
      return `${scope.item.name}/${scope.item.icon || 'icon.png'}`
    },
    itemPackageCover (scope) { // 单项-包图片
      return `${scope.item.name}/${scope.item.cover || 'cover.png'}`
    },
    itemPackageVersion (scope) { // 单项-包最新版本
      return scope.item.version
    },
    itemPackageDesc (scope) { // 单项-包描述
      return scope.item.description
    },
    itemPackageAuthor (scope) { // 单项-包作者
      return scope.item.author?.name
    },
    itemPackageInstalled (scope) { // 单项-是否已安装
      return scope.item.installed
    },
    itemPackageShowInstallBtn (scope) { // 单项-显示安装按钮
      return !scope.item.installed
    },
    itemPackageActionLayer (scope) { // 单项-操作层索引
      return scope.item.actionState
    },
    itemMobileDisabled(scope) { // 是否移动首页
      return scope.item.ridgeEntries?.mobile
    },
    itemDesktopDisabled(scope) { // 是否桌面首页
      return scope.item.ridgeEntries?.desktop
    }
  },

  async setup () {
    this.fetchComponentPackages()

    this.appService = this.composite.context.services.appService

    if (this.appService) {
      this.installVisible = true
    }
  },

  destory () {
  },

  watch: {
  },

  actions: {
    async fetchComponentPackages () {
      let packageList = []
      try {
        const repoData = await fetchRidgeCloudAPI('/api/repo/app/query')
        this.packageList = repoData.data
      } catch (e) {

      }
    },

    async installPackage (scope) { // 安装组件包
      const packageJSONObject = await this.appService.getPackageJSONObject()
      packageJSONObject.dependencies[scope.item.name] = '^' + scope.item.version

      await this.appService.savePackageJSONObject(packageJSONObject)

      this.fetchComponentPackages()
    },

    async viewApp (scope) { // 查看应用
      window.open(`/npm/${scope.item.name}/`, '_blank')
    },

    async editInEditor (scope) { // 在编辑器中打开
      window.open(`/npm/ridge-editor/?import=${scope.item.name}`, '_blank')
    },
    
    changeName () { // 改名
      this.state.name = 'VisionFlow'
    },

    async openPreviewDesktop(scope) { // 打开桌面预览
      window.open('/npm/' + scope.item.name + '/')
    },

    async openPreviewMobile(scope) { // 打开移动预览
      this.showPreviewMobileDialog = true
      this.mobileCurrentApp = scope.item.name
      this.mobileCurrentPage = scope.item.ridgeEntries?.mobile
    }
  }
}
