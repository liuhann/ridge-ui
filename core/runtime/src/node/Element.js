import debugGen from 'debug'
import ReactRenderer from '../render/ReactRenderer'
import VanillaRender from '../render/VanillaRenderer'
import createReactElement from '../render/createReactElement.js'
import { STORE, PROP } from '../utils/contants.js'
import { nanoid } from '../utils/string'
import BaseNode from './BaseNode.js'
import {
  forceDOMElementState,
  handleClassListPropValue
} from '../utils/pseudo.js'
import { isObject, isObjectsEqual } from '../utils/is.js'
const debug = debugGen('ridge:element')
/**
 * 节点元素类，处理所有使用非composite方式实现的组件
 */
class Element extends BaseNode {
  constructor ({
    config,
    composite,
    componentDefinition
  }) {
    super()
    this.config = config
    this.uuid = 'ins-' + nanoid(8)
    this.composite = composite
    this.componentDefinition = componentDefinition
    this.properties = {}
    this.events = {}
    debug('create', this.config.id)

    if (!this.config.events) {
      this.config.events = {}
    }
    if (this.config.visible == null) {
      this.config.visible = true
    }
    if (!this.config.slots) {
      this.config.slots = []
    }
    if (!this.config.propEx) {
      this.config.propEx = {}
    }
    if (!this.config.styleEx) {
      this.config.propEx = {}
    }

    this.onMounted(() => {
      this.bindDOMEvents()
    })
  }

  getId () {
    return this.config.id
  }

  getProperties () {
    return Object.assign({
      // 转入传给组件的特殊属性,目前包括：width/height/visible
      // width: this.style.width,
      // height: this.style.height,
      // visible: this.style.visible,
      // __composite: this.composite,
      // Since 1.4 增加__applyEffect动作，可以用插件更新
      // __applyEffect: this.composite.context.applyEffect.bind(this.composite.context)
    }, this.config.props, this.events, this.properties, {
      children: this.children
    })
  }

  getConfig () {
    return this.config
  }

  getEl () {
    return this.el
  }

  getParent () {
    return this.parent
  }

  getScopedData () {
    const parent = this.getParent()
    const parentScopes = parent ? parent.getScopedData() : []

    if (this.scopedData == null) {
      return parentScopes
    } else {
      return [this.scopedData, ...parentScopes]
    }
  }

  setScopedData (scopedData) {
    this.scopedData = scopedData
  }

  /**
   * 加载组件代码、按代码初始化属性
   * @param includeChildren 是否随之加载子组件 默认不加载
   */
  async load (includeChildren) {
    if (!this.componentDefinition) {
      if (this.config.path) {
        this.componentDefinition = await this.composite.loader.loadComponent(this.config.path)
      }
    }
    if (!this.componentDefinition) {
      this.setStatus('not-found')
      return false
    } else {
      // 处理加载子元素
      if (includeChildren && this.config.props.children) {
        for (const id of this.config.props.children) {
          const childNode = this.composite.getNode(id)
          if (childNode) {
            await childNode.load(true)
          }
        }
      }
      return true
    }
  }

  // 首次渲染：最快的方式渲染出组件占位信息
  firstPaint (el) {
    if (el) {
      this.el = el
    }
    debug('el first paint', this.config.title, this)
    this.firstPainted = true
    this.setStatus('Loading')
    this.el.setAttribute('ridge-title', this.config.title)
    this.el.setAttribute('ridge-mount', 'mounting')

    // 更新外围样式 这里不需要组件加载完成
    this.style = Object.assign({}, this.config.style)
    this.updateStyle()
  }

