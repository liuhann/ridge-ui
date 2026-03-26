
export default {
  name: 'Hello',
  state: {
    name: 'World' //姓名
  },
  actions: {
    setName(newName) {
      this.name = newName
    }
  }
}
