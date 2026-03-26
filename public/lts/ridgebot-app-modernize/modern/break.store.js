
export default {
  name: 'BreakUpStore',
  properties: [{
    label: '标签',
    type: 'string',
    name: 'labels',
    value: '2023年/2024年'
  }, {
    label: '取值',
    type: 'string',
    name: 'values',
    value: '64/78'
  }],
  events: [{
    label: '分隔事件',
    name: 'onBreak'
  }],
  state: () => {
    return {
      pieData: [],
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
      const { labels = '2023年/2024年', values = '64/78'} = this.properties
      const labelList = labels.split(/[/,|]/g)
      const valueList = values.split(/[/,|]/g).map(t => parseInt(t))
      this.pieData = [labelList, valueList]
      this.currentValue = valueList[valueList.length - 1]
      this.increaseIndex = (valueList[1] > valueList[0]) ? 1 : 0
      this.increased = (this.increaseIndex ? '+' : '') + Math.floor((valueList[1] - valueList[0])/ valueList[0] * 100) + '%'
    }
  }
}
