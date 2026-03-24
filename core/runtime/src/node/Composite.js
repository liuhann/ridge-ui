import ValtioStore from '../store/ValtioStore'
import Element from './Element'
import BaseNode from './BaseNode'

import { STORE, PROP } from '../utils/contants.js'
import { cloneDeep } from '../utils/object.js'
import Debug from 'debug'
import { generateUrlFontName, toCSSLength, addJsonSuffix, hasUrlProtocol, removeUrlProtocol, cleanMultiSlash } from '../utils/string'
import { loadRemoteJsModule } from '../utils/load.js'
const debug = Debug('ridge:composite')

/**
 * 包含多个元素的组合型元素
 **/
class Composite extends BaseNode {
  constructor ({
    id,
    appName,
    path,
    properties,
    config,
    loader
  }) {
    super()
    this.id = id
    this.path = path
    this.loader = loader
    this.appName = appName
    this.config = config
    this.properties = properties || this.comfig?.properties || {}
    this.CLASS_LIST = ['ridge-composite']
    this.dataReady = true // 数据层加载完成
  }

  // 加载页面配置  运行时调用
  async loadConfig () {
    this.config = cloneDeep(await this.loader.loadJSON(addJsonSuffix(`${this.appName}/${this.path}`)))

    if (this.config == null || !this.config.elements) {
      this.config = null
    }
  }

  // 首屏渲染，决定绘制时即计算，前提：必须加载页面配置文件， 尽最大可能绘制所有可用内容
  firstPaint (el) {
    debug('Page FirstPaint', el, this.appName, this.path)
    this.firstPainted = false
    if (el) {
      this.el = el
    }
    // 存储之前的类列表
    this.initialClassList = Array.from(this.el.classList)
    this.updateStyle()
    this.initializeNodes()
    // 检测是否位于循环之中，避免上层组件已经是自身
    if (this.el.closest('[composite-id="' + this.getCompositeId() + '"]') !== this.el) {
      this.setStatus('Circular')
    }

    this.children = []
    for (const nodeId of this.config.children ?? []) {
      const element = this.getNode(nodeId)
      if (element) {
        const div = document.createElement('div')
        this.el.appendChild(div)
        element.parent = this
        this.children.push(element)
        element.firstPaint(div)
        //  this.childrenPromises.push(element.mount(div))
      }
    }
    this.firstPainted = true
  }

  // 根据配置初始化所有节点对象、绘制根节点
  initializeNodes () {
    this.nodes = {}
    // 创建每个组件实例
    for (let i = 0; i < this.config.elements.length; i++) {
      const node = this.createElement(this.config.elements[i])
      this.nodes[node.getId()] = node
    }
    this.initChildren()
    this.events = {}
  }

  /**
   * 根据页面配置读取页面控制对象结构
   * @param {Element} el DOM 根元素
   */
  async initialize () {
    if (!this.config) {
      await this.loadConfig()
    }

    if (!this.config) {
      return false
    } else {
      return true
    }
  }

  // 预加载所有组件
  async loadChildren () {
    const promises = []
    if (!this.config) {
      this.config = await this.context.loadComposite(this.packageName, this.compositePath)
    }
    for (const node of Object.values(this.nodes)) {
      promises.push(await node.load())
    }
    await Promise.allSettled(promises)
  }

  getCompositeId () {
    return this.id || `${this.packageName ?? ''}${this.compositePath}`
  }

  getNodes (filter) {
    const nodes = Object.values(this.nodes)
    if (filter) {
      return nodes.filter(filter)
    } else {
      return nodes
    }
  }

  getNode (id) {
    return this.nodes[id]
  }

  getRootNode (id) {
    return this.children.filter(childNode => childNode.id === id)[0]
  }

  getBlobUrl (url) {
    return this.context.getBlobUrl(url, this.packageName)
  }

  initChildren () {
    if (!this.config.children) {
      this.children = Object.values(this.nodes).filter(n => n.config.parent == null)
    } else {
      this.children = Array.from(new Set(this.config.children)).map(id => this.nodes[id]).filter(n => n)
    }

    for (const childNode of this.children) {
      childNode.parent = this
      childNode.initChildren()
    }
  }

  createElement (config) {
    return new Element({
      composite: this,
      config
    })
  }

  getJsModules () {
    return this.jsModules || []
  }

