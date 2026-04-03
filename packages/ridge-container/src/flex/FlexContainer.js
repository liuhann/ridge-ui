import BaseContainer from '../BaseContainer'

// 将数值转换为合法的css长度值  主要是  12-> 12px
const toCSSLength = (value) => {
  if (value == null) return value // 处理 null/undefined
  const str = String(value).trim()
  return /^(auto|inherit|initial|unset|0|calc|min|max|clamp)/.test(str) ||
         /[^\d.]\s*\d/.test(str)
    ? str
    : `${parseFloat(str) || 0}px`
}

export default class FlexBoxContainer extends BaseContainer {
  mounted () {
  }

  // 销毁时触发
  destroy () {
  }

  getContainerStyle () {
    const {
      // 相关系统变量
      direction = 'row',
      alignItems = 'stretch',
      gap = 0,
      padding,
      flexWrap,
      justify = 'flex-start',
      rectStyle
    } = this.props
    const containerStyle = {
      display: 'flex',
      flexDirection: direction,
      width: '100%',
      height: '100%',
      flexWrap: flexWrap ? 'wrap' : 'no-wrap',
      justifyContent: justify,
      alignItems,
      boxSizing: 'border-box',
      padding: padding + 'px',
      gap: gap + 'px'
    }

    // 任何子元素自动大小，则溢出就是自动
    if (Array.isArray(this.props.children)) {
      for (const childNode of this.props.children) {
        // 安全判断：防止节点未初始化
        if (!childNode.config || !childNode.config.style) continue

        if (childNode.config.style.autoSize === true) {
          containerStyle.overflow = 'auto'
        }
        if (childNode.config.style.autoWidth) {
          containerStyle.overflowX = 'auto'
        }
        if (childNode.config.style.autoHeight) {
          containerStyle.overflowY = 'auto'
        }
      }
    }

    Object.assign(containerStyle, rectStyle)
    return containerStyle
  }

  // 放入一个新的rect后，根据位置放置其所在子节点的索引
  checkNodeOrder (rect) {
    const centerX = rect.x + rect.width / 2
    const centerY = rect.y + rect.height / 2
    const childNodes = this.containerEl.childNodes
    const {
      // 相关系统变量
      direction = 'row'
    } = this.props

    if (direction === 'row') {
      // 横向
      for (let i = 0; i < childNodes.length; i++) {
        const bc = childNodes[i].getBoundingClientRect()
        const compareX = bc.x + bc.width / 2
        if (compareX > centerX) {
          return i
        }
      }
    } else if (direction === 'column') {
      // 纵向
      for (let i = 0; i < childNodes.length; i++) {
        const bc = childNodes[i].getBoundingClientRect()
        const compareY = bc.y + bc.height / 2
        if (compareY > centerY) {
          return i
        }
      }
    }
    return -1
  }

  childSelected (node) {
    // 安全判断：防止组件未加载完成
    if (!node || !node.config || !node.config.style || !node.el) return

    const configStyle = node.config.style
    // 调整实际宽度
    if (!configStyle.flex && !configStyle.autoSize) {
      if (this.props.direction === 'row' && node.el.offsetWidth !== 0) {
        node.el.style.width = node.el.offsetWidth + 'px'
        node.config.style.width = node.el.offsetWidth
      } else if (node.el.offsetHeight !== 0) {
        node.el.style.height = node.el.offsetHeight + 'px'
        node.config.style.height = node.el.offsetHeight
      }
    }
  }

