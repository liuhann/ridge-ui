
export default {
  name: 'TwoNumber',
  state: {
    a: 5,
    b: 10
  },

  computed: {
    sum () { // 相加
      return this.a + this.b 
    },
    divide () { // 相减
      return this.a - this.b 
    },
    multiply : (state) => { // 相乘
      return state.a * state.b
    },
    quotient : (state) => { // 相除
      return state.a / state.b
    },
    percent : (state) => { // 百分比
      return Math.floor(state.a / state.b * 100)
    }
  }
}
