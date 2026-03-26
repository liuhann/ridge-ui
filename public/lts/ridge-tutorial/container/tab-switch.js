
export default {
  name: 'TabSwitch',
  state: {
    currentTab: 0 // 当前显示
  },

  actions: {
    nextTab () { // 下一个
      if (this.currentTab === 2)  {
        this.currentTab = 0
      } else {
        this.currentTab ++
      }
    },

    prevTab () { // 上一个
      if (this.currentTab === 0)  {
        this.currentTab = 2
      } else {
        this.currentTab --
      }
    }
  }
}
