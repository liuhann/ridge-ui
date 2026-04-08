/**
 * 容器基类，包含通用配置及方法
 */
export default class BaseContainer {
  constructor (props) {
    this.props = props
    this.forceUpdateChildren = true
  }

  // 基础挂载后初始化
  mounted () {}

  // 销毁
  destroy () {
    this.unmountChildren()
    this.el && (this.el.innerHTML = '')
  }

  // 子节点相关事件
  onChildRemoved () {}
  onChildAppended () {}
  childListUpdated () {}

  // 样式相关
  getContainerStyle () {}
  getChildStyle (style) {}

  // 挂载子节点
  async mountChildNode (childNode, div) {
    childNode && div && await childNode.mount(div)
  }

  // 组件挂载
  async mount (el) {
    this.el = el
    this.el.style['touch-action'] = 'none'
    this.isRuntime = !this.props.__isEdit
    this.isEditor = this.props.__isEdit

    this.containerEl = document.createElement('div')
    this.el.appendChild(this.containerEl)
    this.updateContainerStyle()

    await this.mountChildren()
    await this.mounted()
  }

  // 挂载所有子节点
  async mountChildren () {
    this.children = this.props.children
    if (!this.children) return

    const mountings = []
    for (const childNode of this.children) {
      if (!childNode) continue

      try {
        const div = document.createElement('div')
        const childWrapper = this.getChildWrapper?.() || this.containerEl
        childWrapper.appendChild(div)
        this.updateChildStyle(childNode, div)
        mountings.push(this.mountChildNode(childNode, div))
      } catch (e) {
        console.warn('子节点挂载失败:', e)
      }
    }

    await Promise.allSettled(mountings)
  }

  // 卸载子节点
  unmountChildren () {
    this.children?.forEach(child =>
      child?.unmount?.()
    )
  }

  // 检查节点顺序
  checkNodeOrder (rect) {
    return -1
  }

  // 添加子节点
  appendChild (childNode, { x, y } = {}, index) {
    if (!childNode?.el) return

    const { el, containerEl } = childNode
    const refNode = containerEl.childNodes[index]

    refNode
      ? containerEl.insertBefore(el, refNode)
      : containerEl.appendChild(el)

    this.onChildAppended(childNode, { x, y })
    this.updateChildStyle(childNode)
  }

  // 更新子节点列表
  updateChildList (childList) {
    if (!childList) return

    childList.forEach(childNode => {
      if (childNode?.el) {
        this.containerEl.appendChild(childNode.el)
        this.updateChildStyle(childNode)
      }
    })

    this.children = childList
    this.childListUpdated()
  }

  // 是否可拖放
  isDroppable () {
    return true
  }

  // 删除子节点
  removeChild (node) {
    if (!node?.el) return

    const { parentElement } = node.el
    if (parentElement === this.containerEl) {
      parentElement.removeChild(node.el)
    }

    this.onChildRemoved(node)
  }

  // 更新子节点样式
  updateChildStyle (childNode, div) {
    if (!childNode) return

    const targetEl = div || childNode.el
    if (targetEl) {
      const style = {
        ...this.getResetStyle(),
        ...this.getChildStyle(childNode.getStyle?.() || {})
      }
      Object.assign(targetEl.style, style)
    }
  }

  getChildren () {
    return this.children || []
  }

  getChildElements () {
    return Array.from(this.containerEl?.childNodes || [])
      .filter(el => el.ridgeNode)
  }

  // 更新容器样式
  updateContainerStyle () {
    Object.assign(this.containerEl.style, this.getContainerStyle())

    this.containerEl.className = (this.props.classList || []).join(' ')

    const hoverClass = 'ridge-is-hoverable'
    this.el.classList.toggle(hoverClass, this.props.hoverable === true)
  }

  // 更新属性
  update (props) {
    Object.assign(this.props, props)

    if (this.isEditor) {
      this.updateContainerStyle()
    }

    // 联动更新子节点
    if (this.forceUpdateChildren) {
      this.children?.forEach(child =>
        child?.forceUpdate?.()
      )
    }

    this.updated?.()
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
