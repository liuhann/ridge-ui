import { getUserStatus, getCapchaUrl, logout, login, register, fullscreenLoading, showMessage, showError } from './utils.js'
const accountRegex = /^[A-Za-z0-9]{4,20}$/

const checkLogin = (id, password, captcha) => {
  // 验证手机号码
  if (!accountRegex.test(id)) {
    return '注意：用户账号 4-20位数字+字母组合'
  }

  // 验证密码
  if (!/^(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(password)) {
    return '注意：用户密码为数字+字母组合,至少8位'
  }

  if (captcha.length !== 4) {
    return '注意: 验证码长度为4'
  }
  return true
}

const checkRegister = (id, password, agreed, captcha) => {
  // 验证手机号码
  if (!accountRegex.test(id)) {
    return '注意：用户账号 4-20位数字+字母组合'
  }

  // 验证密码
  if (!/^(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(password)) {
    return '注意：用户密码为数字+字母组合,至少8位'
  }

  if (agreed.length === 0) {
    return '请点击同意条款'
  }

  if (captcha.length !== 4) {
    return '注意: 验证码长度为4'
  }
  return true
}

const ridgeBaseUrl = window.RIDGE_HOST ?? ''

export default {
  name: 'RidgeUser',
  description: 'Ridge Cloud页面用户状态库',
  events: [{
    name: 'login-success',
    label: '登录成功'
  }, {
    name: 'logout',
    label: '退出登录'
  }, {
    name: 'register-success',
    label: '注册成功'
  }],
  state: {
    userLogon: false, // 用户是否登录
    displayState: 'unlogin', // 登录状态面板值 logon/unlogin
    userAvatarUrl: ridgeBaseUrl + '/avatar/avatar.svg', // 用户头像地址
    userCover: '', // 用户背景，暂时不用
    userId: '', // 用户账号（手机号码）
    captchaUrl: '', // 验证码地址 （登录和注册用）
    captcha: '', // 验证码输入
    login: { // 登录信息
      id: '', // 用户账号
      password: '', // 用户密码
      resultMessage: '' // 错误信息
    },
    register: { // 注册信息
      id: '', // 账号
      password: '', // 密码
      passwordConfirm: '', // 确认密码
      agreed: [], // 同意条款
      resultMessage: '' // 错误信息
    },
    showLoginDialog: false, // 显示登录对话框
    showRegisterDialog: false // 显示注册对话框
  },

  async setup () {
    this.checkLoginStatus()
    await this.reloadCaptcha()
  },

  destory () {
  },

  watch: {
  },

  actions: {
    async checkLoginStatus () { // 检查用户登录状态
      const userInfo = await getUserStatus()
      if (userInfo && userInfo.id) {
        this.userLogon = true
        this.userId = userInfo.id
        this.userAvatarUrl = ridgeBaseUrl + '/avatar/' + userInfo.id + '.webp'
        this.displayState = 'logon'
      } else {
        this.userLogon = false
        this.userAvatarUrl = ridgeBaseUrl + '/avatar/avatar.svg'
        this.displayState = 'unlogin'
      }
    },
    async reloadCaptcha () { // 加载验证码
      const svg = await getCapchaUrl()
      this.captchaUrl = svg
    },

    openLoginDialog () { // 打开登录对话框
      this.showLoginDialog = true
    },

    async loginUser () { // 用户登录
      const result = checkLogin(this.login.id, this.login.password, this.captcha)

      if (result !== true) {
        this.login.resultMessage = result
        return
      }
      const close = fullscreenLoading()
      const loginResult = await login(this.login.id, this.login.password, this.captcha)
      close()
      if (loginResult === true) {
        this.login.resultMessage = ''
        showMessage('登录验证成功')
        this.showLoginDialog = false
        this.checkLoginStatus()
        this.emit('login-success')
      } else {
        showError('登录错误：' + loginResult)
        this.login.resultMessage = loginResult
      }
    },

    openRegisterDialog () { // 打开注册对话框
      this.showLoginDialog = false
      this.showRegisterDialog = true
    },

    openRegisterPage () { // 打开云端注册页面
      window.open('https://ridgeui.com/#/pages/register')
    },

    async registerUser () { // 用户注册
      const checked = checkRegister(this.register.id, this.register.password, this.register.agreed, this.captcha)
      if (checked !== true) {
        this.register.resultMessage = checked
        return
      }

      const close = fullscreenLoading()
      const result = await register(this.register.id, this.register.password, this.captcha)
      close()
      if (result === true) {
        this.register.resultMessage = ''
        showMessage('用户注册成功')
        this.showRegisterDialog = false
        this.checkLoginStatus()
        this.emit('register-success')
      } else {
        showError('注册错误：' + result)
        this.register.resultMessage = result
      }
    },

    async logout () { // 退出登录
      await logout()
      await this.checkLoginStatus()
      this.emit('logout')
    }
  }
}
