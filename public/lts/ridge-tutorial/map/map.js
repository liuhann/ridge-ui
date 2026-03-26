
export default {
  name: 'MapToggle',
  state: {
    currentIndex: 0, // 区域值
    features: [] // 区域列表
  },

  computed: {
    currentName: { // 当前区域名称
      get () {
        return this.features[this.currentIndex]?.label
      },
      set (val) {
        this.currentIndex = this.features.findIndex(region => region.label === val)
      },
      dependencies: ["currentIndex"]
    },
    currentRegion () {  // 图表当前选中
      return [{
        name: this.currentName,
        value: 40
      }]
    }
  },

  actions: {
    setFeatures (list) {  // 设置区域列表
      console.log('list', list)
      this.state.features = list.map((t,index) => ({
        label: t,
        value: index
      }))
      this.current = list[0]
    },

    prev () { // 上一个
      if (this.currentIndex === 0) {
        this.currentIndex = this.features.length - 1
      } else {
        this.currentIndex --
      }
    },

    next () { // 下一个
      if (this.currentIndex === this.features.length - 1) {
        this.currentIndex = 0
      } else {
        this.currentIndex ++
      }
    }
  }
}
