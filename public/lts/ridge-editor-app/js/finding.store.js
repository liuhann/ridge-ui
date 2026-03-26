export default {
  name: 'PackageFindingStore',
  properties: [{
    name: 'packageJSONObject',
    label: '应用包信息',
    type: 'object'
  }],
  state: () => {
    return {
      packageCategories: [{ // 包分类
        label: '推荐',
        description: 'Ridge官方收录的组件包列表',
        value: 'recommond'
      }, {
        label: 'NPM仓库',
        description: '从全球NPM仓库搜索符合ridge组件规范的组件包',
        value: 'npm'
      }],
      currentCategory: 'recommond', // 当前分类
      filteredPackageList: [], // 按条件过滤的组件包列表
      ridgeRegistryData: [], // 所有注册组件包
      packageTotalNumber: 0, // 组件包列表总条目数
      filteredPageNumber: 0 // 列表当前页
    }
  },

  computed: {
    itemPackageName (scope) { // 单项-包名称
      return scope.item.name
    },
    itemPackageIcon (scope) { // 单项-包图片
      return `/npm/${scope.item.name}/${scope.item.icon}`
    },
    itemPackageVersion (scope) { // 单项-包最新版本
      return scope.item.version
    },
    itemPackageDesc (scope) { // 单项-包描述
      return scope.item.description
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
    const ridgeRegistryData = await this.axios.get('/npm/ridge-registry/ridge-registry.json')

    this.ridgeRegistryData = ridgeRegistryData.data

    // this.filteredPackageList = await this._loadPackagesInfo([
    //     'ridge-basic',
    //     'ridge-container',
    //     'ridge-tailwind',
    //     'ridge-bootstrap',
    //     'ridge-highcharts',
    //     'ridge-semi',
    //     'ridge-antd'
    //   ])
    this.packageTotalNumber = this.ridgeRegistryData.packages.length

    this.filteredPackageList = this.ridgeRegistryData.packages.map(pkg => {
      if (this.properties.packageJSONObject && this.properties.packageJSONObject.dependencies && this.properties.packageJSONObject.dependencies[pkg.name]) {
        pkg.installed = true
        pkg.actionState = 1
      } else {
        pkg.installed = false
        pkg.actionState = 0
      }
      return pkg
    })
  },

  destory () {
  },

  watch: {
  },

  actions: {
    async _loadPackagesInfo (names) {
      const packageObjectList = []
      for (const name of names) {
        try {
          const fetched = await this.axios.get(`/api/npm/get?name=${name}&version=latest`)
          if (fetched.data.code === '0') {
            const packageInfo = fetched.data.data
            if (this.packageJSONObject && this.packageJSONObject.dependencies && this.packageJSONObject.dependencies[packageInfo.name]) {
              packageInfo.installed = true
              packageInfo.actionState = 1
            } else {
              packageInfo.installed = false
              packageInfo.actionState = 0
            }
            packageObjectList.push(packageInfo)
          }
        } catch (e) {
        }
      }
      return packageObjectList
    },

    installPackage (scope) { // 安装组件包
      this.filteredPackageList = this.filteredPackageList.map(pkg => {
        if (pkg.name === scope.item.name) {
          pkg.installed = true
        }
        return pkg
      })
      this.emit('install', {
        name: scope.item.name,
        version: scope.item.version
      })
    },
    changeName () { // 改名
      this.state.name = 'VisionFlow'
    }
  }
}
