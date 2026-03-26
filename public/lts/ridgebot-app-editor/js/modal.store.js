
export default {
  name: 'StoreExample',
  state: () => {
    return {
      open: false,  // 模态框打开
    }
  },

  computed: {
    
  },

  async setup () {
  },

  destory () {
  },

  watch: {
  },

  actions: {
    openDialog () {  // 打开对话框
      this.state.open = true
    },
    closeDialog() { // 关闭对话框
      this.state.open = false
    }
  }
}
