import { Composite } from 'ridgejs'
import EditorElement from './EditorElement.js'
import { parseStoreMeta, searchCodeWithComment, parseSourceWithComments } from './editorUtils.js'
import { nanoid } from '../utils/string'
import { cloneDeep, isPlainObject } from 'lodash'
import { hasUrlProtocol, removeUrlProtocol, cleanMultiSlash } from 'ridgejs/src/utils/string.js'
import { loadLocalJsModule } from 'ridgejs/src/utils/load.js'

/**
 * 编辑器下Composite，提供额外Element编辑和更新能力
 **/
class EditorComposite extends Composite {
  constructor (props) {
    super(props)
    this.appService = props.appService
    this.isEdit = true
    this.CLASS_LIST = ['viewport-container', 'is-edit']
  }

  async loadJSModule (jsPath) {
    if (hasUrlProtocol(jsPath)) {
      const jsPathInApp = removeUrlProtocol(jsPath)
      return loadLocalJsModule(jsPathInApp, {
        load: async path => {
          const file = this.appService.getFile(path)
          if (file) {
            return file.textContent
          }
          return ''
        }
      })
    } else {
      return super.loadJSModule(jsPath)
    }
  }

  createElement ({ config }) {
    return new EditorElement({
      config,
      composite: this
    })
  }

  createNewElement ({ path, meta, config }) {
    const div = document.createElement('div')
    // 从meta生成元素配置
    const elementConfig = {
      title: meta?.title || meta?.name || '未命名组件',
      path,
      id: nanoid(10),
      editor: {
        hidden: false,
        locked: false
      },
      style: {
        // 下列属性是
        visible: true,
        x: 0,
        y: 0,
        full: false,
        width: meta?.visualConfig?.preferredWidth || 240,
        height: meta?.visualConfig?.preferredHeight || 160
      },
      styleEx: {},
      propEx: {},
      events: {}
    }

    const element = new EditorElement({
      composite: this,
      config: elementConfig,
      componentMeta: meta
    })
    element.initPropsOnCreate()
    element.mount(div)
    this.appendChild(element)
    // 避免名称重复
    const existingNodes = this.getNodes()
    let nameLoop = 1
    let title = elementConfig.title

    while (existingNodes.find(n => n.config.title === title)) {
      title = elementConfig.title + '_' + nameLoop
      nameLoop++
    }
    element.config.title = title

    this.nodes[element.getId()] = element
    return element
  }

  getClassNames () {
    return this.classNames || []
  }

  /**
   * 更新页面配置，包括属性和事件
   * @param {*} config
   */
  updatePageConfig (config) {
    Object.assign(this.config, config)

    this.updateStyle()
    this.refresh()
  }

  /**
   * 更新Promote上的属性  编辑环境不更新promote
   * @override
   */
  updatePromotedElement () { }

  async refresh () {
    // await this.importStyleFiles()
    await this.importJSFiles()
    this.loadStore()
    this.importFontFiles()
  }

  /**
   * Load Composite Store
   * */
  async loadStore () {
    this.storeModules = []
    for (const jsModule of this.jsModules) {
      if (!jsModule.jsContent && jsModule.filePath) {
        jsModule.jsContent = await this.context.loadFileContent(jsModule.filePath)
      }
      const storeMeta = parseStoreMeta(jsModule)
      if (storeMeta.error) {
        globalThis.msgerror && globalThis.msgerror('模块引入异常 :' + jsModule.filePath)
      } else {
        this.storeModules.push(storeMeta)
      }
    }
  }

  updateStyle () {
    super.updateStyle()
    if (this.config.style) {
      const { width, height } = this.config.style

      this.el.style.width = width + 'px'
      this.el.style.height = height + 'px'
      this.el.style.overflowX = 'initial'
      this.el.style.overflowY = 'initial'
    }
  }

  getStoreModules () {
    return this.storeModules || []
  }

  /**
   * 从组件定义配置导入组件(用于编辑器复制、粘贴操作)。
   * 方法支持跨页面操作
   */
  async importNewElement (config) {
    const clonedConfig = cloneDeep(config)

    clonedConfig.id = nanoid(10)
    const newElement = this.createElement(clonedConfig)
    const div = document.createElement('div')
    await newElement.mount(div)
    // 还原children类型节点
    if (clonedConfig.props.children && clonedConfig.props.children.length) {
      const childrenNodes = clonedConfig.props.children
      for (let i = 0; i < childrenNodes.length; i++) {
        const childConfig = childrenNodes[i]
        const childElement = await this.importNewElement(childConfig)
        // clonedConfig.props.children[i] = childElement.config.id
        newElement.appendChild(childElement)
      }
    }
    this.nodes[clonedConfig.id] = newElement
    return newElement
  }

  async postMount () {
    for (const node of Object.values(this.nodes)) {
      await node.load()
    }
  }

  async mounted () {
    this.el.ondblclick = (e) => {
      const closestComposite = e.target.closest('.ridge-composite')
      if (!ridgeEditorContext.isPreviewMode() && closestComposite &&
        !closestComposite.classList.contains('viewport-container') && // 非根Composite
        closestComposite.hasAttribute('composite-id')) { // 有composite-id属性
        ridgeEditorContext.openFileByPath(closestComposite.getAttribute('composite-id'))
      }
    }
  }

