export default {
  name: 'UserRegister',
  externals: {
    axios: 'axios/dist/axios.min.js'
  },
  events: [{
    name: 'success',
    label: '成功'
  }, {
    name: 'login',
    label: '去登录'
  }],
  state: {
    id: '', // 账号
    password: '', // 密码
    captcha: '', // 验证码
    agreed: '', // 同意条款
    requesting: false, // 请求中
    resultMessage: '', // 错误信息
    captchaUrl: '' // 验证码地址
  },

  async setup () {
    this.reloadCaptcha()
  },

  destory () {
  },

  watch: {
    type () {
      if (this.state.type === 'free') {
        this.state.typeMessage = '支持最多1个应用，最大8M的应用包存储。不提供应用发布及页面托管'
      } else if (this.state.type === 'pay') {
        this.state.typeMessage = '可以存储最多16个应用，应用包限制为32M，同时提供发布和页面托管等功能，注册后请完成后续付费流程'
      } else if (this.state.type === 'promote') {
        this.state.typeMessage = '支持最多8个应用，最大8M的应用包存储。不提供应用发布及页面托管，为在校学生及无固定收入人员提供，非请勿选'
      }
    }
  },

  actions: {
    toast (msg) {
      if (window.SemiUI) {
        const { Toast } = window.SemiUI
        Toast.success(msg)
      }
    },

    reloadCaptcha () { // 获取验证码
      this.state.captchaUrl = '/api/captcha?' + Math.random()
    },

    checkValid () {
      // 验证手机号码
      if (!/^1[3-9]\d{9}$/.test(this.state.id)) {
        this.idvalid = false
        this.resultMessage = '注意：用户账号为手机号码'
        return false
      } else {
        this.idvalid = true
      }

      // 验证密码
      if (!/^(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(this.password)) {
        this.passwordvalid = false
        this.resultMessage = '注意：用户密码为数字+字母组合,至少8位'
        return false
      } else {
        this.passwordvalid = true
      }

      if (this.captcha.length !== 4) {
        this.captchavalid = false
        this.resultMessage = '注意: 验证码长度为4'
        return false
      } else {
        this.captchavalid = true
      }
      return true
    },

    checkCaptResult (result) {
      if (result.data.code === '100400') {
        // 验证码错误
        this.captchavalid = true
        this.resultMessage = '验证码输入错误'
        this.reloadCaptcha()
        return false
      }
      return true
    },

    async registerUser () {
      const checked = this.checkValid()
      if (!checked) return
      const requestObject = {
        id: this.id,
        password: this.password,
        captcha: this.captcha
      }
      try {
        this.requesting = true
        const loginResult = await this.axios.post('/api/user/register', requestObject)
        this.requesting = false
        if (!this.checkCaptResult(loginResult)) {
          return
        }
        if (loginResult.data.code !== '0') {
          this.resultMessage = '用户名或者密码错误'
          this.reloadCaptcha()
          return
        }
        this.toast('注册成功')
        this.emit('success')
      } catch (e) {

      }
    }
  }
}
