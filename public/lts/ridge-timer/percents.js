const DEFAULT_CONFIG = {
  categories: [{
    name: '专注',
    color: '#ff9500'
  }, {
    name: '沟通',
    color: '#f92d20'
  }, {
    name: '学习',
    color: '#0fb5d7'
  }, {
    name: '休息',
    color: '#2fbc52'
  }]
}

const DEFAULT_TODAY = {
  date: '',
  spends: []
}

const sumReducer = (acc, itm) => {
  if (itm.finished) {
    return acc + (itm.finished - itm.started)
  } else {
    return acc
  }
}

const convertMsToHoursAndMinutes = ms => {
  const totalMinutes = Math.floor(ms / (1000 * 60))
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return (hours > 0) ? `${hours}小时${minutes}分` : `${minutes}分钟`
}

const formatDate = date => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const setItem = (key, json) => {
  window.localStorage.setItem(key, JSON.stringify(json))
}

const getItem = key => {
  try {
    return JSON.parse(window.localStorage.getItem(key))
  } catch (e) {
    return null
  }
}

const getCategoryPercentList = (spends, categories) => {
  const totalMill = spends.reduce(sumReducer, 0)
  return categories.map(category => {
    const percent = Math.floor(100 * spends.filter(spend => spend.category === category.name).reduce(sumReducer, 0) / totalMill) || 0
    return {
      percent,
      percentText: percent + '%',
      name: category.name,
      color: category.color
    }
  })
}

/** 将spends为当日时序数据转化为表格所需系列数据， 其中 categories 为可选分类 提供颜色 */
const getTimeLineChartData = (spends, categories = []) => {
  return spends.filter(spend => spend.finished).map(spend => {
    return [spend.category, spend.started, spend.finished, categories.find(cat => cat.name === spend.category)?.color]
  })
}

function saveJSONToFile (jsonData, fileName) {
  // 将 JSON 数据转换为字符串
  const jsonString = JSON.stringify(jsonData, null, 2)

  // 创建一个 Blob 对象
  const blob = new Blob([jsonString], { type: 'application/json' })

  // 创建一个临时的 URL
  const url = URL.createObjectURL(blob)

  // 创建一个 <a> 元素
  const a = document.createElement('a')
  a.href = url
  a.download = fileName

  // 模拟点击下载链接
  a.click()

  // 释放临时的 URL
  URL.revokeObjectURL(url)
}

const pickJSONContent = async () => {
  if ('showOpenFilePicker' in window) {
    try {
      const [fileHandle] = await window.showOpenFilePicker({
        types: [
          {
            description: 'JSON Files',
            accept: {
              'application/json': ['.json']
            }
          }
        ]
      })
      const file = await fileHandle.getFile()
      const contents = await file.text()
      const jsonData = JSON.parse(contents)
      console.log('Parsed JSON data:', jsonData)
      return jsonData
    } catch (error) {
      console.error('Error:', error)
    }
  } else {
    // 不支持，需要提供替代方案
    alert('您当前浏览器不支持导入功能，请使用chrome/edge等主流浏览器')
  }
}

window.ridgeTimerUtils = {
  getTimeLineChartData,
  getItem,
  sumReducer,
  convertMsToHoursAndMinutes
}

