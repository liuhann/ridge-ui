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

function isTouchSupported () {
  return (
    'TouchEvent' in window || // 标准方法
    'ontouchstart' in window || // 兼容性检查
    navigator.maxTouchPoints > 0 // 检测物理触摸点
  )
}

export default class FlexBoxContainer extends BaseContainer {
  mounted () {
    this._doOnClick = this.doOnClick.bind(this)
    this._doOnMouseDown = this.doOnMouseDown.bind(this)
    if (this.el) {
      this.el.addEventListener('click', this._doOnClick)

      this.el.onpointerdown = this._doOnMouseDown
      // if (isTouchSupported()) {
      //   this.el.addEventListener('touchstart', () => {
      //     console.log('touch start')
      //     this._doOnMouseDown()
      //   })
      // } else {
      //   this.el.addEventListener('mousedown', () => {
      //     console.log('mouse down')
      //     this._doOnMouseDown()
      //   })
      // }
    }
  }

  // 销毁时触发
  destroy () {
    if (this.el) {
      this.el.removeEventListener('click', this._doOnClick)
      this.el.removeEventListener('mousedown', this._doOnMouseDown)
    }
  }

  doOnMouseDown () {
    this.props.onMouseDown && this.props.onMouseDown()
  }

  doOnClick () {
    this.props.onClick && this.props.onClick()
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

      // 如果所有子节点都设置为固定主轴长度， 那么主轴方向自动出滚动条   否则内容必然会被遮盖
      /*
      if (this.props.children.find(node => node.config.style.flex) == null) {
        if (direction === 'column') {
          containerStyle.overflowY = 'auto'
          containerStyle.overflowX = 'hidden'
        } else {
          containerStyle.overflowY = 'hidden'
          containerStyle.overflowX = 'auto'
        }
      }
      */
    }

    // if (this.el.style.flex) {
    //   if (direction === 'row') {
    //     containerStyle.overflowX = 'hidden'
    //   } else {
    //     containerStyle.overflowY = 'hidden'
    //   }
    // }
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

  getChildStyle (node, el) {
    const style = this.getResetStyle()
    const configStyle = Object.assign({}, node.config.style, node.style)

    if (!configStyle.visible) {
      style.display = 'none'
    } else {
      style.display = ''
    }

    if (configStyle.hoverVisible) {
      el.classList.add('hidden-to-visible')
    }

    // 交叉轴方向长度
    if (configStyle.alignSelfStretch) { // 单独拉伸
      style.alignSelf = 'stretch'
    } else if (this.props.alignItems !== 'stretch') { // 交叉不拉伸
      if (this.props.direction === 'row') {
        // style.height = toCSSLength(configStyle.height)
        style.height = configStyle.height ? `min(100%, ${configStyle.height}px)` : ''
      } else if (this.props.direction === 'column') {
        // style.width = toCSSLength(configStyle.width)
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
        if (this.props.direction === 'row') {
          style.width = configStyle.width ? `min(100%, ${configStyle.width}px)` : ''
        } else {
          style.height = configStyle.height ? `min(100%, ${configStyle.height}px)` : ''
        }
      } else {
        if (this.props.direction === 'row') {
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
      if (this.props.direction === 'row') {
        style.flexShrink = '0'
      }
    }

    if (configStyle.autoHeight) {
      delete style.height
      if (this.props.direction === 'column') {
        style.flexShrink = '0'
      }
    }
    return style
  }
}
