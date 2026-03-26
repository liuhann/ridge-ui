const baseUrl = window.RIDGE_HOST || ''

const P_IMGS = [ 'p-jian.png', 'p-shi.png', 'p-bu.png']

export default {
  name: 'RockGo',
  state: {
    message: '点击海绵宝宝的手势',
    computerUrl: '', // 电脑出的
    humanScore: 0, // 您的得分
    computerScore: 0, // 电脑得分
    visibleJian: true, // 剪刀可见
    visibleShi: true, // 石头可见
    visibleBu: true // 布可见
  },

  setup () {
    this.randomizeComputerUrl()
    this.startBet()
  },

  destory () {
    clearInterval(this.interval)
  },

  actions: {
    randomizeComputerUrl () {
      let i = 0
      this.interval = setInterval(() => {
        i ++
        if (this.status === 'betting') {
          this.computerUrl = `${baseUrl}/npm/ridge-rock-crushes/img/${P_IMGS[i%3]}`
        }
      }, 200)
    },

    youBet (n) {
      if (this.status === 'result') {
        return
      }
      this.status = 'result'
      const computerIdx = Math.floor(Math.random() * 3)
      const humIdx = parseInt(n)
      this.computerUrl = `${baseUrl}/npm/ridge-rock-crushes/img/${P_IMGS[computerIdx]}`
      if ((humIdx === 0 && computerIdx ===2) || (humIdx === 1 && computerIdx ===0) ||  (humIdx === 2 && computerIdx === 1)) {
        this.humanScore ++
        this.message = "你赢了! 点击下一轮"
      } else if (humIdx !== computerIdx) {
        this.computerScore ++
        this.message = "你输了! 点击下一轮"
      } else {
        this.message = "平局! 点击下一轮"
      }
      this.visibleJian = humIdx === 0
      this.visibleShi = humIdx === 1
      this.visibleBu = humIdx === 2
    },

    startBet () {
      if (this.status === 'betting') return
      this.status = 'betting'
      this.visibleJian = true
      this.visibleShi = true
      this.visibleBu = true
      this.message = '点击海绵宝宝的手势'
    }
  }
}
