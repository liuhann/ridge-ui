
export default {
  name: 'HelloStore',
  state: () => {
    return {
      name: 'Ridge' //姓名
    }
  },

  computed: {
    hello: (state) => { // 欢迎语
      return 'Hello ' + state.name
    }
  },

  async setup () {
  },

  destory () {
  },

  watch: {
  },

  actions: {
    changeName () {  // 改名
      this.state.name = 'VisionFlow'
    }
  }
}
