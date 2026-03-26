
export default {
  name: 'Todo',
  state: {
    star: 3, // 待办优先级
    showDialog: false, // 显示对话框
    newText: '', // 新增内容
    todoList: [], // 待办列表
  },

  computed: {
    todoText: scope => { // 待办单项-名称
      return scope.item.text
    },
    todoStar: scope => { // 待办单项-Star
      return scope.item.star
    },
    todoStatePanel: state => { // 待办切换显示
      return state.todoList.length === 0 ? 'none': 'list'
    },
    todoFinish: { // 待办事项-完成状态
       set: (val, state, scope) => {
         state.todoList[scope.i].finish = val
         localStorage.setItem('todoList', JSON.stringify(state.todoList))
       },
       get: (scope) => {
         return scope.item.finish
       }
    }
  },

  setup() {
    const todoList = localStorage.getItem('todoList')
    if (todoList) {
      this.todoList = JSON.parse(todoList)
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
        star: this.star,
        t: new Date().getTime(),
        text: this.newText,
        finish: false
      })
      localStorage.setItem('todoList', JSON.stringify(this.todoList))
      this.newText = ''
      this.showDialog = false
    },
    removeTodo (scope) { // 删除待办
      this.todoList = this.todoList.filter(todo => todo.t !== scope.item.t)
      localStorage.setItem('todoList', JSON.stringify(this.todoList))
    }
  }
}
