import { showError, login, showMessage } from './utils.js'
export default {
  name: 'UserLogin',
  events: [{
    name: 'success',
    label: '成功'
  }],
  state: {
    id: '', // 用户账号
    password: '', // 用户密码
    captcha: '', // 验证码
    requesting: false, // 登录中
    resultMessage: '', // 错误信息
    captchaUrl: '' // 验证码地址
  },

  async setup () {
    this.reloadCaptcha()
  },

  destory () {
  },

  watch: {
  },

  actions: {
    reloadCaptcha () { // 加载验证码
      this.captchaUrl = '/api/captcha?' + Math.random()
    },

    checkValid () { // 验证输入有效性
      const result = true

      if (result === true) {
        return true
      } else {
        showError(result)
        this.resultMessage = result
        return false
      }
    },

    async loginUser () { // 用户登录
      const checked = this.checkValid()
      if (!checked) return

      this.requesting = true
      const loginResult = await login(this.id, this.password, this.captcha)
      this.requesting = false
      if (loginResult === true) {
        this.resultMessage = ''
        showMessage('登录验证成功')
        this.emit('success')
      } else {
        showError('登录错误：' + loginResult)
        this.resultMessage = loginResult
      }
    }
  }
}