  /**
   * 组件mount到具体DOM元素
   * @param {*} el
   * @returns
   */
  async mount (el) {
    if (el) {
      if (this.el && this.el !== el) {
        // 取消之前挂载
        debug('Do Unmount Before Mount')
        try {
          this.unmount()
        } catch (e) {}
      }
      this.el = el
    }
    if (!this.el) {
      return
    }
    debug('mounting', this.config.id, this)
    this.el.ridgeNode = this

    if (!this.firstPainted) {
      this.firstPaint()
    }

    this.forceUpdateStyle()
    if (!this.componentDefinition) {
      await this.load()
    }

    if (this.componentDefinition) {
      try {
        this.initializeEvents()
        this.initSubscription()
        this.updateConnectedProperties()
        this.preparePropsBeforeRender()
        this.createRenderer()
        this.mounted && this.mounted()
        debug('mounted', this.config.id, this)
        this.el.setAttribute('ridge-mount', 'mounted')
        this.removeStatus()
      } catch (e) {
        console.error('ridge element mount error:', e)
      }
    }
  }

  getIsMounted () {
    return this.isMounted
  }

  mounted () {
    this.mounteds && this.mounteds.forEach(m => m(this))
    this.isMounted = true
  }

  /**
   * 组件挂载完成后的回调， 组件挂载成功后
   * @param {*} mounted
   */
  onMounted (mounted) {
    if (this.isMounted === true) {
      mounted(this)
    } else {
      if (!this.mounteds) {
        this.mounteds = []
      }
      this.mounteds.push(mounted)
    }
  }

  /**
   * 初始化(递归)所有可触达节点
   */
  initChildren () {
    if (this.config.props.children && this.children == null) {
      this.children = []
      for (const id of this.config.props.children) {
        const childNode = this.composite.getNode(id)
        if (childNode) {
          childNode.parent = this
          this.children.push(childNode)
          childNode.initChildren()
        }
      }
    }

    if (this.config.slots && this.config.slots.length) {
      for (const id of this.config.slots) {
        const childNode = this.composite.getNode(id)
        if (childNode) {
          childNode.parent = this
          childNode.isSlot = true
          childNode.initChildren()
        }
      }
    }
  }

  /**
   * 初始化组件属性、事件
   */
  initializeEvents () {
    for (const [eventName, actions] of Object.entries(this.config.events ?? {})) {
      this.events[eventName] = (...payload) => {
        if (Array.isArray(actions)) {
          for (const action of actions) {
            if (action.store && action.method) {
              const scopedData = this.getScopedData()
              const event = {
                payload,
                scopedData,
                eventArgs: action.payload
              }
              this.composite.store.doStoreAction(action.store, action.method, event)
            }
          }
        } else if (actions === 'promoted') {
          this.composite.emit(this.getId() + '-' + eventName, payload)
        }
      }
    }
  }

  bindDOMEvents () {
    // 对定义了ridge-is-hoverable的节点, 当上浮时, 对子节点执行 hover:xxx的样式
    if (this.el && this.el.classList.contains('ridge-is-hoverable')) {
      this.el.addEventListener('mouseenter', this.handleMouseOver)
      this.el.addEventListener('mouseleave', this.handleMouseOut)
    }
    if (this.el && this.el.classList.contains('ridge-is-selectable')) {
      this.el.addEventListener('selected', event => {
        forceDOMElementState(event.target, 'selected')
      })
      this.el.addEventListener('unselected', event => {
        forceDOMElementState(event.target, 'selected', true)
      })
    }
  }

  // 动态指定的属性和样式的更新
  initSubscription () {
    if (isObject(this.config.styleEx)) {
      Object.values(this.config.styleEx).forEach(expr => {
        this.composite.store?.subscribe && this.composite.store.subscribe(expr, () => {
          this.forceUpdateStyle()
        })
      })
    }
    if (isObject(this.config.propEx)) {
      Object.values(this.config.propEx).forEach(expr => {
        this.composite.store?.subscribe && this.composite.store.subscribe(expr, () => {
          this.forceUpdateProperty()
        })
      })
    }
  }

