function findInTree (tree, value) {
  for (const node of tree) {
    if (node.value === value) {
      return node
    }
    if (node.children) {
      const result = findInTree(node.children, value)
      if (result) {
        return result
      }
    }
  }
  return null
}

export default {
  name: 'StyleStore',
  title: '样式选择',
  properties: [{
    name: 'value',
    label: '已选样式',
    type: 'object',
    value: []
  }],
  state: () => {
    return {
      selectedValues: [], // 已选样式
      /** 数据格式
       [
        {
          label, value, styleList: [{
            label, value, classes, children: [{ label, value, classes, children}]
          }]
        }
       ]
       */
      packageList: [], // 组件包列表
      currentPackage: '', // 当前组件包
      currentCategory: '' // 当前样式组
    }
  },
  computed: {
    styleCategories() { // 样式分类树
      const pkgFound = this.packageList.filter(n => n.value === this.currentPackage)
      return pkgFound.length ? pkgFound[0].styleList : []
    },
    styleClassList: { // 树节点下样式列表
      get () {
        const found = findInTree(this.styleCategories, this.currentCategory)
        return found ? (found.classList ?? []) : []
      }
    },
    classListSelected: { // 选择的类样式列表
      get () {
        return this.selectedValues.map(val => {
          const classList = this.styleClassList.map(item => item.key)
          return classList.indexOf(val.split('/').slice(1).join(''))
        }).filter(i => i > -1)
      }
    },
    styleTitle: scope => { // 样式列表-单项-标题
      return scope.item.label
    },
    classPreviewHTML: scope => { // 样式列表-单项-内容
      return scope.item.html
    },
    itemClassName: scope => { // 选中项-单项名称
      return scope.item.split('/').slice(1).join('')
    }
  },

  async setup () {
    // 加载loadAppPackages中包含样式的样式信息
    for (const pkg of ridge.loadAppPackages ?? []) {
      if (pkg.ridgeDev) {
        await ridge.loader.confirmPackageDependencies(pkg.name)
        const devLoaded = (await import(ridge.baseUrl + '/' + pkg.name + '/' + pkg.ridgeDev)).default
        this.packageList.push({
          label: pkg.description,
          value: pkg.name,
          styleList: devLoaded
        })
      }
    }
    if (this.properties.value) {
      this.selectedValues = this.properties.value
    }
    this.initPackageCategorySelection()
  },
  actions: {
    initPackageCategorySelection () { // 恢复默认分类选择
      if (this.packageList.length) {
        this.currentPackage = this.packageList[0].value
        if (this.styleCategories[0].classList) {
          this.currentCategory = this.styleCategories[0].value
        } else {
          this.currentCategory = this.styleCategories[0].children[0].value
        }
      } else {
        this.currentPackage = ''
        this.currentCategory = ''
      }
    },
    onClassItemClick (i, data) { // 单击样式类
      const categoryNode = findInTree(this.styleCategories, this.currentCategory)
      const clickedItem = categoryNode.classList[i]
      const clickedValue = this.currentPackage + '/' + clickedItem.key

      if (this.selectedValues.indexOf(clickedValue) > -1) { // 已经选中过： 取消选择
        this.selectedValues = this.selectedValues.filter(val => val !== clickedValue)
      } else { // 未选中
        if (!categoryNode.multiple) { // 单选模式: 去掉同组已选
          this.selectedValues = this.selectedValues.filter(val => {
            const localValue = val.split('/').slice(1).join('')
            return categoryNode.classList.map(item => item.key).indexOf(localValue) === -1
          })
        }
        this.selectedValues.push(clickedValue)
      }
      this.emit('input', this.selectedValues)
    },
    onSelectedLabelClick (scope) { // 删除选择的样式
      this.selectedValues = this.selectedValues.filter(name => name !== scope.item)
      this.emit('input', this.selectedValues)
    },
    onLabelNameClick (scope) { // 切换状态样式
      this.selectedValues = this.selectedValues.map(name => {
         if (name === scope.item) {
           // 切换 tailwind/hover:red <-> tailwind/red
           const [ packageName, namePart ] = name.split('/')
           if (namePart.indexOf(':') > -1) {
             return packageName + '/' + namePart.split(':')[1]
           } else {
             return packageName + '/' + "hover:" + namePart
           }
         } else {
           return name
         }
      })
      this.emit('input', this.selectedValues)
    }
  }
}
