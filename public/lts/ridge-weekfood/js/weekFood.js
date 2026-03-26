import LocalStorageUtil from "/npm/ridge-common/js/storage.js"
import { carbs, vegetables, fruits, protein, nuts } from '../foods.js'

const foodByCategory = {
  crons: carbs,
  vegfruits: [...vegetables, ...fruits],
  meats: protein,
  nuts
}

const takeCount = list => {
        const r = []
        for (const li of list) {
          r.push(...li.crons)
          r.push(...li.vegfruits)
          r.push(...li.meats)
          r.push(...li.nutoils)
        }
        return Array.from(new Set(r)).length
}

const storage = new LocalStorageUtil('weekfood')

/**
 * 获取指定年和周的详细信息，包含当前周数据及上下周翻页信息
 * @param {number} [year] - 目标年份（默认当前年）
 * @param {number} [week] - 目标周序号（默认当前周，从1开始）
 * @returns {Object} 包含当前周信息及上下周翻页数据
 */
function getWeekInfo (year, week) {
  // 辅助函数：计算指定日期所在周的年和周（周一为周首）
  function getYearWeek (date) {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0) // 清除时间部分
    const day = d.getDay() || 7 // 转换为：1=周一，7=周日
    const monday = new Date(d)
    monday.setDate(d.getDate() - (day - 1)) // 计算本周一

    // 计算当年1月的第一个周一
    const jan1 = new Date(monday.getFullYear(), 0, 1)
    const jan1Day = jan1.getDay() || 7
    const firstMonday = new Date(jan1)
    firstMonday.setDate(jan1.getDate() - (jan1Day - 1))

    // 处理跨年的周一（如1月1日的周一可能在上一年）
    if (monday < firstMonday) {
      const prevYear = monday.getFullYear() - 1
      const prevJan1 = new Date(prevYear, 0, 1)
      const prevJan1Day = prevJan1.getDay() || 7
      const prevFirstMonday = new Date(prevJan1)
      prevFirstMonday.setDate(prevJan1.getDate() - (prevJan1Day - 1))
      const diffDays = (monday - prevFirstMonday) / (24 * 3600 * 1000)
      return { year: prevYear, week: Math.floor(diffDays / 7) + 1 }
    }

    // 计算当前周序号
    const diffDays = (monday - firstMonday) / (24 * 3600 * 1000)
    return { year: monday.getFullYear(), week: Math.floor(diffDays / 7) + 1 }
  }

  // 处理默认参数（当前年和周）
  const now = new Date()
  const defaultYW = getYearWeek(now)
  const targetYear = year ?? defaultYW.year
  const targetWeek = week ?? defaultYW.week

  // 计算目标周的周一日期
  const firstMondayOfYear = (() => {
    const jan1 = new Date(targetYear, 0, 1)
    const jan1Day = jan1.getDay() || 7
    const firstMonday = new Date(jan1)
    firstMonday.setDate(jan1.getDate() - (jan1Day - 1))
    return firstMonday
  })()
  const targetMonday = new Date(firstMondayOfYear)
  targetMonday.setDate(firstMondayOfYear.getDate() + (targetWeek - 1) * 7)

  // 中文星期名称映射
  const weekDayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  // 生成周一到周日的7天数据
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(targetMonday)
    date.setDate(targetMonday.getDate() + i)
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1, // 月份1-12
      date: date.getDate(), // 日
      dayOfWeek: weekDayNames[i], // 1=周一，7=周日
      formatted: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    }
  })

  // 计算上一周的年和周（翻页用）
  const prevMonday = new Date(targetMonday)
  prevMonday.setDate(targetMonday.getDate() - 7)
  const prevYW = getYearWeek(prevMonday)

  // 计算下一周的年和周（翻页用）
  const nextMonday = new Date(targetMonday)
  nextMonday.setDate(targetMonday.getDate() + 7)
  const nextYW = getYearWeek(nextMonday)

  return {
    // 当前周基本信息
    current: {
      year: targetYear, // 当前周所属年
      week: targetWeek, // 当前周序号
      monday: targetMonday.toISOString().split('T')[0], // 本周一格式化日期
      days // 周一到周日详细数据
    },
    // 上一周翻页信息
    prev: {
      year: prevYW.year,
      week: prevYW.week
    },
    // 下一周翻页信息
    next: {
      year: nextYW.year,
      week: nextYW.week
    }
  }
}