export default {
  name: 'TimePercents',
  state: {
    config: DEFAULT_CONFIG,
    today: DEFAULT_TODAY,
    summaryToday: {
      workedTimeH: '2小时13分', // 工作时长
      workByCategories: [] // 按分类统计
    },
    currentWorking: { // 当前工作
      hasWork: false, // 是否有工作
      category: '-', // 分类
      continued: '-', // 已持续时间
      collectable: '-' // 可收集时间
    },
    todayChart: { // 今日图表
      startTime: new Date(),
      endTime: new Date(),
      timeSeriesData: []
    },
    upTabOptions: [{ // 切换面板选项
      label: '今日计时',
      value: 'today'
    }, {
      label: '历史',
      value: 'histories'
    }, {
      label: '配置',
      value: 'options'
    }],
    currentTab: 'today', // 当前切换面板
    histories: [] // 历史记录
  },

  computed: {
    categoryName: { // 分类展示-名称
      get: scope => scope.item.name,
      set: (val, state, scope) => {
        state.config.categories[scope.i].name = val
      }
    },
    categoryColor: { // 分类展示-颜色
      get: scope => scope.item.color,
      set: (val, state, scope) => {
        state.config.categories[scope.i].color = val
      }
    },
    categoryClickDisabled: (scope, state) => { // 开始按钮禁止点击
      return scope.item.name === state.currentWorking.category
    },
    categoryPercent: scope => scope.item.percent, // 分类展示-百分比
    categoryPercentText: scope => scope.item.percentText // 分类展示-百分比文本
  },

  setup () {
    this._load()
    this._initToday()

    this.interval = setInterval(() => {
      this._summary()
    }, 60 * 1000)
  },

  destory () {
    clearInterval(this.interval)
  },

  watch: {
    today () {
      this._persistance()
      this._summary()
    },
    config () {
      this._persistance()
      this._summary()
    }
  },

  actions: {
    async _persistance () {
      setItem('ridge-percent-config', this.config)
      setItem('ridge-percent-today', this.today)
      setItem('ridge-percent-histories', this.histories)
    },

    async _load () {
      this.config = getItem('ridge-percent-config') || DEFAULT_CONFIG
      this.today = getItem('ridge-percent-today') || DEFAULT_TODAY
      this.histories = getItem('ridge-percent-histories') || []
    },

    _initToday () {
      if (this.today.date === '') {
        this.today.date = formatDate(new Date())
      }
      if (this.today.date !== formatDate(new Date())) {
        this.histories.push({
          date: this.today.date,
          spends: this.today.spends
        })
        this.today.date = formatDate(new Date())
        this.today.spends = []
      }
      this._summary()
    },

    _summary () {
      const now = new Date()
      const totalMill = this.today.spends.reduce(sumReducer, 0)
      this.summaryToday.workedTimeH = convertMsToHoursAndMinutes(totalMill)
      this.summaryToday.workByCategories = getCategoryPercentList(this.today.spends, this.config.categories)

      const lastWork = this.today.spends.at(-1)
      if (lastWork && lastWork.running) {
        this.currentWorking.hasWork = true
        this.currentWorking.continued = convertMsToHoursAndMinutes(now.getTime() - lastWork.started)
        this.currentWorking.collectable = convertMsToHoursAndMinutes(now.getTime() - (lastWork.finished || lastWork.started))
        this.currentWorking.category = lastWork.category
      } else {
        this.currentWorking.hasWork = false
        this.currentWorking.continued = ''
        this.currentWorking.collectable = ''
        this.currentWorking.category = ''
      }

      this.todayChart.startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
      this.todayChart.endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0)

      this.todayChart.timeSeriesData = getTimeLineChartData(this.today.spends, this.config.categories)
    },

    startWork (scope) { // 开始工作
      this.stopWork()
      this.today.spends.push({
        category: scope.item.name,
        started: new Date().getTime(),
        running: true
      })
    },

    stopWork () { // 停止工作
      const lastWork = this.today.spends.at(-1)
      if (lastWork && lastWork.running) {
          delete lastWork.running
          lastWork.finished = new Date().getTime()
      }
    },

    dropTime () { // 丢弃可收集时间
      const lastWork = this.today.spends.at(-1)
      if (lastWork) {
        delete lastWork.running
        if (!lastWork.finished) {
          this.today.spends.pop()
        }
      }
    },

    collectTime () { // 收集时间
      const lastWork = this.today.spends.at(-1)
      if (lastWork && lastWork.running) {
        lastWork.finished = new Date().getTime()
      }
    },

    deleteCategory (scope) { // 删除分类
      this.config.categories = this.config.categories.filter(cat => cat.name !== scope.item.name)
    },

    addCategory () { // 增加分类
      this.config.categories.push({
        name: '未命名分类',
        color: '#2fbc52'
      })
    },

    exportHistory () { // 将历史导出
      saveJSONToFile({
        config: this.config,
        today: this.today,
        histories: this.histories
      }, 'TimeHistory.json')
    },

    async importHistory () {
      const jsonRead = await pickJSONContent()

      if (jsonRead) {
        this.config = jsonRead.config
        this.today = jsonRead.today
        this.histories = jsonRead.histories
      }
      this._persistance()
      this._summary()
    }
  }
}
