import BaseContainer from '../BaseContainer'

function getChildIndex (element) {
  if (!element || !element.parentNode) {
    return -1 // 如果元素不存在或没有父元素，返回-1
  }

  const children = Array.from(element.parentNode.children) // 将父元素的子节点转换为数组
  return children.indexOf(element) // 返回元素在数组中的索引
}

export default class RelativeContainer extends BaseContainer {
  getContainerStyle () {
    const { overflow } = this.props
    const containerStyle = {
      width: '100%',
      height: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
    if (overflow) {
      containerStyle.overflow = 'hidden'
    }
    return containerStyle
  }

  onChildAppended (element, { x, y }) {
    // 因为子节点是从外部拖入，其xy 都是相对于根的，这里根据传入的相对当前父的xy做更新
    element.updateConfig({
      style: { x, y, width: element.config.style.width, height: element.config.style.height }
    }, true)
  }

  onChildRemoved (element) {

  }

  getChildStyle (element) {
    const { width, height } = this.props
    const style = this.getResetStyle()
    const configStyle = element.config.style
    if (this.isRuntime) {
      // 运行时安编辑态值计算出相对
      style.position = 'absolute'
      if (configStyle.align) {
        if (configStyle.align.indexOf('left') > -1) {
          style.left = configStyle.x + 'px'
        }
        if (configStyle.align.indexOf('right') > -1 && width) {
          style.right = (width - configStyle.x - configStyle.width) + 'px'
        }
        if (configStyle.align.indexOf('top') > -1) {
          style.top = configStyle.y + 'px'
        }
        if (configStyle.align.indexOf('bottom') > -1 && height) {
          style.bottom = (height - configStyle.y - configStyle.height) + 'px'
        }
      } else {
        style.position = 'absolute'
        style.top = configStyle.y + 'px'
        style.left = configStyle.x + 'px'
        style.width = configStyle.width + 'px'
        style.height = configStyle.height + 'px'
      }

      style.zIndex = getChildIndex(element.el) + 10
    } else {
      style.position = 'absolute'
      style.top = configStyle.y + 'px'
      style.left = configStyle.x + 'px'
      style.width = configStyle.width + 'px'
      style.height = configStyle.height + 'px'
    }
    return style
  }
}