  createRenderer () {
    if (this.componentDefinition == null) {
      return null
    }
    try {
      if (VanillaRender.isComponent(this.componentDefinition)) {
        this.renderer = new VanillaRender(this.componentDefinition, this.getProperties())
        this.renderer.mount(this.el)
      } else if (ReactRenderer.isComponent(this.componentDefinition)) {
        this.renderer = new VanillaRender(this.componentDefinition, this.getProperties())
        this.renderer.mount(this.el)
      }
    } catch (e) {
      this.setStatus('render-error', {
        code: 'R_ERR',
        error: e
      })
      console.error('组件初始化渲染异常', this.componentDefinition, e)
    }
  }

  /**
   * 重新计算连接的样式并进行更新
   */
  forceUpdateStyle () {
    const beforeObject = {
      width: this.style.width,
      height: this.style.height,
      visible: this.style.visible
    }
    this.updateConnectedStyle()
    this.updateStyle()

    const afterObject = {
      width: this.style.width,
      height: this.style.height,
      visible: this.style.visible
    }
    if (!isObjectsEqual(beforeObject, afterObject)) {
      // 属性不同也执行下更新组件属性
      this.updateProps()
    }
  }

  forceUpdateProperty () {
    this.updateConnectedProperties()
    this.updateProps()
  }

  /**
   * Re-evaluate connected properties and styles, update component view
   */
  forceUpdate () {
    this.forceUpdateStyle()
    this.forceUpdateProperty()
  }

  /**
   * 更新动态属性
   * @param {*} props 要更改的属性
   */
  updateProps (props) {
    if (props) {
      Object.assign(this.properties, props)
    }
    debug('updateProps', this.config.id, this.properties)
    if (this.renderer && this.el && this.el.getAttribute('ridge-mount') === 'mounted') {
      this.preparePropsBeforeRender()
      this.renderUpdate()
    } else {
      debug('updateProps umounted', this.getId(), this)
    }
  }

  renderUpdate () {
    const propertiesForUpdate = this.getProperties()
    try {
      debug('updateProps', this.config.id, propertiesForUpdate)
      this.renderer.updateProps(propertiesForUpdate)
    } catch (e) {
      console.error('Render Error:', e, this, propertiesForUpdate)
    }
  }

  // 计算随变量绑定的样式
  updateConnectedStyle () {
    if (!this.composite.store) return

    for (const styleName of Object.keys(this.config.styleEx || {})) {
      if (this.config.styleEx[styleName] == null || this.config.styleEx[styleName] === '') {
        continue
      }
      this.style[styleName] = this.composite.store.getStoreValue(this.config.styleEx[styleName], this.getScopedData())
    }
  }

  updateChildStyle (childNode) {
    this.invoke('updateChildStyle', [childNode])
  }

  /**
   *  更新组件外层样式
   **/
  updateStyle () {
    if (this.el) {
      this.el.setAttribute('component', this.config.path)
      this.el.setAttribute('ridge-id', this.config.id)
      this.el.setAttribute('ridge-title', this.config.title)
      this.el.classList.add('ridge-element')

      // 处理显隐状态
      if (this.style.visible === false) {
        this.el.classList.add('ridge-runtime-hidden')
      } else {
        this.el.classList.remove('ridge-runtime-hidden')
      }
      if (this.parent) {
        this.parent.updateChildStyle(this)
      }
      this.invoke('onStyleUpdated', [this])

      this.styleUpdated && this.styleUpdated()
    }
  }

  /**
   * 计算所有表达式值
   */
  updateConnectedProperties () {
    if (!this.composite.store) return
    if (!isObject(this.config.propEx)) {
      return
    }
    for (const [key, value] of Object.entries(this.config.propEx)) {
      if (value == null || value === '') {
        continue
      }
      if (value.startsWith(STORE + '.' + PROP)) {
        const [store, prop, label] = value.split('.')

        if (label && this.composite.properties[label] != null) {
          this.config.props[key] = this.composite.properties[label]
        }
      } else {
        try {
          this.properties[key] = this.composite.store.getStoreValue(value, this.getScopedData())
        } catch (e) {
          debug('updateConnectedProperties Fail', value, e)
        }
      }
    }
  }

