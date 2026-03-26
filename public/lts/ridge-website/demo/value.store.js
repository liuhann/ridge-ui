
export default {
  name: 'StoreExample',
  state: () => {
    return {
      booleanToggle: false, // 布尔-定时切换
      stringValue: '您好', // 字符串值
      array: [],  // 数组
      step: 1,  // 1-10步骤
      dialogShow: false, // 布尔类型
      timeDate: null, // 时间类型
      numberValue: null, // 数字类型
      fileArray: []  // 文件列表
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
    },
    showDialog() {
      this.state.dialogShow = true
    }
  }
}
