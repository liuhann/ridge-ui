class ListContainer {
  constructor (props) {
    this.props = props || {}
    this.el = null
    this.scrollerEl = null
    this.containerEl = null
    this.items = []
  }

  mount (el) {
    if (!el || !(el instanceof window.HTMLElement)) return
    this.el = el

    if (!this.scrollerEl && !this.props.__isEdit) {
      this.scrollerEl = document.createElement('div')
      this.containerEl = document.createElement('div')

      this.scrollerEl.style.width = '100%'
      this.scrollerEl.style.height = '100%'
      this.scrollerEl.style.overflow = 'auto'
      this.scrollerEl.style.boxSizing = 'border-box'

      el.appendChild(this.scrollerEl)
      this.scrollerEl.appendChild(this.containerEl)
    }
    this.renderUpdate()
  }

  // 编辑期：更新子项宽高
  updateChildStyle () {
    const { children } = this.props

    if (children.length) {
      const template = children[0]
      if (template) {
        const style = template.config.style
        if (style.width) template.el.style.width = style.width + 'px'
        if (style.height) template.el.style.height = style.height + 'px'
      }
    }
  }

  update (props) {
    this.props = props || {}
    this.renderUpdate()
  }

  renderUpdate () {
    if (!this.props.__isEdit) {
      Object.assign(this.containerEl.style, this.getContainerStyle())
      this.renderListItems()
    } else {
      this.renderUpdateSlots()
      this.updateChildStyle()
    }
  }

  // 编辑期渲染插槽
  renderUpdateSlots () {
    const { children } = this.props

    if (children.length) {
      const template = children[0]
      if (template.el) {
        this.el.append(template.el)
      } else {
        const el = document.createElement('div')
        this.el.append(el)
        template.mount?.(el)
      }
    }
  }

  // 网格容器样式（仅保留 columns / padding / gap）
  getContainerStyle () {
    const { padding = 0, gap = 0, columns = 1 } = this.props
    return {
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      padding: padding + 'px',
      gap: gap + 'px',
      boxSizing: 'border-box',
      width: '100%'
    }
  }

  // 运行期渲染列表（仅使用 dataSource + template）
  async renderListItems () {
    const { template, dataSource } = this.props
    if (!template || !Array.isArray(dataSource)) return

    try {
      await template.load(true)
    } catch (err) {
      console.error('列表项模板加载失败', err)
      return
    }

    // 渲染每一项
    dataSource.forEach((item, index) => {
      if (!this.items[index]) {
        this.createItem(index, item)
      } else {
        this.updateItem(index, item)
      }
    })

    // 移除多余项
    while (this.items.length > dataSource.length) {
      const item = this.items.pop()
      item.unmount?.()
      if (item.el?.parentElement === this.containerEl) {
        this.containerEl.removeChild(item.el)
      }
    }
  }

  // 创建列表项
  createItem (index, data) {
    const { template, onItemClick } = this.props

    const itemEl = document.createElement('div')
    itemEl.classList.add('list-item')

    // 实例化子组件
    const itemComponent = template.clone()
    itemComponent.setScopedData({
      i: index,
      list: this.props.dataSource,
      item: data
    })

    // 挂载
    this.containerEl.appendChild(itemEl)
    data ? itemComponent.mount(itemEl) : (itemComponent.el = itemEl)
    this.items[index] = itemComponent

    // 点击事件
    itemEl.onclick = () => {
      onItemClick?.({
        i: index,
        item: this.props.dataSource[index],
        list: this.props.dataSource
      })
    }
  }

  // 更新列表项
  updateItem (index, data) {
    const item = this.items[index]
    item.setScopedData({
      i: index,
      list: this.props.dataSource,
      item: data
    })

    if (!data) {
      item.unmount?.()
    } else if (!item.getIsMounted?.()) {
      item.mount?.()
    } else {
      item.forceUpdate?.()
    }
  }
}

export default ListContainer