  /**
   * 获取传给组件的插槽类型属性值， 主要对react进行一步转化以便react组件使用
   * @param {*} node
   * @returns
   */
  getSlotPropValue (node) {
    if (node) {
      // await slotNode.initialize(true)
      node.parent = this
      node.isSlot = true
      if (this.componentDefinition.type === 'react') {
        return createReactElement(node)
      } else {
        return node
      }
    } else {
      return null
    }
  }

  needPrepareProps () {

  }

  prepareSlotProperties () {

  }

  /**
   * 渲染前重新调整组件属性取值。 主要用于以下属性类型
   * 1. image|file: 获取图片实际加载地址(浏览器端加载二进制流、运行端加载实际运行地址)
   * 2. slot： 转换查找目标组件实例、并加载
   * 3. decorate: 查找目标组件
   * 4. classList： 加载类样式所在组件包里面的样式文件
   */
  preparePropsBeforeRender () {
    if (!this.componentDefinition) return
    if (!isObject(this.config.props)) return
    let slotOrder = 0
    for (let i = 0; i < (this.componentDefinition.props || []).length; i++) {
      const prop = this.componentDefinition.props[i]
      if (prop.type === 'image' || prop.type === 'file') {
        // 图片或转化 config + properties
        const configValue = this.config.props[prop.name] || this.properties[prop.name]
        if (configValue != null && configValue !== '') {
          this.properties[prop.name] = this.composite.getBlobUrl(configValue, this.composite.packageName)
        }
      } else if (prop.type === 'slot') { // 处理插槽类型属性最终值
        delete this.properties[prop.name]
        // 算法如下：1、获取设置到属性上的值（LTS） 2、遍历子节点，获取命名和slot一致的节点 3、如无子节点按定义次序赋值
        const configValue = this.config.props[prop.name]
        if (configValue) { // LTS 直接将模板设置到属性上面
          const slotNode = this.composite.getNode(configValue)
          this.properties[prop.name] = this.getSlotPropValue(slotNode)
        } else if (Array.isArray(this.children)) {
          for (const childNode of this.children) { // 遍历子节点，获取命名和slot一致的节点
            if (childNode.config.title === prop.name) {
              this.properties[prop.name] = this.getSlotPropValue(childNode)
            }
          }
          if (this.properties[prop.name] == null) { // 最后：按定义次序赋值
            const slotNode = this.children[slotOrder]
            this.properties[prop.name] = this.getSlotPropValue(slotNode)
            slotOrder++
          }
        }
      } else if (prop.type === 'decorate') {
        // 修饰处理config
        const configValue = this.config.props[prop.name]
        if (configValue) {
          this.properties[prop.name] = this.composite.getNode(configValue)
        }
      } else if (prop.type === 'style') {
        // 暂时不处理properties 动态样式
        this.properties[prop.name] = handleClassListPropValue(this.config.props[prop.name], this.composite)
      }
    }
  }

  handleMouseOver (event) {
    forceDOMElementState(event.target, 'hover')
  }

  handleMouseOut (event) {
    forceDOMElementState(event.target, 'hover', true)
  }

  /**
   * 作为循环渲染时，复制列表项模板处理
   **/
  clone () {
    const cloned = new Element({
      composite: this.composite,
      componentDefinition: this.componentDefinition,
      config: this.config
    })

    if (this.children) {
      cloned.children = []
      for (const childNode of this.children) {
        const childNodeCloned = childNode.clone()
        childNodeCloned.parent = cloned
        cloned.children.push(childNodeCloned)
      }
    }
    cloned.isSlot = this.isSlot
    cloned.parent = this.parent
    return cloned
  }

  invoke (method, args) {
    if (this.renderer) {
      return this.renderer.invoke(method, args)
    }
  }

  hasMethod (methodName) {
    if (this.renderer) {
      return this.renderer.hasMethod(methodName)
    } else {
      return false
    }
  }

  unmount () {
    this.isMounted = false
    if (this.renderer) {
      this.renderer.destroy()
      this.renderer = null
      this.el = null
    }
  }
}

export default Element