export default {
  name: 'WeekFood',
  state: {
    currentTabIndex: 0,
    currentDate: '', // 当前时间
    currentMonth: '', // 所在月份
    currentYear: '', // 所在年份
    days: [], // 本周7天
    foodRecords: [{ // 所有日期选择记录，需要持久化
      date: '2025-07-02',
      crons: [],
      vegfruits: [],
      meats: [],
      nutoils: []
    }],
    dayFoodCount: 0, // 一天食物种类
    weekFoodCount: 0, // 一周食物种类
    weekFoodPercent: 0, // 一周种类进度
    foodForSelect: [], // 选择食物名称列表
    foodSelectableList: [], // 可选食物列表
    listCrons: [], // 谷物详情列表
    listVegFruits: [], // 果蔬详情列表
    listMeats: [], // 肉类详情列表
    listNutOils: [] // 坚果详情列表
  },

  computed: {
    icon: scope => { // 食物图标
      if (scope.item.icon) {
        if (scope.item.icon.indexOf('.') > -1) {
          return 'composite://icons/' + scope.item.icon
        } else {
          return 'composite://icons/' + scope.item.icon + '.svg'
        }
      }
    },
    itemBgColor: {
      get: (scope, state) => { // 背景色
        if (scope.item.formatted === state.currentDate) {
          return '#cfecfa'
        } else {
          return '#fff'
        }
      },
      dependencies: ['currentDate']
    },
    itemDate: scope => scope.item.date, // 单项日期
    itemWeekDay: scope => scope.item.dayOfWeek // 单项周几
  },

  setup () {
    this.foodRecords = storage.getObject('records') || []
    this.weekInfoResult = getWeekInfo()
    this._initWeek(true)
  },

  actions: {
    _updateByCurrentDate () {
      this.foodRecords = storage.getObject('records') || []
      const dateRecord = this.foodRecords.find(n => n.date === this.currentDate)

      if (dateRecord == null) {
        this.listCrons = []
        this.listVegFruits = []
        this.listMeats = []
        this.listNutOils = []
      } else {
        this.listCrons = (dateRecord.crons || []).map(it => foodByCategory.crons.find(n => n.name === it))
        this.listVegFruits = (dateRecord.vegfruits || []).map(it => foodByCategory.vegfruits.find(n => n.name === it))
        this.listMeats = (dateRecord.meats || []).map(it => foodByCategory.meats.find(n => n.name === it))
        this.listNutOils = (dateRecord.nutoils || []).map(it => foodByCategory.nuts.find(n => n.name === it))
      }
    },

    onDateClick (scope) { // 切换日期
      this.currentDate = scope.item.formatted
      this._updateByCurrentDate()
    },
    
    openSelect (type) { // 打开选择页
      this.currentCategory = type

      this.foodSelectableList = foodByCategory[this.currentCategory]

      if (type === 'crons') {
        this.foodForSelect = this.listCrons.map(item => item.name)
      }
      if (type === 'vegfruits') {
        this.foodForSelect = this.listVegFruits.map(item => item.name)
      }
      if (type === 'meats') {
        this.foodForSelect = this.listMeats.map(item => item.name)
      }
      if (type === 'nuts') {
        this.foodForSelect = this.listNutOils.map(item => item.name)
      }

      this.currentTabIndex = 1
    },

    doCancelFoodSelect () { // 取消选择
      this.currentTabIndex = 0
    },
    doFoodConfirm () { // 确认食物选择
      const targetListDetails = this.foodForSelect.map(name => {
        return this.foodSelectableList.find(it => it.name === name)
      })
      if (this.currentCategory === 'crons') {
        this.listCrons = targetListDetails
      }
      if (this.currentCategory === 'vegfruits') {
        this.listVegFruits = targetListDetails
      }
      if (this.currentCategory === 'meats') {
        this.listMeats = targetListDetails
      }
      if (this.currentCategory === 'nuts') {
        this.listNutOils = targetListDetails
      }
      this.currentTabIndex = 0
      this._daoUpdate()
      this._summarize()
    },

    onFoodSelect (payload) { // 食物选择
      this.foodForSelect = payload
    },
    onClickNextWeek () { // 点击下一周
      this.weekInfoResult = getWeekInfo(this.weekInfoResult.next.year, this.weekInfoResult.next.week)
      this._initWeek()
    },

    onClickPrevWeek() { // 点击上一周
      debugger
      this.weekInfoResult = getWeekInfo(this.weekInfoResult.prev.year, this.weekInfoResult.prev.week)
      this._initWeek()
    },

    _initWeek (isToday) {
      this.days = this.weekInfoResult.current.days
      this.currentMonth = this.weekInfoResult.current.days[6].month
      this.currentYear = this.weekInfoResult.current.days[6].year

      if (isToday) {
        const date = new Date()
        this.currentDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      } else {
        this.currentDate = this.weekInfoResult.current.days[6].formatted
      }
      this._updateByCurrentDate()
      this._summarize()
    },

    // 统计
    _summarize () {
      const records = this.foodRecords.filter(fr => fr.date === this.currentDate)
      this.dayFoodCount = takeCount(records)

      const weekRecords = []
      for (const d of this.days) {
        weekRecords.push(...this.foodRecords.filter(fr => fr.date === d.formatted))
      }

      this.weekFoodCount = takeCount(weekRecords)
      this.weekFoodPercent = Math.floor(100 * this.weekFoodCount / 35)
    },
    
    _daoUpdate () {
      const removedList = this.foodRecords.filter(r => r.date !== this.currentDate)

      removedList.push({
        date: this.currentDate,
        crons: this.listCrons.map(item => item.name),
        vegfruits: this.listVegFruits.map(item => item.name),
        meats: this.listMeats.map(item => item.name),
        nutoils: this.listNutOils.map(item => item.name)
      })

      this.foodRecords = removedList

      storage.saveObject('records', this.foodRecords)
    }
  }

}
