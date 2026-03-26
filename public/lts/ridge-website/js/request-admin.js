export default {
  name: 'RequestAdmin',
  externals: {
    axios: 'axios/dist/axios.min.js'
  },
  state: {
    skip: 0,
    limit: 200,
    selectedNames: [],
    requests: [],
    reposList: [],
    rowKey: 'name',
    repoColumns: [{
      value: "name",
      label: '名称'
    }, {
      value: "description",
      label: '描述'
    }, {
      value: "version",
      label: '版本'
    }, {
      value: "type",
      label: '类型'
    }],
  },
  
  async setup () {
    this.axios.defaults.withCredentials = true
    this.fetchRepoData()
  },

  destory () {
  },

  watch: {
  },

  actions: {
    async fetchRepoData() {
      const result = (await this.axios.get(`/api/repo/request/list?skip=${this.skip}&limit=${this.limit}`)).data

      this.requests = result.data

      const reposList = (await this.axios.get(`/api/repo/query?skip=${this.skip}&limit=${this.limit}`)).data

      this.reposList = reposList.data
    },

    async approve () {
      for (const name of this.selectedNames) {
        const result = (await this.axios.post(`/api/repo/request/approve`, {
          name: name,
          approved: 'true'
        })).data
      }
      await this.fetchRepoData()
    },

    async onSelected(keys) {
      this.selectedNames = keys
    },

    async reject () {
      
    }
  }
}
