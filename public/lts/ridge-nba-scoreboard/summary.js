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
    historyListByDay : state => state.histories.sort((a,b) => a.date > b.date ? -1 : 1).slice(state.currentPage * 7, (state.currentPage + 1) * 7),
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
    }
  },


  setup() {
    this.histories = getItem('ridge-percent-histories') || []
  }
}
