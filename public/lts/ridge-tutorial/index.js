
export default {
  name: 'RidgeTutorial',
  state: {
    page: '/hello/hello' //姓名
  },

  actions: {
    goToPage (page) { // 跳转页面
      this.page = page
    }
  }
}
