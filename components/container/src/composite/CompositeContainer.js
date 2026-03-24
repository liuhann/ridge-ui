/**
 * Composite类型组件封装类
 */
class CompositeContainer {
  constructor (props) {
    this.props = props
  }

  getRidge () {
    return window.ridge ?? this.props.ridge
  }

  async mount (el) {
    this.el = el
    this.containerEl = document.createElement('div')
    el.appendChild(this.containerEl)
    this.updateContainerStyle()
    this.loadMountComposite()
  }

  async loadMountComposite () {
    const ridge = this.getRidge()
    const { packageName, pagePath, __composite, ...props } = this.props
    // 页面改变了重新挂载
    if (this.containerEl.composite) {
      this.containerEl.composite.unmount()
    }

    if (pagePath) {
      // 这里包名如果未明确定义，表示包就再初始包之中
      const compositeCreated = await ridge.createComposite(packageName || __composite.packageName, pagePath, props)

      if (compositeCreated) {
        this.containerEl.composite = compositeCreated
        this.el.composite = compositeCreated
        await compositeCreated.initialize()
        await compositeCreated.mount(this.containerEl)
      }
    }
  }

  updateContainerStyle () {
    const { classList } = this.props
    this.containerEl.className = [...(classList || []), 'ridge-composite'].join(' ')
    // this.containerEl.style.overflow = 'hidden'
  }

  update (props) {
    if (this.props.packageName !== props.packageName || this.props.pagePath !== props.pagePath) {
      Object.assign(this.props, props)
      this.loadMountComposite()
    } else {
      if (this.el.composite) {
        Object.assign(this.props, props)
        this.el.composite.setProperties(this.props)
      }
    }
    this.updateContainerStyle()
  }

  destroy () {
    if (this.containerEl) {
      if (this.containerEl.composite) {
        this.containerEl.composite.unmount()
      }
      this.el.removeChild(this.containerEl)
    }
  }
}

export default CompositeContainer
