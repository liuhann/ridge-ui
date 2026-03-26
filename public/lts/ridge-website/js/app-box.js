import { fetchRidgeCloudAPI } from '/npm/ridge-common/js/utils.js'

export default {
  name: 'AppBox',
  properties: [{
    label: '应用名称',
    name: 'app',
    type: 'string'
  }],
  events: [{
    label: '打开移动预览',
    name: 'openMobilePreview'
  }, {
    label: '打开平板预览',
    name: 'openTabletPreview'
  }],
  state: {
    name: '', // 应用名称
    icon: '', // 应用图标
    cover: '', // 应用封面图
    mobilePage: '', // 移动端首页
    desktopPage: '', // 桌面首页
    tabletPage: '', // 平板首页
    id: '', // 应用标识
  },

  setup() {
    this.loadApp()
  },

  actions: {
    async loadApp () {
      if (this.properties.app) {
        const appJsonObject = await fetchRidgeCloudAPI(`/npm/${this.properties.app}/package.json`)
        this.id = appJsonObject.name
        this.name = appJsonObject.description
        this.icon = `/npm/${this.id}/${appJsonObject.icon ?? 'icon.png'}`
        this.cover = `/npm/${this.id}/${appJsonObject.cover ?? 'cover.png'}`
        this.mobilePage = appJsonObject.ridgeEntries?.mobile
        this.desktopPage = appJsonObject.ridgeEntries?.desktop
        this.tabletPage = appJsonObject.ridgeEntries?.tablet
      }
    },
    
    async editInEditor () { // 在编辑器中打开
      window.open(`/npm/ridge-editor/?import=${this.id}`, '_blank')
    },
    

    openMobileApp() {
      this.emit('openMobilePreview', {
        app: this.id,
        page: this.mobilePage
      })
    },

    openTabletApp() {
      this.emit('openTabletPreview', {
        app: this.id,
        page: this.tabletPage
      })
    }
  }
}
