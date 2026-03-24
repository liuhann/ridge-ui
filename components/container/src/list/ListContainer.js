import createDebug from 'debug'

const debug = createDebug('container:list')

function hasScrollbar (el) {
  return (
    el.scrollHeight > el.clientHeight ||
    el.scrollWidth > el.clientWidth
  )
}
class ListContainer {
  constructor (props) {
    this.props = props
  }

  mount (el) {
    this.el = el
    const { overflowAuto } = this.props

    if (overflowAuto) { // 内容超出滚动为是否有滚动条标识， 有则存在滚动容器
      if (!this.scrollerEl) {
        this.scrollerEl = document.createElement('div')
        this.containerEl = document.createElement('div')

        this.scrollerEl.style.width = '100%'
        this.scrollerEl.style.height = '100%'

        el.appendChild(this.scrollerEl)
        this.scrollerEl.appendChild(this.containerEl)
      }
    } else {
      if (!this.containerEl) {
        this.containerEl = document.createElement('div')
        el.appendChild(this.containerEl)
      }
    }
    this.renderUpdate()
    this.updateSortable()
  }

  updateChildStyle () { // 编辑期适用
    if (this.props.template && this.props.template.el) {
      this.props.template.el.style.width = this.props.template.config.style.width + 'px'
      this.props.template.el.style.height = this.props.template.config.style.height + 'px'
    }
  }

  update (props) {
    this.props = props
    this.renderUpdate()
  }

  renderUpdate () {
    const {
      classNames
    } = this.props
    Object.assign(this.containerEl.style, this.getContainerStyle())
    if (!this.props.__isEdit) {
      // 运行状态
      this.renderListItems()
    } else {
      this.renderUpdateSlots()
    }

    if (this.scrollerEl) {
      this.scrollerEl.className = classNames.join(' ')
      Object.assign(this.scrollerEl.style, this.getScrollerStyle())
    }
  }

  /**
   * 更新渲染列表插槽内容
   * @param {*} props
   */
  renderUpdateSlots (props) {
    if (props) { // update
      if (props.template !== this.props.template) {
        this.containerEl.append(props.template.el)
      }
    } else {
      // 初始化mount
      if (this.props.template) {
        if (this.props.template.el == null) {
          const el = document.createElement('div')
          this.containerEl.append(el)
          this.props.template.mount(el)
        } else {
          this.containerEl.append(this.props.template.el)
        }
      }
    }
  }

  getScrollerStyle () {
    const {
      direction = 'y'
    } = this.props
    if (direction === 'y') {
      return {
        boxSizing: 'border-box',
        overflow: 'hidden auto'
      }
    } else {
      return {
        boxSizing: 'border-box',
        overflow: 'auto hidden'
      }
    }
  }

  getContainerStyle () {
    const {
      gap,
      direction = 'y'
    } = this.props

    const containerStyle = {
      gap: gap + 'px',
      display: 'flex',
      flexDirection: direction === 'y' ? 'row' : 'column',
      padding: 0
    }

    containerStyle.flexWrap = 'wrap'
    return containerStyle
  }

  /**
   * 运行期间更新渲染列表
   */
  async renderListItems () {
    if (!this.props.template) return
    const { dataSource, gap, horizontalDivide, verticalDivide, template, fixedHeight, fixedWidth, onItemClick, selected, itemClassNames = [], selectedClassNames = [] } = this.props

    const that = this
    debug('renderListItems', dataSource)
    await template.load(true)
    if (this.items == null) {
      this.items = []
    }

    if (Array.isArray(dataSource)) {
      for (let index = 0; index < dataSource.length; index++) {
        const data = dataSource[index]
        if (this.items[index] == null) {
          const newEl = document.createElement('div')
          newEl.classList.add('ridge-is-selectable')
          const itemComponent = this.props.template.clone()
          itemComponent.setScopedData({
            i: index,
            list: dataSource,
            item: data,
            selected
          })
          this.items[index] = itemComponent
          const itemWrapperStyle = {
            position: '',
            top: '',
            left: '',
            transform: '',
            width: 'auto',
            height: 'auto'
          }

          if (fixedHeight) {
            itemWrapperStyle.height = itemComponent.config.style.height + 'px'
          } else {
            itemWrapperStyle.height = `calc((100% - ${gap * (verticalDivide - 1)}px) / ${verticalDivide})`
          }
          if (fixedWidth) {
            itemWrapperStyle.width = itemComponent.config.style.width + 'px'
          } else {
            itemWrapperStyle.width = `calc((100% - ${gap * (horizontalDivide - 1)}px) / ${horizontalDivide})`
          }

          Object.assign(newEl.style, itemWrapperStyle)
          this.containerEl.appendChild(newEl)
          newEl.onclick = () => {
            onItemClick && onItemClick({
              i: index,
              item: that.props.dataSource[index],
              liet: that.props.dataSource,
              selected
            })
          }

          if (data != null) {
            itemComponent.mount(newEl)
          } else {
            itemComponent.el = newEl
          }
        } else {
          this.items[index].setScopedData({
            i: index,
            list: dataSource,
            item: data,
            selected
          })
          if (data == null) {
            this.items[index].unmount()
          } else {
            if (!this.items[index].getIsMounted()) {
              this.items[index].mount()
            } else {
              this.items[index].forceUpdate()
            }
          }
        }
      }
      debug('renderListItems Finsished', dataSource)
      while (this.items.length > dataSource.length) {
        const pop = this.items.pop()
        debug('remove ', pop, dataSource)
        const el = pop.el
        pop.unmount()
        if (el && el.parentElement === this.containerEl) {
          this.containerEl.removeChild(el)
        }
      }
    } else {
      if (this.items.length) {
        for (const itemComponent of this.items) {
          const el = itemComponent.el
          itemComponent.unmount()
          if (el && el.parentElement === this.containerEl) {
            this.containerEl.removeChild(el)
          }
        }
        this.items = []
      }
    }

    for (let i = 0; i < this.containerEl.children.length; i++) {
      const classList = Array.from(this.containerEl.children[i].classList)

      if (selected != null && ((Array.isArray(selected) && selected.includes(i)) || i === selected)) { // 选中状态
        // this.containerEl.children[i].classList.add('ridge-is-selected')
        this.containerEl.children[i].className = Array.from(new Set([...classList, ...itemClassNames, ...selectedClassNames])).join(' ')

        // 2. 创建自定义事件
        const customEvent = new CustomEvent('selected', {
          bubbles: true
        })
        this.containerEl.children[i].dispatchEvent(customEvent)
      } else { // 未选中
        // this.containerEl.children[i].classList.remove('ridge-is-selected')
        this.containerEl.children[i].className = Array.from(new Set([...classList.filter(name => !selectedClassNames.includes(name)), ...itemClassNames])).join(' ')
        this.containerEl.children[i].dispatchEvent(new CustomEvent('unselected', {
          bubbles: true
        }))
      }
    }
  }

  async updateSortable () {
    const { sortable, __composite } = this.props
    if (sortable) {
      await __composite.loader.loadScript('sortablejs/Sortable.min.js')
      this.sortable = window.Sortable.create(this.containerEl)
    }
  }

  getChildStyle (view) {
    const style = this.getResetStyle()
    const configStyle = view.config.style

    style.width = configStyle.width ? (configStyle.width + 'px') : ''
    style.height = configStyle.height ? (configStyle.height + 'px') : ''
    return style
  }
}

export default ListContainer
