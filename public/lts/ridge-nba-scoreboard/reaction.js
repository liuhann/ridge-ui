function insertNumber(arr, num) {
  let index = arr.indexOf(0)
  if (index !== -1) {
      arr[index] = num
  } else {
      arr.shift()
      arr.push(num)
  }
  return arr
}

function getRankText(mill) {
  if (mill < 200) {
    return 5
  }
  if (mill < 300) {
    return 4
  }
  if (mill < 400) {
    return 3
  }
  if (mill < 500) {
    return 2
  }
  return 1
}


export default {
  name: 'Reaction',
  state: {
    currentScene: 'start', //当前页面 start/red/green/error/result
    currentMill: 0, // 当前响应时间
    averangeMill: 0, // 平均时间
    rank: 0, // 等级
    recentMills: new Array(20).fill(0) // 最近测试
  },
  actions: {
    startTest() {
      this.currentScene = 'red'

      this.timeout = setTimeout(() => {
        this.currentScene = 'green'
        requestAnimationFrame(() => {
          this._startMill = new Date().getTime()
        })
      }, 2000 + Math.random() * 2000)
    },

    clickOnRed() {
      this.currentScene = 'error'
      clearTimeout(this.timeout)
    },

    clickOnGreen() {
      this.currentScene = 'result'
      this.currentMill = new Date().getTime() - this._startMill
      insertNumber(this.recentMills, this.currentMill)
      this.rank = getRankText(this.currentMill) + ''
    }
  }
}
