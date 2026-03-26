import { fetchRidgeCloudAPI } from '/npm/ridge-common/js/utils.js'

export default {
  name: 'LuncherHome',
  properties: [{
    label: '最近打开应用',
    name: 'historyApps'
  }],
  events: [{
    label: '应用打开',
    name: 'openApp'
  }],
  state: {
    searchValue: '', // 搜索条件
    topApp: { // 应用-今日推荐
      name: '--', // 名称
      coverUrl: '', // 图片地址
    },
    historyApps: [], // 最近打开应用
    recommendApps: [] // 推荐应用
  },

  computed: {
    historyAppIcon: scope => `${scope.item.name}/${scope.item.icon ?? 'icon.png'}`,
    appCoverUrl: scope => `${scope.item.name}/${scope.item.cover || 'cover.png'}`, // 应用封面图
    appDescription: scope => `${scope.item.description}`, // 应用名称
  },

  async setup() {
    this._fetchData()
  },

  actions: {
     async _fetchData () {
       try {
         const repoData = await fetchRidgeCloudAPI('/api/repo/app/query?devices=mobile')
         this.recommendApps = repoData.data
       } catch (e) {
         console.error('fetch repo query fail', e)
         // fetch error
       }
     }
  }
}
