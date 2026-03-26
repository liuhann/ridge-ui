
export default {
  name: 'UserManage',
  state: {
    errorMessage: '', // 错误信息
    userList: [], // 用户列表
    purchaseModalVisible: false, // 对话框可见
    columns: [  
      {
        "label": "手机号码",
        "value": "id"
      },
      {
        "label": "类型",
        "value": "type"
      }
    ],
    rows: [],
    currentId: '', // 当前账号
    registered: '', // 注册时间
    purchased: '', // 购买时间
    purchasedCode: '', // 尾号
    purchaseType: '', // 购买类型
    filter: '' // 过滤条件
  },

  async setup () {
    this.fetchUserList()
  },

  destory () {
  },

  watch: {
  },

  actions: {
    async fetchUserList() { // 获取用户列表
      try {
        const fetching = await fetch(`/api/user/manage/list?id=` + this.filter)
        const result = await fetching.json()
  
        if (result.code === '0') {
          this.rows = result.data.list
        } else {
          this.errorMessage = '无权限操作 code=' + result.code
        }
      } catch (e) {
        this.errorMessage = '未知异常'
      }
    },
    async _fetchPurchase(id) {
      try {
        const fetching = await fetch(`/api/user/purchase/get?id=${id}`)

        return (await fetching.json()).data
      } catch (e) {
        
      }      
    },

    async confirmPurchase () { // 升级确认
       try {
        const fetching = await fetch(`/api/user/manage/confirm`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: this.currentId,
          })
        })

        const result = (await fetching.json()).data

      } catch (e) {
        
      }   
    },
    async itemClick (data) {  // 单行点击
      console.log(data)

      const purchase = await this._fetchPurchase(data.id)
      this.purchaseModalVisible = true
      this.currentId = data.id
      this.registered = data.registered
      this.purchased = purchase.updatedAt ?? ''
      this.purchasedCode = purchase.code ?? ''
      this.purchaseType = purchase.type ?? ''
      
      console.log(purchase)
    }
  }
}
