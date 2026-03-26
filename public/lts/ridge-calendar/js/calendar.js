const getMonthDateArray = (date) => {
  const result = []
  const dateStartMonth = new Date(date.getFullYear(), date.getMonth(), 1)

  const todayDate = new Date()
  const firstDay = dateStartMonth.getDay() // 获取星期几

  for (let i = 0; i < firstDay - 1; i++) { // 之前留空
    result.push(null)
  }

  for (let i = 0; i < SolarUtil.getDaysOfMonth(date.getFullYear(),date.getMonth() + 1); i++) {
    const d = new Date(date.getFullYear(), date.getMonth(), i + 1)
    result.push({
      date: d,
      isToday: (todayDate.getFullYear() === d.getFullYear() && todayDate.getMonth() === d.getMonth() && todayDate.getDate() === d.getDate()),
      weekEnd: d.getDay() === 6 || d.getDay() === 0,
      textDate: i + 1
    })
  }

  return result
}

export default {
  name: 'Calendar',
  externals: ['/lunar-javascript/lunar.js'],
  state: () => {
    return {
      monthDateList: [], // 月份日期列表
      selectedMonthDayIndex: -1, // 选择日期的索引
      dateDetail: { // 详细信息
        dateYmdWeek: '', // 年月日星期
        dateNumber: '', // 日期
        lunarYmd: '', // 阴历日期
        shuJiuFu: '', // 数九数伏
        lunarDayYi: '', // 当日宜
        lunarDayJi: '', // 当日忌
      },
      currentYear: 0,
      currentMonth: 0,
      yearOptions: [],
      monthOptions: []
    }
  },

  async setup () {
    const d = new Date()
    this.monthDateList = getMonthDateArray(d)
    this.currentYear = d.getFullYear()
    this.currentMonth = d.getMonth()
    this.selectedMonthDayIndex = this.monthDateList.findIndex(item => item && item.isToday)    
    this._setDateDetail()
    for (let i = 1900; i< 2099; i++ ) {
      this.yearOptions.push({
        label: i + '年',
        value: i
      })
    }
    for (let i = 1; i< 12; i++ ) {
      this.monthOptions.push({
        label: i + '月',
        value: i - 1
      })
    }
  },
  computed: {
    isDayWeekEnd: scope => scope.item.weekEnd === true,
    isDayToday: scope => scope.item.isToday === true,
    dayText: (scope) => {
      if (scope.item.date) {
        return scope.item.textDate
      } else {
        return ''
      }
    },
    dayLunarText: scope => {
      if (scope.item.date) {
        const d = Lunar.fromDate(new Date(scope.item.date))
        const result = [...d.getFestivals(), ...d.getOtherFestivals(), d.getDayInChinese()]
        return d.getJieQi() || result[0]
      } else {
        return ''
      }
    }
  },
  actions: {
    _setDateDetail () {
      const date = this.monthDateList[this.selectedMonthDayIndex].date
      const lunarDate = Lunar.fromDate(new Date(date))
      this.dateDetail.dateYmdWeek = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + ' 星期'  +  lunarDate.getWeekInChinese()
      this.dateDetail.dateNumber = date.getDate()
      this.dateDetail.lunarYmd = lunarDate.getYearInGanZhi() + lunarDate.getYearShengXiao() + '年 农历' + lunarDate.getMonthInChinese() + '月' + lunarDate.getDayInChinese()
      this.dateDetail.lunarDayYi = lunarDate.getDayYi().join(' ')
      this.dateDetail.lunarDayJi = lunarDate.getDayJi().join(' ')

      this.dateDetail.shuJiuFu = lunarDate.getShuJiu() ? lunarDate.getShuJiu().toFullString() : (lunarDate.getFu() ? lunarDate.getFu().toFullString() : '')
    },

    updateYearMonth () {
      const d = new Date(this.currentYear, this.currentMonth, 1)
      this.monthDateList = getMonthDateArray(d)
      this._setDateDetail()
    },
    setMonthDayIndex (scope) {
      this.selectedMonthDayIndex = scope.i
      this._setDateDetail()
    }
  }
}
