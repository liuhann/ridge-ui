
export default {
  name: 'Todo',
  state: {
    newText: '', // 新增内容
    todoList: [], // 待办列表
  },

  computed: {
    todoText: scope => { // 待办单项-名称
      return scope.item.text
    },
    todoStateText: scope => { // 待办单项-状态
      return scope.item.finish ? 'finished': 'todo'
    },
    todoStatePanel: state => { // 待办切换显示
      return state.todoList.length === 0 ? 'none': 'list'
    },
    todoFinish: { // 待办事项-完成状态
       set: (val, state, scope) => {
         state.todoList[scope.i].finish = val
       },
       get: (scope) => {
         return scope.item.finish
       }
    }
  },

  actions: {
    openDialog () { // 显示对话框
      this.showDialog = true
    },
    addTodo () {  // 增加待办
      if (this.newText === '') {
        return
      }
      this.todoList.push({
        t: new Date().getTime(),
        text: this.newText,
        finish: false
      })
      this.newText = ''
    },
    removeTodo (scope) { // 删除待办
      this.todoList = this.todoList.filter(todo => todo.t !== scope.item.t)
    }
  }
}
