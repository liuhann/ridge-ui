import './utils.js'

export default {
  name: 'RidgeCloudUser',
  description: 'Ridge Cloud页面用户状态库',
  state: {
    displayState: 'unlogin', // 登录状态面板值
    userAvatarUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MCA1MCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgNTAgNTAiPjxj aXJjbGUgZmlsbD0iI2VlZSIgY3g9IjI1IiBjeT0iMjUiIHI9IjI1Ii8+PHBhdGggZmlsbD0iIzY2NiIgZD0iTTE5Ljg5IDIxLjI1YzAtMi43NiAyLjI5LTUgNS4xMS01 czUuMTEgMi4yNCA1LjExIDUtMi4yOSA1LTUuMTEgNS01LjExLTIuMjQtNS4xMS01em0tNC4yNiAxNC4xN2gxLjdjMC00LjE0IDMuNDQtNy41IDcuNjctNy41czcuNjcg My4zNiA3LjY3IDcuNWgxLjcxYzAtMy44My0yLjQyLTcuMTItNS44NC04LjQ5IDEuOTYtMS4xNyAzLjI4LTMuMjcgMy4yOC01LjY4IDAtMy42OC0zLjA2LTYuNjctNi44 Mi02LjY3cy02LjgyIDIuOTktNi44MiA2LjY3YzAgMi40MSAxLjMyIDQuNTEgMy4yOCA1LjY4LTMuNDIgMS4zNy01LjgzIDQuNjYtNS44MyA4LjQ5eiIvPjwvc3ZnPg==', // 用户头像地址
    userCoverUrl: '', // 用户头像背景
    userId: '请点击头像注册/登录', // 用户账号（手机号码）
    showLoginDialog: false, // 显示登录
    showRegisterDialog: false // 显示注册
  },

  async setup () {
    this.checkLoginStatus()
  },

  destory () {
  },

  watch: {
  },

  actions: {
    async checkLoginStatus () { // 检查用户登录状态
      const response = await fetchRidgeCloudAPI('/api/user/current')
      if (response == null || response.data.code === '100404') {
        showError('获取当前用户接口未找到')
        this.state.displayState = 'unlogin'
      } else if (response.data.user) {
        this.state.userId = response.data.user.id
        this.state.displayState = 'logon'
        this.userAvatar = '/img/user/' + this.state.userId + '.webp'
        this.userCover = '/img/cover/' + this.state.userId + '.webp'
        globalThis.ridgeUser = response.data.user
      } else {
        this.state.displayState = 'unlogin'
      }
    },

    openLoginDialog () { // 打开登录对话框
      this.showLoginDialog = true
      this.showRegisterDialog = false
    },

    openRegisterDialog () { // 打开注册对话框
      this.showRegisterDialog = true
      this.showLoginDialog = false
    },

    closeAllDialog () { // 关闭所有对话框
      this.showRegisterDialog = false
      this.showLoginDialog = false
    },

    async logout () { // 退出登录
      if (confirm('您将退出登录，是否继续?')) {
        const response = (await this.axios.post('/api/user/logout', {}, {
          withCredentials: true
        })).data
        this.checkLoginStatus()
      }
    }
  }
}
