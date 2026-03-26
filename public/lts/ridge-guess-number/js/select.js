export default {
  name: 'SelectFood',
  properties: [{
    name: 'value',
    label: '已选择',
    type: 'object',
    value: []
  }, {
    name: 'foodList',
    label: '食物列表',
    type: 'object',
    value: []
  }],
  events: [{
    name: 'onChange',
    label: '选择变化'
  }],
  state: {
    filter: '',
    filteredList: [], // 过滤后列表
    selectedFoods: [] // 已选择内容
  },

  computed: {
    selectedCount: {
      get () {
        return this.value?.length
      },
      dependencies: ['value']
    },
    selectedIconVisible: { // 选择图标可见
      get (scope) {
        return this.value?.indexOf(scope.item.name) > -1
      },
      dependencies: ['value']
    },
    icon: scope => { // 食物图标
      if (scope.item.icon) {
        if (scope.item.icon.indexOf('.') > -1) {
          return 'composite://icons/' + scope.item.icon
        } else {
          return 'composite://icons/' + scope.item.icon + '.svg'
        }
      }
    },

    name: scope => { // 食物名称
      return scope.item.name
    },
    nutritional: scope => { // 主要营养成分
      return scope.item.nutritional.join(',')
    }
  },

  setup () {
    this.updateByFilter ()
  },

  watch: {
    filter () {
      this.updateByFilter () 
    },
    foodList () {
      this.updateByFilter () 
    }
  },

  actions: {
    updateByFilter () {
      this.filteredList = this.foodList?.filter(food => {
          return food.name.indexOf(this.filter) > -1
      })
    },
  
    onItemClick (scope) {
      debugger
      if (this.value?.indexOf(scope.item.name) === -1 ) {
        this.emit('onChange', [...this.value|| [], scope.item.name])
      } else {
        this.emit('onChange', this.value?.filter(name => name !== scope.item.name))
      }
    }
  }
}
