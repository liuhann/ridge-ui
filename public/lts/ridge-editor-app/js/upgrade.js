
export default {
  name: 'UserUpgrade',
  state: {
    type: 'pay', // 用户类型
    userId: '',  // 用户账号
    code: '',  // 后六位
    loading: false, // 请求中
    state: 'form' // 当前面板
  },
  computed: {
    typeLabel: (state) => { // 用户类型文本
      if (state.type === 'pay') {
        return '普通付费用户'
      } else {
        return '高级付费用户'
      }
    }
  },

  async setup () {
    this._initPurchagement()
  },

  destory () {
  },

  watch: {
  },

  actions: {
    _toast (msg, type = 'success') {
      if (window.SemiUI) {
        const { Toast } = window.SemiUI
        Toast[type](msg)
      }
    },
    
    async _initPurchagement() {
      const purchageObject = await (await fetch(`/api/user/purchase/get`)).json()

      if (purchageObject.data) {
        if (purchageObject.data.type) { // 已经提交过 显示已提交信息
          this.type = purchageObject.data.type
          this.userId = purchageObject.data.id
          this.code = purchageObject.data.code
          this.state = 'wait'
        } else {
          this.state = 'form'
        }
      }
    },

    async toggleEdit() {
      this.state = 'form'
    },

    async submitState() { // 提交购买信息
      if (this.code && this.code.length === 6) {
        this.loadding = true
        const fetching = await fetch(`/api/user/purchase/set`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
            },
          body: JSON.stringify({
            type: this.type,
            code: this.code
          })
        })
        this.loadding = false
        const result = await fetching.json()

        this.state = 'wait'
        this.userId = result.data.id
      } else {
         this._toast('请填写转账记录后6位', 'error')
      }
    }
  }
}