  // 挂载
  async mount (el, themeRoot) {
    debug('Composite Mount: ', this.appName, this.path)
    try {
      this.beforeMount && this.beforeMount(el)
    } catch (e) { }
    if (el) {
      this.el = el
      if (el.ridgeComposite) {
        el.ridgeComposite.unmount()
      }
      this.el.ridgeComposite = this
    }
    this.removeStatus()
    // debug(this.packageName, this.compositePath, 'mounting')

    if (!this.config) {
      debug('Loading Config', this.appName, this.path)
      this.setStatus('Loading')
      await this.loadConfig()
    }
    this.removeStatus('Loading')

    if (!this.config) {
      this.setStatus('Notfound')
      debug('Config Not Found', this.appName, this.path)
      this.onPageNotFound && this.onPageNotFound(this)
      return
    }
    if (!this.firstPainted) {
      this.firstPaint()
    }

    await this.importJSFiles()
    await this.loadStore()
    this.updatePromotedElement()

    this.dataReady = true
    debug('JS Imported: ', this.packageName, this.compositePath)
    // 挂载前事件
    this.emit('postMount')
    this.postMount && await this.postMount()
    // 挂载根节点
    debug('Mount Root Elements: ', this.packageName, this.compositePath)

    const promises = []
    for (const element of this.children ?? []) {
      promises.push(element.mount())
    }
    await Promise.allSettled(promises)

    debug('Mounted Roots ', this.packageName, this.compositePath)
    this.initializeEvents()
    this.emit('mounted')
    this.mounted && this.mounted()

    this.importFontFiles()
  }

  /**
   * 渲染所有根节点。抽取出方法的主要目的是 slot节点要放置到根上， 对于运行期间 slot节点要做特殊处理，不挂载到根上，而编辑期间则无此限制
   */
  async mountRootComponents () {

  }

  // 卸载
  unmount () {
    this.el.className = this.initialClassList.join(' ')

    this.el.removeAttribute('composite-id')
    // this.el.setAttribute('composite-id', this.getCompositeId())
    if (this.config) {
      for (const childNode of this.children) {
        const el = childNode.el
        try {
          childNode.unmount()
        } catch (e) {
          //
        }
        if (el && el.parentElement === this.el) {
          this.el.removeChild(el)
        }
      }
      this.store && this.store.destory()
    }

    this.el.removeEventListener('mouseover', this.handleMouseOver)
    this.el.removeEventListener('mouseout', this.handleMouseOut)
  }

  // 更新自身样式
  updateStyle () {
    this.el.setAttribute('composite-id', this.getCompositeId())
    if (this.config && this.config.style && this.el) {
      this.el.style.background = ''
      if (this.config.style.widthFix) {
        // 固定宽度则配置溢出隐藏
        this.el.style.width = this.config.style.width + 'px'
        this.el.style.overflowX = 'hidden'
      } else {
        this.el.style.width = '100%'
      }
      if (this.config.style.heightFix) {
        this.el.style.height = this.config.style.height + 'px'
        this.el.style.overflowY = 'hidden'
      } else {
        this.el.style.height = '100%'
      }

      // const classList = handleClassListPropValue(this.config.classList, this)

      this.el.className = ['ridge-composite', ...this.CLASS_LIST].join(' ')
    }
  }

  // 更新子节点位置样式
  updateChildStyle (childNode) {
    if (childNode.el) {
      if (childNode.config.full) {
        childNode.el.classList.add('ridge-is-full')
        childNode.el.style.transform = 'none'
        childNode.el.style.width = ''
        childNode.el.style.height = ''
      } else {
        const style = childNode.style
        childNode.el.classList.remove('ridge-is-full')
        childNode.el.style.position = 'absolute'
        childNode.el.style.left = 0
        childNode.el.style.top = 0
        childNode.el.style.transform = `translate(${style.x}px, ${style.y}px)`

        childNode.el.style.width = style.width ? toCSSLength(style.width) : ''
        childNode.el.style.height = style.height ? toCSSLength(style.height) : ''
        if (style.portalled && !this.isEdit) {
          childNode.el.style.width = 0
          childNode.el.style.height = 0
        }
      }
    }
  }

  getScopedData () {
    return []
  }

  async loadJSModule (jsPath) {
    if (hasUrlProtocol(jsPath)) {
      const jsPathInApp = removeUrlProtocol(jsPath)
      return loadRemoteJsModule(cleanMultiSlash(`${this.appName}/${jsPathInApp}`))
    } else {
      return loadRemoteJsModule(jsPath)
    }
  }

  // 导入页面脚本文件
  async importJSFiles () {
    const { jsFiles } = this.config
    debug('Load importJSFiles', this.appName, this.path, jsFiles)
    const jsModules = []
    for (const filePath of jsFiles ?? []) {
      try {
        const JsModule = await this.loadJSModule(filePath)
        if (JsModule) {
          const JSStoreModule = JsModule
          JSStoreModule.filePath = filePath
          if (JsModule.jsContent) {
            JSStoreModule.jsContent = JsModule.jsContent
          }
          // JsModule.filePath = filePath
          jsModules.push(JSStoreModule)
        }
      } catch (e) {
        console.error('JS Module Load Fail: ', this.packageName + '/' + filePath)
      }
    }
    this.jsModules = jsModules
  }

