const {
  getItem,
  sumReducer,
  convertMsToHoursAndMinutes,
  getTimeLineChartData
} = window.ridgeTimerUtils

export default {
  name: 'TimeHistory',
  state: {
    currentPage: 0,
    histories: []
  },

  computed: {
    historyListByDay : state => {
      try {
        return state.histories.sort((a,b) => a.date > b.date ? -1 : 1).slice(state.currentPage * 20, (state.currentPage + 1) * 20)
      } catch (e) {
        return []
      }
    },
    dateName : scope => scope.item.date,
    dateLineChartData: scope =>  getTimeLineChartData(scope.item.spends, (getItem('ridge-percent-config') || DEFAULT_CONFIG).categories),
    dateLineStartTime: scope => {
      const d = new Date(scope.item.date)
      return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0)
    },
    dateLineEndTime: scope => {
      const d = new Date(scope.item.date)
      return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 0, 0, 0, 0)
    },
    dateHours: scope => {
       const totalMill = scope.item.spends.reduce(sumReducer, 0)
       return convertMsToHoursAndMinutes(totalMill)
    },
    hasNextPage: state => state.currentPage <= 0, // 存在上一页
    hasPrevPage: state => state.currentPage + 20 < state.histories.length // 存在下一页
  },


  setup() {
    this.histories = getItem('ridge-percent-histories') || []
  },

  actions: {
    
  }
}
