export default {
  name: 'PackageJSONEdit',
  label: '应用包管理',
  properties: [{
    name: 'value',
    label: '应用包数据',
    type: 'object'
  }],
  events: [],
  state: (props) => {
    const { name = '', version = '', author = '', description = '', dependencies = {} } = props.value ?? {}
    return {
      dialogConfirmDeletePackage: false, // 显示删除确认框
      deletePackageName: "",
      message: '', // 当前消息
      messageType: '', // 消息类型
      componentPackages: [], // 已安装组件包
      packageJSONObject: { // 应用包
        name, // 名称-全称
        version, // 版本
        description, // 描述
        author, // 作者
        dependencies // 依赖
      }
    }
  },

  computed: {
    name: { // 包名称-供更改
      get: states => {
        const [, ...rest] = states.packageJSONObject.name.split('-')
        return rest.join('-')
      },
      set: (name, states) => {
        states.packageJSONObject.name = 'ridgeapp-' + name
      }
    },

    packageIcon: scoped => { // Scope-组件包-图标
      return ridge.baseUrl + '/' + scoped.item.name + '/' + scoped.item.icon
    },
    packageName: scoped => { // Scope-组件包-名称
      return scoped.item.name
    },
    packageDesc: scoped => { // Scope-组件包-描述
      return scoped.item.description
    },
    packageVersion: scoped => { // Scope-组件包-版本
      return scoped.item.version
    }
  },

  async setup () {
    if (window.ridge) {
      for (const packageName in this.state.packageJSONObject.dependencies) {
        this.state.componentPackages.push(await window.ridge.loader.getPackageJSON(packageName))
      }
    }
  },
  watch: {
    packageJSONObject () {
      this.emit('input', this.packageJSONObject)
    }
  },

  actions: {
    async confirmDeletePackage (scope) { // 删除组件包
      delete this.packageJSONObject.dependencies[scope.item.name]
      this.state.componentPackages = this.state.componentPackages.filter(pkg => pkg.name !== scope.item.name)
      this.emit("input", this.packageJSONObject)
       // this.dialogConfirmDeletePackage = false
    },
    goInstallPackage () { // 打开包安装
      this.emit("linkInstall")
    }
  }
}
