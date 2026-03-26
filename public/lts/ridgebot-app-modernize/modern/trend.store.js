
export default {
  name: 'TrendStore',
  properties: [{
    label: '系列标签',
    type: 'string',
    name: 'labels',
    value: '1月/2月/3月/4月/5月/6月/7月/8月'
  }, {
    label: '系列数据',
    type: 'string',
    name: 'values',
    value: '32/35/24/25/23/30/36/40'
  }],
  state: () => {
    return {
      chartData: [],
      currentValue: '---',
      increaseIndex: 0,
      increased: '--'
    }
  },
  update () {
    this.updateState()
  },
  async setup () {
    this.updateState()
  },
  actions: {
    updateState() {
      const { labels = '1月/2月/3月/4月/5月/6月/7月/8月', values = '32/35/24/25/23/30/36/40' } = this.properties
      const labelList = labels.split(/[/,|]/g)
      const valueList = values.split(/[/,|]/g).map(t => parseInt(t))
      this.chartData = {
        categories: labelList,
        series: [
          {
            data: valueList
          }
        ]
      }
      
      this.currentValue = valueList[valueList.length - 1]
      this.lastValue = valueList[valueList.length - 2] ?? 1
      this.increaseIndex = (this.currentValue > this.lastValue) ? 1 : 0
      this.increased = (this.increaseIndex ? '+' : '') + Math.floor((this.currentValue - this.lastValue)/ this.lastValue * 100) + '%'
    }
  }
}