  unmount () {
    super.unmount()
    this.el.style.width = 0
    this.el.style.height = 0
    this.el.classList.remove('is-edit')
  }

  appendChild (node) {
    node.isSlot = false
    if (this.children.indexOf(node) === -1) {
      this.children.push(node)
      this.config.children = this.children.map(n => n.getId())
      node.parent = this

      if (!node.el) {
        const el = document.createElement('div')
        this.el.appendChild(el)
        node.mount(el)
      } else {
        this.el.appendChild(node.el)
        node.forceUpdate()
      }
    }
  }

  removeChild (node, unmountSlot) {
    this.children = this.children.filter(n => n !== node)
    node.parent = null
    this.config.children = this.children.map(n => n.getId())
    this.el.removeChild(node.el)

    if (node.isSlot) {
      node.isSlot = false
      if (unmountSlot) {
        node.unmount()
      }
    } else {
      this.resetStyle(node.el)
    }
  }

  resetStyle (el) {
    el.style.position = 'inherit'
    el.classList.remove('ridge-is-full')
    el.style.transform = ''
    el.style.removeProperty('width')
    el.style.removeProperty('height')
  }

  deleteNode (node) {
    if (node) {
      const parent = node.getParent()
      if (parent) {
        parent.removeChild(node)
      }
      for (const childNode of node.children ?? []) {
        this.deleteNode(childNode)
      }
      node.unmount()
      if (node.componentDefinition && node.componentDefinition.type === 'store') {
        this.storeModules = this.storeModules.filter(m => m.name !== node.config.id)
      }
      delete this.nodes[node.getId()]
    }
  }

  /**
   * 子节点排序
   **/
  updateChildList (orders) {
    for (const childNode of this.children) {
      this.el.removeChild(childNode.el)
    }

    this.children = []
    for (let i = 0; i < orders.length; i++) {
      const childNode = this.getNode(orders[i])
      if (childNode && childNode.el) {
        this.appendChild(childNode)
      }
    }
  }

  childAppended (childNode) {
    childNode.updateStyle()
  }

  onEditorElementCreated (node) {
    if (node.componentDefinition && node.componentDefinition.type === 'store') {
      this.parseJsStoreModule(Object.assign(node.componentDefinition.component, {
        name: node.config.id,
        label: node.config.title
      }))
    }
  }

  /**
   * 获取当前Composite之下的组件树结构，包含以下结构 { key, label, value, children[] }
   * @returns
   */
  getCompositeElementTree () {
    return this.buildElementTree(this.children)
  }

  buildElementTree (elements) {
    const treeData = []
    for (const element of elements) {
      if (element) {
        treeData.push(this.getElementTree(element))
      }
    }
    return treeData
  }

  /**
   * 根据节点列表转换为树结构
   **/
  getElementTree (element) {
    const treeNodeObject = {
      key: element.getId(),
      value: element.getId(),
      label: element.config.title,
      element
    }
    // 布局型子节点(容器)
    if (element.children && element.children.length) {
      treeNodeObject.children = element.children.map(child => {
        return {
          ...this.getElementTree(child),
          parentKey: element.getId()
          // parent: treeNodeObject
        }
      })
      treeNodeObject.isLeaf = false
    } else {
      // 无子节点
      treeNodeObject.isLeaf = true
    }

    // update icon
    if (element.componentDefinition) {
      if (element.componentDefinition.icon) {
        if (element.componentDefinition.icon.$$typeof) {
          treeNodeObject.icon = element.componentDefinition.icon
        } else if (element.componentDefinition.icon.indexOf('.') > -1) {
          treeNodeObject.icon = <img className='item-icon' src={this.context.baseUrl + '/' + element.componentDefinition.packageName + '/' + element.componentDefinition.icon} />
        } else {
          treeNodeObject.icon = <i className={element.componentDefinition.icon} />
        }
      }
      for (const prop of element.componentDefinition.props || []) {
        if (prop.type === 'slot' && element.config.props[prop.name]) {
          if (!treeNodeObject.children) {
            treeNodeObject.children = []
          }
          const childNode = this.getNode(element.config.props[prop.name])
          treeNodeObject.children.push({
            ...this.getElementTree(childNode),
            parentKey: element.getId(),
            slotLabel: prop.label
            // parent: treeNodeObject
          })
          treeNodeObject.isLeaf = false
        }
      }
    }
    return treeNodeObject
  }

  emit (name, payload) { }

  /**
   * 导出页面JSON数据
   * @param {*} ignoreError 忽略元素错误
   * @returns
   */
  exportPageJSON (ignoreError = false) {
    const config = cloneDeep(this.config)
    config.elements = []

    for (const node of this.getNodes()) {
      try {
        const nodeJSONObject = node.exportJSON()
        config.elements.push(nodeJSONObject)
      } catch (e) {
        if (ignoreError) {
          console.error('node.exportJSON 失败：', node, e)
        } else {
          throw e
        }
      }
    }
    config.children = this.children.map(n => n.getId())
    return config
  }
}

export default EditorComposite
