import { fetchRidgeCloudAPI } from '/npm/ridge-common/js/utils.js'

export default {
  name: 'RepoComponents',
  events: [{
    name: 'packageAppended',
    label: '点击安装'
  }],
  state: {
    type: 'component', // 组件类型
    packageList: [], // 组件包列表
    installVisible: false // 安装按钮可见性
  },

  computed: {
    itemPackageName (scope) { // 单项-包名称
      return scope.item.name
    },
    itemPackageIcon (scope) { // 单项-包图片
      return `${scope.item.name}/${scope.item.logo}`
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
    }
  },

  async setup () {
    this.appService = this.composite.context.services.appService
    if (this.appService) {
      this.installVisible = true
    }
    this.fetchComponentPackages()
  },

  destory () {
  },

  watch: {
  },

  actions: {
    async fetchComponentPackages () {
      const packageList = (await fetchRidgeCloudAPI(`/api/repo/component/query`)).data

      if (this.appService && packageList.length) {
        const packageJSONObject = await this.appService.getPackageJSONObject()
        this.packageList = packageList.map(pkg => {
          if (packageJSONObject.dependencies && packageJSONObject.dependencies[pkg.name]) {
              pkg.installed = true
              pkg.actionState = 1
          } else {
              pkg.installed = false
              pkg.actionState = 0
          }
          return pkg
        })
      } else {
        this.packageList = packageList
      }        
    },

    async installPackage (scope) { // 安装组件包
      const packageJSONObject = await this.appService.getPackageJSONObject()
      packageJSONObject.dependencies[scope.item.name] = '^' + scope.item.version

      await this.appService.savePackageJSONObject(packageJSONObject)

      this.fetchComponentPackages()

      this.emit('packageAppended')
    },
    changeName () { // 改名
      this.state.name = 'VisionFlow'
    }
  }
}
