import { getStoreStatus } from '/npm/ridge-common/js/utils.js'
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
    userAppTree: [],
    quotaPercent: 2,
    quotaText: '',
  },

  async setup () {
    this.fetchUserStoreData()
  },

  actions: {
    async fetchUserStoreData () {
      const storeStatus = await getStoreStatus()
      Object.assign(this.state, storeStatus)
    }
  }
}
