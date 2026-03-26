export default {
  name: 'componentTabs',
  externals: {
    axios: 'axios/dist/axios.min.js'
  },
  properties: [{
    label: "标签",
    name: "tabKey"
  }],
  
  state: () => {
    return {
      index: 1
    }
  },

  async setup () {
    this.axios.defaults.withCredentials = true
    this.serverUrl = this.composite.appPackageObject.ridgeServerUrl || 'http://localhost:7080'
  },

  destory () {
  },

  watch: {
  },

  actions: {
   subscribe() {
     //
   }
  }
}
