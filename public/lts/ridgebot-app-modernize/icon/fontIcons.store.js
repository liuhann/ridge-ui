
export default {
  name: 'FontIconStore',
  properties: [{
    name: 'iconList',
    type: 'json',
    label: '图标列表'
  }],
  events: [{
    name: 'input',
    label: '图标点击'
  }],
  state: () => {
    return {
      filter: '',
      pageNum: 1,
      pageSize: 80,
      name: 'Ridge' //姓名
    }
  },

  computed: {
    filteredIconList () {
      return this.properties.iconList.filter(icon => {
        return icon.n.indexOf(this.filter) > -1
      })
    },
    currentPageList() {
      return this.filteredIconList.slice((this.pageNum - 1) * this.pageSize, this.pageNum * this.pageSize)
    },
    iconItemHTML: scope => {
        return '<i style="cursor: pointer; font-size: 20px;background: #eee; padding: 12px;" class="' + scope.item.cn + '"/>'
    },
    iconItemName: scope => {
      return scope.item.n
    },
    totalNumber() {
       return this.filteredIconList.length
    }
  },

  async setup () {
  },

  destory () {
  },

  watch: {
    filter() {
      this.pageNum = 1
    }
  },

  actions: {
    onIconItemClick(i, item) {
      this.emit('input', item.n)
    }
  }
}
