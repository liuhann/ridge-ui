import { getUserStatus, logout } from '/npm/ridge-common/js/utils.js'
export default {
  name: 'UserPanel',
  description: '用户状态面板',
  state: {
    userAvatar: '/avatar.svg', // 用户头像
    userId: '', // 用户账号
    loginUserModalVisible: false, // 显示登录对话框
    userProfileModalVisible: false, // 显示用户概览对话框
    uploadAvatarVisible: false, // 上传头像对话框可见
    type: '', // 用户类型
    typeLabel: '', // 用户类型名称
    showPromote: false, // 显示升级按钮
    displayState: ''
  },

  computed: {
  },

  async setup () {
    this.checkLoginStatus()
  },

  destory () {
  },

  watch: {
  },

  actions: {
    openUserProfileModal () { // 打开用户配置
      if (this.userId) {
        this.userProfileModalVisible = true
      } else {
        this.openLoginModal()
      }
    },
    openLoginModal () { // 打开登录框
      this.loginUserModalVisible = true
    },

    async checkLoginStatus () { // 检查用户登录状态
      this.userId = ''
      this.userAvatar = '/avatar.svg'
      const user = await getUserStatus()
      if (user === 'disconnected') {
        this.displayState = 'community'
      } else if (user === 'unlogon') {
        this.displayState = 'unlogin'
      } else {
        this.displayState = 'logon'
        this.showPromote = user.showPromote
        this.typeLabel = user.typeLabel
        this.type = user.type
        this.userId = user.id
        this.userAvatar = '/avatar/' + this.state.userId + '.webp'
      }
    },

    async logout () { // 退出登录
      debugger
      if (await logout()) {
        this.userProfileModalVisible = false
        await this.checkLoginStatus()
      }
    },

    showUploadAvatarModal () { // 打开上传头像对话框
      this.uploadAvatarVisible = true
    },

    loginConfirmed () { // 登录成功
      this.loginUserModalVisible = false
      this.checkLoginStatus()
    },

    avatarChangeConfirmed () { // 头像修改完
      this.uploadAvatarVisible = false
      this.userAvatar = '/avatar/' + this.state.userId + '.webp'
    },

    profileClose () { // 配置框关闭
      this.userProfileModalVisible = false
    }
  }
}
