import { getUserStatus, logout } from '/npm/ridge-common/js/utils.js'
const ridgeBaseUrl = window.RIDGE_HOST ?? ''

export default {
  name: 'BootStrapThemes',
  events: [{
    name: 'darkChange',
    label: '黑白切换'
  }],
  state: {
    userLogon: false, // 用户是否登录
    displayState: 'unlogin', // 登录状态面板值 logon/unlogin
    userAvatarUrl: ridgeBaseUrl + '/avatar/avatar.svg', // 用户头像地址
    userCover: '', // 用户背景，暂时不用
    currentIcon: 'bi-brightness-high',
    userId: '', // 用户账号（手机号码）
    isDark: false, // 暗色模式
    themes: [{ // 配色选项
      label: '默认',
      color: '#0d6efd',
      value: '/npm/bootstrap/dist/css/bootstrap.min.css'
    }, {
      color: '#2780e3',
      value: '/npm/bootswatch/dist/cosmo/bootstrap.min.css',
    }, 
    {
      color: '#2c3e50',
      value: '/npm/bootswatch/dist/flatly/bootstrap.min.css',
    }, {
      color: '#eb6864',
      value: '/npm/bootswatch/dist/journal/bootstrap.min.css'
    },{ 
      color: '#78c2ad',
      value: '/npm/bootswatch/dist/minty/bootstrap.min.css'
    },{
      color: '#593196',
      value: '/npm/bootswatch/dist/pulse/bootstrap.min.css'
    }, {
      color: '#e95420',
      value: '/npm/bootswatch/dist/united/bootstrap.min.css'
    }]
  },
  computed: {
    themeColor: scope => scope.item.color // 单项主题色
  },

  async setup () {
    if (localStorage.getItem("data-bs-theme") === 'dark') {
      document.querySelector('html').setAttribute("data-bs-theme", 'dark')
      this.isDark = true
      this.currentIcon = 'bi-moon-stars'
    }
    if (localStorage.getItem('data-bs-color')) {
      this.setBootstrapThemeUrl(localStorage.getItem('data-bs-color'))
    }
    this.checkLoginStatus()
  },

  destory () {
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
    
    _getLinkContains (contains) {
      const links = Array.from(document.head.children).filter(node => node.tagName.toLowerCase() === 'link')

      return links.filter(link => link.href.indexOf(contains) > -1)
    },

    async _loadCss (href) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.type = 'text/css'
      link.href = href
      document.getElementsByTagName('HEAD')[0].appendChild(link)
    },

    setTheme(scope) { // 设置配色
      const themeValue = scope.item.value
      const oldLinks = this._getLinkContains('bootstrap.min.css')
      
      this.setBootstrapThemeUrl(themeValue)

      for (const link of oldLinks) {
        document.head.removeChild(link)
      }
    },

    setBootstrapThemeUrl (themeUrl) {
      this._loadCss(themeUrl)
      localStorage.setItem('data-bs-color', themeUrl)
    },
    toggleColorMode () {  // 切换黑白
      if (this.isDark) {
        document.querySelector('html').setAttribute("data-bs-theme", 'light')
        localStorage.setItem("data-bs-theme", 'light')
        this.emit('darkChange', 'light')
        this.isDark = false
        this.currentIcon = 'bi-brightness-high'
      } else {
        document.querySelector('html').setAttribute("data-bs-theme", 'dark')
        localStorage.setItem("data-bs-theme", 'dark')
        this.emit('darkChange', 'dark')
        this.currentIcon = 'bi-moon-stars'
        this.isDark = true
      }
    },
    async logout () { // 退出登录
      await logout()
      await this.checkLoginStatus()
      this.emit('logout')
    }
  }
}
