
export default {
  name: 'Vals',
  state: {
      visible: false, // 布尔
      visible2: false, // 布尔2
      strValue: '', // 字符串
      strValue2: '', // 字符串2
      arrValue: [], // 数组
      arrValue2: [], // 数组2
  },

  actions: {
    setVisibleTrue() {
      this.visible = true
    },
    setVisible2True() {
      this.visible2 = true
    }
  }
}
