export default {
  name: 'FontIconStore',
  properties: [{
    name: 'preload',
    type: 'json',
    label: '图标数据'
  }, {
    name: 'value',
    type: 'string'
  }],
  events: [{
    name: 'onChange',
    label: '图标改变'
  }],
  state: () => {
    return {
      filter: '',
      pageNum: 1,
      pageSize: 80
    }
  },

  computed: {
    filteredIconList () {
      return (this.properties.preload ?? []).filter(icon => {
        return icon.n.indexOf(this.filter) > -1
      })
    },
    currentPageList () {
      return this.filteredIconList.slice((this.pageNum - 1) * this.pageSize, this.pageNum * this.pageSize)
    },
    iconItemHTML: scope => {
      if (scope.item.html) {
        return scope.item.html
      } else {
        return '<i style="cursor: pointer; font-size: 20px;background: #eee; padding: 12px;" class="' + scope.item.cn + '"/>'
      }
    },
    iconItemName: scope => {
      return scope.item.n
    },
    totalNumber () {
      return this.filteredIconList.length
    }
  },

  async setup () {
  },

  destory () {
  },

  watch: {
    filter () {
      this.pageNum = 1
    }
  },

  actions: {
    onIconItemClick (i) {
      this.emit('onChange', this.currentPageList[i].n)
    }
  }
}
