const sortTasks = tasks => {
  return tasks.sort((a, b) => {
    if (a.time > b.time) {
      return 1
    } else {
      return -1
    }
  })
}

const SAMPLE_TASKS = [
  {
    "id": 1742268647058,
    "name": "查阅资料",
    "comment": "查阅大量关于无理数数字分布的前沿学术文献，梳理过往研究思路与成果",
    "time": "11:55",
    "colorIndex": 0,
    "color": "#228B22"
  },
  {
    "id": 1742268672755,
    "name": "编写程序",
    "comment": "运用超级计算机编写程序，对 π 小数点后一亿位数字进行统计分析",
    "time": "15:00",
    "colorIndex": 0,
    "color": "#FF8C00"
  }
]

export default {
  name: 'Tasks',
  state: () => {
    return {
      colors: [
        // 红色系
        '#8B0000', // 暗红色
        '#B22222', // 火砖红
        '#FF4500', // 橙红色
        // 橙色系
        '#FF8C00', // 暗橙色
        '#FFA500', // 橙色
        // 黄色系
        '#BDB76B', // 暗黄褐色
        '#DAA520', // 金色
        // 绿色系
        '#006400', // 深绿色
        '#228B22', // 森林绿
        '#008080', // 水鸭色（青绿色）
        // 青色系
        '#008B8B', // 深青色
        '#00BFFF', // 深天蓝
        // 蓝色系
        '#191970', // 午夜蓝
        '#4169E1', // 皇家蓝
        // 紫色系
        '#8A2BE2', // 蓝紫色
        '#9400D3' // 暗紫罗兰色
      ],
      editValid: null,
      editTask: {
        name: '',
        comment: '',
        time: '',
        colorIndex: 0,
        color: ''
      },
      currentEditId: '',
      showEditDialog: false,
      tasks: []
    }
  },

  setup () {
    this.resetNewTask()
    if (localStorage.getItem('r-tasks')) {
      this.tasks = JSON.parse(localStorage.getItem('r-tasks'))
    } else {
      this.tasks = SAMPLE_TASKS
    }
  },

  computed: {
    gridColor: scope => scope.item,
    taskName: scope => scope.item.name,
    taskComment: scope => scope.item.comment,
    taskTime: scope => {
      return scope.item.time
    },
    taskColorSelectedText: {
      get: (scope, state) => scope.item === state.editTask.color ? '√' : '',
      dependencies: ['editTask']
    },
    taskColor: scope => scope.item.color
  },

  actions: {
    resetNewTask () {
      const d = new Date()
      this.currentEditId = ''
      this.editTask.name = ''
      this.editTask.comment = ''
      this.editTask.time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
      this.editTask.color = this.colors[0]
    },
    addTask () { // 增加或更新任务
      this.editValid = null
      if (!this.currentEditId) {
        if (this.editTask.name === '') {
          this.editValid = false
          return
        }
        this.tasks.push(Object.assign({
          id: new Date().getTime()
        }, this.editTask))
      } else {
        this.tasks = this.tasks.map(task => {
          if (task.id === this.currentEditId) {
            return Object.assign(task, this.editTask)
          } else {
            return task
          }
        })
      }
      this.tasks = sortTasks(this.tasks)
      this.resetNewTask()
      this.showEditDialog = false
      localStorage.setItem('r-tasks', JSON.stringify(this.tasks))
    },

    newTask() {
      this.resetNewTask()
      this.showEditDialog = true
    },

    onTaskListChange(tasks) { // 调试用:更改任务列表
      this.tasks = tasks
    },

    editTask (scope) {
      this.currentEditId = scope.item.id
      this.editTask.name = scope.item.name
      this.editTask.comment = scope.item.comment
      this.editTask.time = scope.item.time
      this.editTask.colorIndex = scope.item.colorIndex
      this.editTask.color = scope.item.color
      
      this.showEditDialog = true
    },
    setItemColor (scope) {
      this.editTask.color = scope.item
    },
    removeTask (scope) { // 删除任务
      this.tasks = sortTasks(this.tasks.filter(task => {
        if (task.id === scope.item.id) {
          return false
        } else {
          return true
        }
      }))

      localStorage.setItem('r-tasks', JSON.stringify(this.tasks))
    }
  }
}
