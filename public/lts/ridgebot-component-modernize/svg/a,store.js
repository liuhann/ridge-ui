
export default {
  name: 'StoreExample',
  state: () => {
    return {
      percent: 10, 
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
      this.state.name = 'Ｎｉｈａｏ'
      this.percent = 20
    }
  }
}