  // 导入页面字体
  importFontFiles () {
    const { fontFiles } = this.config
    this.fontList = []
    if (fontFiles) {
      for (const fileFileUrl of fontFiles) {
        debug('loadWebFont', fileFileUrl)
        this.fontList.push({
          label: fileFileUrl.split('/').pop(),
          value: generateUrlFontName(fileFileUrl)
        })
        this.loader.loadWebFont(fileFileUrl)
      }
    }
  }

  initializeEvents () {
    this.el.onclick = event => {
      if (event.target === this.el) {
        this.emit('onClick', [event])
      }
    }

    // this.el.addEventListener('mouseover', this.handleMouseOver)
    // this.el.addEventListener('mouseout', this.handleMouseOut)
  }

  handleMouseOver (event) {
    this.currentHoverTarget = event.target

    window.requestAnimationFrame(() => {
      this.setHoveredElementClassList()
    })

    if (event.target.contains(event.relatedTarget)) {
      return
    }

    const classList = event.target.classList
    for (let i = 0; i < classList.length; i++) {
      if (classList[i].startsWith('hover:')) {
        const content = classList[i].substring(6) // 提取 hover: 后面的内容
        event.target.classList.add(content)
        // console.log('classList Add', content)
      }
    }
  }

  setHoveredElementClassList (currentHoverElement) {
    for (const el of this._hoveredElements) {
      this.setHoveredClassList(el, true)
    }
  }

  // 设置上浮类，返回是否设置成功
  setHoveredClassList (el, isRemove) {
    const classList = el.classList
    let isHoverable = false
    for (let i = 0; i < classList.length; i++) {
      if (classList[i].startsWith('hover:')) {
        isHoverable = true
        const content = classList[i].substring(6) // 提取 hover: 后面的内容
        if (isRemove) {
          el.classList.remove(content)
        } else {
          el.classList.add(content)
        }
      }
    }
    return isHoverable
  }

  /**
   * 处理定义在Composite上的事件配置
   * @param {*} name
   * @param {*} payload
   */
  handleInternalEventConfig (name, payload) {
    if (this.config.events && this.config.events[name]) {
      for (const action of this.config.events[name]) {
        if (action.store && action.method) {
          this.store.doStoreAction(action.store, action.method, {
            payload,
            eventArgs: action.payload
          })
        }
      }
    }
  }

  /**
   * 增加外部监听事件
   * @param {*} name
   * @param {*} callback
   */
  on (name, callback) {
    this.events[name] = callback
  }

  /**
   * 事件触发入口
   * @param {*} name
   * @param {*} payload
   */
  emit (name, payload) {
    // 先调用内部循环处理
    this.handleInternalEventConfig(name, payload)
    // 然后发到外部
    if (this.events[name]) {
      this.events[name](payload ?? [])
    }

    if (this.properties[name] && typeof this.properties[name] === 'function') {
      this.properties[name].call(null, payload)
    }
  }

  /**
   * 更新属性：
   * 1、 触发子的所有JS Store更新
   * 2、 更新所有子节点有Promote属性的情况
   **/
  setProperties (props) {
    this.properties = props

    this.store && this.store.setProperties(this.properties)
    this.updatePromotedElement()
  }

  // 处理绑定到Composite属性的节点
  updatePromotedElement () {
    // 获取Promote的属性
    if (this.nodes) {
      for (const node of Object.values(this.nodes)) {
        for (const [key, value] of Object.entries(node.config.propEx || {})) {
          if (typeof value === 'string' && value.startsWith(STORE + '.' + PROP)) {
            const [store, prop, label] = value.split('.')
            if (this.properties[label]) {
              // TODO promote set to config.prop

              // 这个写法是因为有时类名的再计算
              node.config.props[key] = this.properties[label]

              // node.properties[key] = this.properties[label]
              node.forceUpdateProperty()
            }
          }
        }
      }
    }
  }

  /**
   * 加载页面状态库
   * */
  async loadStore () {
    debug('Load loadStore', this.appName, this.path, this.jsModules, this.properties)
    // 加载页面引入的storejs
    this.store = new ValtioStore(this)
    try {
      this.store.load(this.jsModules, this.properties)
    } catch (e) {
      console.error('Store Load Fail: ', e)
    }

    // 状态库类型节点 弃用
    /*
    const storeNodes = this.getNodes().filter(node => node.config.store)
    for (const storeNode of storeNodes) {
      await storeNode.load()
      this.store.load([Object.assign({}, storeNode.componentDefinition.component, {
        name: storeNode.config.id
      })], storeNode.getProperties())
    }
    */
  }

  async loadScript (url) {
    await this.loader.loadScript(url)
  }
}

export default Composite
