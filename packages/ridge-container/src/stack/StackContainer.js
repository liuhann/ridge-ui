import BaseContainer from '../BaseContainer.js'
import './style.css'

/**
 * 堆叠容器 - 多个子节点层叠显示
 */
export default class StackContainer extends BaseContainer {
  constructor (props) {
    super(props)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
  }

  getContainerStyle () {
    return {
      overflow: 'hidden',
      position: 'relative' // 添加相对定位，确保子节点绝对定位基准正确
    }
  }

  // 挂载完成后的初始化
  async mounted () {
    this.containerEl.className = this.getContainerClassName()
    this.forceUpdateChildren = true

    if (!this.isEditor) {
      this.updateChildrenVisibility()
      this.addHoverListeners()
    }
  }

  // 获取容器类名
  getContainerClassName () {
    const baseClass = (this.props.classList || []).join(' ')
    return `${baseClass} stack-container`.trim()
  }

  // 添加 hover 监听
  addHoverListeners () {
    this.containerEl.addEventListener('mouseenter', this.handleMouseEnter)
    this.containerEl.addEventListener('mouseleave', this.handleMouseLeave)
  }

  // 移除 hover 监听
  removeHoverListeners () {
    this.containerEl.removeEventListener('mouseenter', this.handleMouseEnter)
    this.containerEl.removeEventListener('mouseleave', this.handleMouseLeave)
  }

  handleMouseEnter () {
    this.updateChildrenVisibility(true)
  }

  handleMouseLeave () {
    this.updateChildrenVisibility(false)
  }

  // 更新子节点可见性
  updateChildrenVisibility (isHover = false) {
    this.children?.forEach(childNode => {
      if (childNode.el && childNode.style?.showOnHover === true) {
        childNode.el.style.display = isHover ? '' : 'none'
      }
    })
  }

  // Editor Only - 子节点被选中
  childSelected (childEl) {}

  onChildRemoved () {}

  onChildAppended (childNode) {}

  updated () {
    this.containerEl.className = this.getContainerClassName()
  }

  // 修复：参数与父类一致
  getChildStyle (style) {
    return {
      ...this.getResetStyle(),
      ...style,
      width: '100%',
      height: '100%',
      position: 'absolute',
      left: 0,
      top: 0,
      zIndex: this.getChildZIndex(style) // 提取为独立方法
    }
  }

  // 获取子节点的 z-index
  getChildZIndex (style) {
    // 如果没有指定 zIndex，则使用元素在父容器中的顺序
    if (style?.zIndex !== undefined) {
      return style.zIndex
    }

    // 默认使用 DOM 顺序
    if (style._node && style._node.el) {
      const parent = style._node.el.parentElement
      if (parent) {
        const children = Array.from(parent.children)
        return children.indexOf(style._node.el)
      }
    }

    return 0
  }

  // 销毁时清理
  destroy () {
    if (!this.isEditor) {
      this.removeHoverListeners()
    }
    super.destroy()
  }
}