  getChildStyle (configStyle = {}) {
    const direction = this.props.direction || 'row'
    const alignItems = this.props.alignItems || 'flex-start'
    const style = {}
    if (!configStyle.visible) {
      style.display = 'none'
    } else {
      style.display = ''
    }

    // 交叉轴方向长度
    if (configStyle.alignSelfStretch) { // 单独拉伸
      style.alignSelf = 'stretch'
    } else if (alignItems !== 'stretch') { // 交叉不拉伸
      if (direction === 'row') {
        style.height = configStyle.height ? `min(100%, ${configStyle.height}px)` : ''
      } else if (direction === 'column') {
        style.width = configStyle.width ? `min(100%, ${configStyle.width}px)` : ''
      }
    }

    // 主轴方向长度
    if (configStyle.flex) { // 设置主轴方向长度 flex -动态
      style.flex = configStyle.flex
      if (configStyle.flex === 'auto') {
        if (this.props.direction === 'row') {
          style.width = toCSSLength(configStyle.width)
        } else {
          style.height = toCSSLength(configStyle.height)
        }
      }
      if (this.props.direction === 'row') { // hidden避免内容拉长内容
        style.overflowX = 'hidden'
      } else {
        style.overflowY = 'hidden'
      }
      style.flexShrink = '0'
    } else { // 非flex 按配置的宽或者高
      // 主轴方向宽高
      style.flex = 'none'
      // 如果只有一个子节点， 那么认为属于基础布局类型  宽高设置为不超过外层100%
      if (Array.isArray(this.props.children) && this.props.children.length === 1) {
        if (direction === 'row') {
          style.width = configStyle.width ? `min(100%, ${configStyle.width}px)` : ''
        } else {
          style.height = configStyle.height ? `min(100%, ${configStyle.height}px)` : ''
        }
      } else {
        if (direction === 'row') {
          style.width = toCSSLength(configStyle.width)
        } else {
          style.height = toCSSLength(configStyle.height)
        }
      }
    }

    // 对自动宽高情况的处理
    // 主要逻辑就是去除宽/高的设置，同时去掉主轴方向的flexShrink（因为flexShrink会造成长度自动拉长后仍然会占用足够多的空间）
    if (configStyle.autoWidth) {
      delete style.width
      style.minWidth = '10px'
      if (this.props.direction === 'row') {
        style.flexShrink = '0'
      }
    }

    if (configStyle.autoHeight) {
      delete style.height
      style.minHeight = '10px'
      if (this.props.direction === 'column') {
        style.flexShrink = '0'
      }
    }
    return style
  }

  getChildStyle1 (configStyle = {}) {
    const direction = this.props.direction || 'row'
    const {
      flexRatio = 0,
      width = 0,
      height = 0,
      overflow = 'auto',
      visible = true
    } = configStyle

    const style = {}

    // 1. 隐藏
    if (!visible) {
      style.display = 'none'
      return style
    }

    // 2. 弹性模式
    if (flexRatio > 0) {
      style.flex = flexRatio
      style.flexShrink = 0
      style.minWidth = 0
      style.minHeight = 0

      if (overflow === 'hidden') {
        style.overflow = 'hidden'
        style.textOverflow = 'ellipsis'
      } else if (overflow === 'scroll') {
        style.overflow = 'auto'
      } else {
        style.overflow = 'hidden'
      }
      style.whiteSpace = 'nowrap'
      return style
    }

    // ==============================================
    // 固定模式（核心：永远不超出父容器！）
    // ==============================================
    if (direction === 'row') {
      if (overflow === 'auto') {
      // 自动拉伸：内容撑开 + 最小宽度20px（不会看不见）
        style.width = 'auto'
        style.minWidth = '20px'
      } else {
      // ✅ 固定宽度，但永远不超过父容器 100%（拖拽神器）
        style.width = width > 0 ? `min(${width}px, 100%)` : 'auto'
        style.minWidth = '20px'
      }

      // 高度同样限制不超出父
      if (height > 0) {
        style.height = `min(${height}px, 100%)`
      }
    } else {
      if (overflow === 'auto') {
        style.height = 'auto'
        style.minHeight = '20px'
      } else {
      // ✅ 固定高度，永远不超过父容器 100%
        style.height = height > 0 ? `min(${height}px, 100%)` : 'auto'
        style.minHeight = '20px'
      }

      // 宽度同样限制
      if (width > 0) {
        style.width = `min(${width}px, 100%)`
      }
    }

    // 固定模式不被压缩
    style.flexShrink = 0

    // 溢出处理
    if (overflow === 'hidden') {
      style.overflow = 'hidden'
      style.textOverflow = 'ellipsis'
      style.whiteSpace = 'nowrap'
    } else if (overflow === 'scroll') {
      style.overflow = 'auto'
      style.whiteSpace = 'nowrap'
    } else {
      style.overflow = 'visible'
      style.whiteSpace = 'normal'
    }

    return style
  }
}
