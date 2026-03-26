import { fetchRidgeCloudAPI, getStoreStatus } from '/npm/ridge-common/js/utils.js'

export default {
  name: 'RepoContributeForm',
  events: [{
    label: '提交成功',
    value: 'success'
  }],
  state: {
    userAppOptions: [], // 应用列表
    name: '',  // 组件名称
    iconImage: '', // 图标
    coverImage: '', // 覆盖图
    version: '', // 版本
    description: '', // 描述
    author: '', // 作者
    npmReadyName: '', // 检测通过的npm名称
    requestOk: false, // 请求成功
    requestMessage: '', // 表单提交的错误信息
    loading: false,  // 请求加载中
  },

  async setup () {
    this.init()
  },

  actions: {

    async init () {
      const storeStatus = await getStoreStatus()
      if (storeStatus && storeStatus.userAppTree) {
        this.userAppOptions = storeStatus.userAppTree
      }
    },
    
    async fetchFromRepo () { // 获取仓库
      if (!this.name) {
        return false
      }
      const packageObject = await fetchRidgeCloudAPI(`/npm/${this.name}/package.json`)

      if (!packageObject.name) {
        this.npmReadyName = ''
        this.requestMessage = '您的应用未找到：请先访问此地址进行验证 ' + `https://ridgeui.com/npm/${this.name}/package.json`
        return
      }

      if (packageObject.ridgeType !== 'app') {
        this.npmReadyName = ''
        this.requestMessage = '输入的包名不是有效的RidgeUI应用，请检查'
        return
      }
      this.iconImage = '/npm/' + this.name + '/' + (packageObject.icon ?? 'icon.png')
      this.coverImage = '/npm/' + this.name + '/' + (packageObject.cover ?? 'cover.png')
      this.version = packageObject.version
      this.description = packageObject.description
      this.author = typeof packageObject.author === 'object' ? packageObject.author.name : packageObject.author

      
      this.npmReadyName = this.name
    },

    gohome() { // 返回首页
      location.href = '/'
    },

    gostep1() { // 返回上一步
      this.currentStep = '0'
    },
    
    async subscribe () { // 提交
      if (!this.npmReadyName) {
        this.requestMessage = '请确认npm包通过检测 当前名称：' + (this.name || '无')
        return
      }
      this.loading = true

      const result = await fetchRidgeCloudAPI(`/api/repo/request/commit`, {
        method: 'POST',
        body: {
          name: this.name
        }
      })
      this.loading = false

      if (result.code !== '0') {
        this.requestMessage = `请求异常，${result.code}: ${result.msg}`
      } else {
        this.requestMessage = ''
        this.emit('success')
      }
   }
  }
}
