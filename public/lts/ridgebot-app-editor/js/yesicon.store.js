export default {
  name: 'YesIcon',
  label: 'Yesicon图标',
  properties: [{
     name: 'value'
  }],
  state: () => {
    return {
      globalLoading: true, // 初始化中
      iconsLoading: true, // 图标加载中
      collections: [], // 图标库列表
      currentCollectionIndex: 0, // 图标库索引
      iconList: [], // 图标列表
      currentPageNum: 1, // 当前页码
      textQuery: '', // 查询条件
      currentIconName: '', // 选中图标名称
      currentIconPkg: '', // 选中图标所属集
      currentIconSvg: '' // 当前图标
    }
  },

  computed: {
    pageIconList: { // 当前页图标列表
      get() {
        return this.iconList.slice((this.currentPageNum -1 ) * 100, this.currentPageNum * 100)
      },
      dependencies: ['iconList', 'currentPageNum']
    },
    totalPageNum: {  // 总页数
      get() {
        return Math.floor(this.iconList.length / 100) + 1
      },
      dependencies: ['iconList']
    },
    iconContent : scope => { // 图标SVG 
      return '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 ' + scope.item.width + ' ' + scope.item.height + '">' + scope.item.body + '</svg>'
    },
    iconName : scope => { // 图标名称
      return scope.item.name
    },
    collectionName: (scope) => { // 图标库列表项-名称
      return scope.item.name
    },
    collectionCount: (scope) => { // 图标库列表项-图标数量
      return scope.item.total
    }
  },

  async setup () {
    const json = (await this.axios.get('https://unpkg.com/@iconify/json/collections.json')).data
    this.globalLoading = true
    this.collections = Object.keys(json).map(name => {
      return {
        key: name,
        ...json[name]
      }
    })
    this.globalLoading = false
    this.currentIconSvg = this.value
    this.onIconGroupClick(0)
  },

  watch: {
    textQuery () {
      this.iconList = this.collections[this.currentCollectionIndex].icons.filter(icon => icon.name.indexOf(this.textQuery) > -1)
      this.currentPageNum = 1
    }
  },

  actions: {
    async onIconGroupClick (index) { // 图标库点击
      this.textQuery = ''
      this.currentCollectionIndex = index
      if (!this.collections[index].icons) {
        this.iconsLoading = true
        const json = (await this.axios.get(`https://unpkg.com/@iconify/json/json/${this.collections[index].key}.json`)).data
        this.iconsLoading = false
        this.collections[index].icons = Object.keys(json.icons).map(key => {
          return {
            pkg: this.collections[index].name,
            width: json.info.height ?? json.width,
            height: json.info.height ?? json.height,
            name: key,
            body: json.icons[key].body
          }
        })
      }
      // this.totalPageNum = Math.floor(this.collections[this.currentCollectionIndex].icons.length / 100) + 1
      this.currentPageNum = 1
      this.iconList = this.collections[this.currentCollectionIndex].icons
    },

    onIconClick(index, item) { // 图标点击
      this.currentIconName = item.name
      this.currentIconPkg = item.pkg
      this.currentIconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 ' + item.width + ' ' + item.height + '">' + item.body + '</svg>'
      this.emit('input', item)
    },

    nextPage() { // 下一页
      if (this.currentPageNum < this.totalPageNum) {
        this.currentPageNum += 1 
      }
    },

    prevPage () { // 上一页
      if (this.currentPageNum > 1) {
        this.currentPageNum -= 1
      }
    }
  }
}
