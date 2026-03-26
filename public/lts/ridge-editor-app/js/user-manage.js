export default {
  name: 'UserManageStore',
  properties: [{
    name: 'server',
    label: '服务地址',
    type: 'string',
    value: 'http://localhost:7080'
  }],
  events: [],
  state: {
    list: [],
    skip: 0,
    limit: 20,
    query: '',
    userid: '',
    password: '',
    registered: '',
    store: '',
    type: '',
    payments: []
  },

  computed: {
  },

  async setup () {
    this.loadUserList()
  },

  destory () {
  },

  watch: {
  },

  actions: {
    async loadUserList () {
      const result = await this.axios.get(this.properties.server + '/api/user/manage/list?skip=' + this.skip + '&limit=' + this.limit + '&id=' + this.query + '&token=' + localStorage.getItem('token'))
      this.list = result.data.data
    }
  }
}
