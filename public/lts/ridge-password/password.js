export default {
  name: 'Password',
  state: {
    generated: '', // 生成的password
    length: 12,    // 密码长度
    passwordNotify: '', // 密码提示
    includeUppercase: true, // 是否包含大写字母
    includeLowercase: true, // 是否包含小写字母
    includeNumbers: true,   // 是否包含数字
    includeSymbols: true    // 是否包含特殊字符
  },

  setup() {
    // 初始化可以在这里完成
  },

  actions: {
    generate () {
      let charset = ''
      let password = ''
      
      // 根据配置构建字符集
      if (this.state.includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      if (this.state.includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz'
      if (this.state.includeNumbers) charset += '0123456789'
      if (this.state.includeSymbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-='
      
      // 检查是否至少选择了一种字符类型
      if (charset === '') {
        console.error('至少需要选择一种字符类型')
        return
      }
      
      // 生成随机密码
      for (let i = 0; i < this.state.length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length)
        password += charset.charAt(randomIndex)
      }
      
      // 将生成的密码设置到状态中
      this.state.generated = password
    },
    
    copyToClipBoard () { // 复制密码到剪切板
      const password = this.state.generated
    
      if (!password) {
        this.state.passwordNotify = '没有可复制的密码'
        return
      }
  
      // 使用现代 Clipboard API (支持大多数桌面和移动浏览器)
      if (navigator.clipboard) {
        navigator.clipboard.writeText(password)
          .then(() => {
            this.state.passwordNotify = '复制成功'
            setTimeout(() => this.state.passwordNotify = '', 2000)
          })
          .catch(err => {
            console.error('无法使用 clipboard API:', err)
            // 回退到传统方法
            this._fallbackCopyTextToClipboard(password)
          })
      }
    }
  }
}