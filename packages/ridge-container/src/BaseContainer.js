/**
 * @abstract BaseContainer
 * 容器基础实现，包含通用配置及方法
 */
export default class BaseContainer {
  constructor (props) {
    this.props = props
    // 更新时同时强制更新子节点
    this.forceUpdateChildren = true
  }

  /**
   * 基础挂载后子组件初始化动作
   */
  mounted () {}

  // 销毁时触发
  destroy () {
    if (Array.isArray(this.children)) {
      for (const childNode of this.children) {
        // 安全判断：防止组件未加载完成时报错
        if (childNode && typeof childNode.unmount === 'function') {
          childNode.unmount()
        }
      }
    }
    if (this.el) {
      this.el.innerHTML = ''
    }
  }

  // 子节点移除后触发
  onChildRemoved () {}

  // 子节点添加后触发
  onChildAppended () {}

  // 更新子节点列表
  childListUpdated () {}

  // 获取容器样式
  getContainerStyle () {}

  // 子节点style信息
  getChildStyle (style) {}

  // 挂载子节点：  但是像Tab容器这样，可以延迟挂载
  async mountChildNode (childNode, div) {
    // 安全挂载：防止组件未初始化
    if (!childNode || !div) return
    await childNode.mount(div)
  }

  /**
   * 组件挂载到给定Element
   */
  async mount (el) {
    this.el = el
    this.el.style['touch-action'] = 'none'
    // 编辑器之下，属性有__isEdit
    this.isRuntime = !this.props.__isEdit
    this.isEditor = this.props.__isEdit

    this.containerEl = document.createElement('div')
    this.el.appendChild(this.containerEl)

    this.updateContainerStyle()

    this.children = this.props.children
    if (this.children) {
      const mountings = []
      for (const childNode of this.children) {
        // 安全过滤：防止空节点
        if (!childNode) continue

        try {
          const div = document.createElement('div')
          const childWrapper = this.getChildWrapper ? this.getChildWrapper() : this.containerEl
          childWrapper.appendChild(div)
          this.updateChildStyle(childNode, div)

          mountings.push(this.mountChildNode(childNode, div))
        } catch (e) {
          // 忽略渲染错误
        }
      }
      await Promise.allSettled(mountings)
    }
    await this.mounted()
  }

  unmountChildren () {
    if (!this.children) return

    for (const child of this.children) {
      // 安全卸载
      if (child && typeof child.unmount === 'function') {
        child.unmount()
      }
    }
  }

  checkNodeOrder (rect) {
    return -1
  }

  /**
   * 增加子节点
   */
  appendChild (childNode, { x, y }, index) {
    // 安全判断：防止组件未加载完成
    if (!childNode || !childNode.el) return

    const el = childNode.el

    if (index > -1 && this.containerEl.childNodes[index]) {
      this.containerEl.insertBefore(el, this.containerEl.childNodes[index])
    } else {
      this.containerEl.appendChild(el)
    }
    this.onChildAppended(childNode, { x, y })
    this.updateChildStyle(childNode)
  }

  /**
   * 更新子节点次序
   **/
  updateChildList (childList) {
    if (!childList) return

    for (const childNode of childList) {
      if (!childNode.el) continue
      this.containerEl.appendChild(childNode.el)
      this.updateChildStyle(childNode)
    }
    this.children = childList
    this.childListUpdated()
  }

  isDroppable () {
    return true
  }

  // 删除子节点
  removeChild (node) {
    if (!node || !node.el) return
    if (node.el.parentElement === this.containerEl) {
      this.containerEl.removeChild(node.el)
    }
    this.onChildRemoved(node)
  }

  /**
   * 计算并更新子节点样式
   * @param  {ElementWrapper} wrapper 封装类
   */
  updateChildStyle (childNode, div) {
    // 安全判断：防止节点未初始化
    if (!childNode) return

    const el = div || childNode.el
    if (el) {
      const style = Object.assign({}, this.getResetStyle(), this.getChildStyle(childNode.getStyle()))
      Object.assign(el.style, style)
    }
  }

  getChildren () {
    return this.children
  }

  getChildElements () {
    return Array.from(this.containerEl.childNodes).filter(el => el.ridgeNode)
  }

  updateContainerStyle () {
    // 更新容器本身样式
    Object.assign(this.containerEl.style, this.getContainerStyle())

    this.containerEl.className = (this.props.classList || []).join(' ')
    if (this.props.hoverable === true) {
      this.el.classList.add('ridge-is-hoverable')
    } else {
      this.el.classList.remove('ridge-is-hoverable')
    }
  }

  /**
   * 按属性联动方法
   * @param {*} props
   */
  update (props) {
    Object.assign(this.props, props)
    if (this.isEditor) {
      this.updateContainerStyle()
    }

    // 联动更新所有子节点
    if (this.forceUpdateChildren && this.children) {
      for (const childNode of this.children) {
        // 安全更新：防止组件未加载完成
        if (childNode && typeof childNode.forceUpdate === 'function') {
          childNode.forceUpdate()
        }
      }
    }
    this.updated && this.updated()
  }

  getResetStyle () {
    return {
      position: '',
      top: '',
      left: '',
      transform: '',
      width: '',
      height: ''
    }
  }
}
