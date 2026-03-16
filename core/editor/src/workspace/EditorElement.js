import { Element } from 'ridgejs'
import cloneDeep from 'lodash/cloneDeep.js'
import unset from 'lodash/unset.js'
import { nanoid } from '../utils/string'
import context from '../service/RidgeEditorContext.js'

/**
 * 编辑情况下的组件。 支持复制、更新、导出、创建等组件编辑动作
 */
export default class EditorElement extends Element {
  getProperties () {
    return Object.assign({
      __isEdit: true,
      __el: this.el,
      __composite: this.composite,
      width: this.style.width,
      height: this.style.height
    }, this.config.props, this.properties, {
      children: this.children
    })
  }

  // 更新设计期间样式，包括 锁定、隐藏
  updateEditStyle () {
    if (this.config.locked) {
      this.el.classList.add('ridge-is-locked')
    } else {
      this.el.classList.remove('ridge-is-locked')
    }

    if (this.config.visible) {
      this.el.classList.remove('ridge-is-hidden')
    } else {
      this.el.classList.add('ridge-is-hidden')
    }

    if (this.config.locked || !this.config.visible) {
      this.composite.context.workspaceControl.selectElements([])
    } else {
      this.composite.context.workspaceControl.selectElements([this.el])
    }
  }

  styleUpdated () {
    this.el.classList.add('ridge-editor-element')
    if (this.isContainer()) {
      this.el.classList.add('ridge-container')
    }
    if (this.isSlot) {
      this.el.classList.add('ridge-is-slot')
    } else {
      this.el.classList.remove('ridge-is-slot')
    }
  }

  isContainer () {
    return this.getPropDefinations().find(prop => prop.name === 'children' || prop.type === 'slot')
  }

  /**
   * 增加子节点， 将子节点增加到 children属性之中。
   * 另外提供checkNodeOrder、appendChild等组件方法调用，确认组件位置及实际放置子组件
   * @param {*} node 子节点
   * @param {*} param1
   * @param {*} rect 节点矩形位置
   */
  appendChild (node, { x, y } = {}, rect) {
    if (!this.children) {
      this.children = []
    }
    let order = -1

    // 根据调用组件方法来获取子节点位置。例如弹性容器等
    if (this.hasMethod('checkNodeOrder') && rect) {
      order = this.invoke('checkNodeOrder', [rect])
    }
    if (order > -1) {
      // 插入到中间位置
      this.children.splice(order, 0, node)
    } else {
      this.children.push(node)
    }
    node.parent = this
    this.invoke('appendChild', [node, { x, y }, order])
    node.forceUpdate()
    this.forceUpdate()
    this.config.props.children = this.children.map(childNode => childNode.getId())
  }

  /**
   * 移除子节点
   * @param {*} node
   * @param {*} unmount
   */
  removeChild (node) {
    if (!this.children) {
      this.children = []
    }
    this.children = this.children.filter(n => n !== node)
    this.config.props.children = this.children.map(childNode => childNode.getId())
    node.parent = null

    // const isSlotNode = node.isSlot

    // if (isSlotNode) {
    //   node.isSlot = false
    //   node.unmount()
    // }

    this.forceUpdate()

    // if (!isSlotNode) {
    // 布局型, 弹性容器等，不需要unmount，直接调用容器提供的removeChild进行div摘取，使得界面有连续拖拽操作的效果
    // 先拖拽到顶级的位置
    const { workspaceControl } = context
    const rectConfig = workspaceControl.getElementRectConfig(node.el)
    this.invoke('removeChild', [node])
    node.setStyleConfig(rectConfig)
    // }
  }

  /**
   * 初始化时配置默认值
   **/
  initPropsOnCreate () {
    for (const prop of this.getPropDefinations().filter(n => n && n.name)) {
      if (prop.value !== undefined && this.config.props[prop.name] === undefined) {
        this.config.props[prop.name] = prop.value
      }

      if (prop.name === 'children') { // 包含子节点属性
        this.config.props.children = []
        this.children = []
      }

      if (prop.type === 'slot') { // 包含slot视作子节点
        this.config.props.children = []
        this.children = []
      }
    }
  }

  /**
   * 设置插槽状态
   * @param {*} slot
   */
  setSlot (slot) {
    this.config.slot = slot
    if (slot) {
      this.el.classList.add('ridge-is-slot')
    } else {
      this.el.classList.remove('ridge-is-slot')
    }
  }

  // 设置编辑期间可见状态
  setVisible (visible) {
    this.config.visible = visible
    this.updateEditStyle()
  }

  /**
   * 设置锁定状态
   * @param {*} locked
   */
  setLocked (locked) {
    this.config.locked = locked
    this.updateEditStyle()
  }

  // 更新
  updateStyleConfig (style) {
    Object.assign(this.config.style, style)

    this.style = this.config.style
    // 更新位置配置时，同时也调用
    this.updateStyle()

    // editorStore().updateElementConfig()
  }

  setStyleConfig (style) {
    this.config.style = style
    this.style = this.config.style
    this.updateStyle()
  }

  updateChildConfig (childNodes) {
    this.config.props.children = childNodes.map(node => node.getId())
    this.properties.children = childNodes
    this.updateProps()
  }

  /**
   * 处理更新slot节点的情况。
   * 更新插槽时,需要将新插槽节点重新mount的目标容器内、或者从目标容器unmount回到根部
   */
  checkUpdateSlotElement (fieldToUpdate) {
    if (fieldToUpdate == null || Object.keys(fieldToUpdate).length !== 1) return false

    const key = Object.keys(fieldToUpdate)[0]
    const [type, name] = key.split('.')
    const value = fieldToUpdate[key]

    if (type !== 'props') return false

    // 如果有slot变更，那么返回true 提示后续更新组件树
    const result = {}

    this.componentDefinition.props.forEach(prop => {
      if (prop.type === 'slot' && name === prop.name) {
        if (this.config.props[prop.name] != null && this.config.props[prop.name] !== value) {
          result.removed = this.config.props[prop.name]
        }
        if (value) {
          const targetNode = this.composite.getNode(value)
          if (targetNode) {
            this.composite.removeChild(targetNode)
            targetNode.setSlot(true)
            result.added = value
          }
        }
      }
    })
    return result
  }

  /**
   * 更新组件配置
   * @param {*} config 全量配置
   * @param {*} fieldToUpdate 更新字段
   */
  updateConfig (config, fieldToUpdate) {
    // 检查slot属性
    const scopeChanged = this.checkUpdateSlotElement(fieldToUpdate)
    // 合并属性
    Object.assign(this.config, config)

    // 按更新内容单独配置
    for (const propKeyPath in fieldToUpdate) {
      if (fieldToUpdate[propKeyPath] === undefined) {
        unset(this.config, propKeyPath)
      }
    }

    // 更新配置属性到运行
    this.properties = cloneDeep(this.config.props)
    this.style = cloneDeep(this.config.style)
    // this.updateSystemProperties()
    this.updateStyle()
    this.updateProps()

    // 组件已经更新后，slot组件已经被unmount，这时将其补充到composite下并重新mount
    if (scopeChanged.removed) {
      setTimeout(() => {
        const originalSlotNode = this.composite.getNode(scopeChanged.removed)
        if (originalSlotNode) {
          // 旧节点放归到根级别
          this.composite.appendChild(originalSlotNode)
          originalSlotNode.setSlot(false)
        }
      }, 100)
    }
    return scopeChanged
  }

  childRemoved (node) {
    this.invoke('removeChild', [node])
  }

  /**
   * 当作为非自由状态时（目前是作为slot时），是否允许进行resize
   * @returns
   */
  isResizable () {
    if (this.config.slot && this.parent) {
      // 调用父根据属性定义进行判断
      return this.parent.isSlotChildResizable(this.config.id)
    } else {
      return true
    }
  }

  getPropDefinations () {
    if (this.componentDefinition && this.componentDefinition.props && Array.isArray(this.componentDefinition.props)) {
      return this.componentDefinition.props
    } else {
      return []
    }
  }

  /**
   * 获取单个属性方法定义
   * @param {*} name
   */
  getPropDefination (name) {
    if (this.componentDefinition && this.componentDefinition.props) {
      return this.componentDefinition.props.filter(p => p.name === name)[0]
    } else {
      return null
    }
  }

  /**
   * 更新子节点列表，子节点是有次序的
   * @param {Array} orders  按序列表
   */
  updateChildList (orders) {
    this.children = orders.map(id => this.composite.getNode(id)).filter(t => t)
    this.invoke('updateChildList', [this.children])
  }

  /**
   * 选中元素事件
   */
  selected () {
    this.invoke('selected')

    let current = this
    let parent = current.parent

    while (parent) {
      parent.invoke('childSelected', [current])
      current = parent
      parent = current.parent
    }
  }

  /**
   * 编辑期间复制
   **/
  clone () {
    const clonedConfig = cloneDeep(this.config)
    clonedConfig.id = nanoid(5)
    const cloned = new EditorElement({
      composite: this.composite,
      componentDefinition: this.componentDefinition,
      config: clonedConfig
    })

    if (this.children) {
      cloned.children = []
      for (const childNode of this.children) {
        const childNodeCloned = childNode.clone()
        childNodeCloned.parent = cloned
        cloned.children.push(childNodeCloned)
        this.composite.nodes[childNodeCloned.getId()] = childNodeCloned
      }
    }

    this.composite.nodes[cloned.getId()] = cloned
    return cloned
  }

  isSlotChildResizable (id) {
    if (this.componentDefinition && this.componentDefinition.props) {
      for (const prop of this.componentDefinition.props) {
        if (prop.type === 'slot' && this.config.props[prop.name] === id) {
          return prop.resizable
        }
      }
    }
    return false
  }

  getSlotElements () {
    const slots = []
    this.getPropDefinations().forEach(prop => {
      if (prop.type === 'slot' && this.config.props[prop.name]) {
        slots.push(this.config.props[prop.name])
      }
    })
    return slots
  }

  // 是否可被放入子元素
  isDroppable () {
    const slotLength = this.getPropDefinations().filter(prop => prop.type === 'slot').length
    const childrenLength = this.getPropDefinations().filter(prop => prop.type === 'children').length ? 10001 : 0
    const acceptChildrenLength = slotLength + childrenLength

    const currentLenth = this.children ? this.children.length : 0

    if (currentLenth < acceptChildrenLength) {
      return true
    } else {
      return false
    }
  }

  canDroppedOnElement () {
    return this.componentDefinition.portalled !== true
  }

  exportJSON () {
    if (this.componentDefinition) {
      // this.config.$id = ELEMENT_SCHEMA_URL
      if (this.children) {
        this.config.props.children = this.children.filter(cn => cn.parent === this).map(childNode => childNode.getId())
        this.config.props.children = Array.from(new Set(this.config.props.children))
      }
      this.config.slots = this.getSlotElements()

      // portalled 表示组件会渲染的body根上面
      if (this.componentDefinition.portalled) {
        this.config.style.portalled = true
      }
    }
    return JSON.parse(JSON.stringify(this.config))
  }

  /**
   * 导出所有节点（包含模板）后续用于复制
   * @returns
   */
  exportJSONTree () {
    const configCloned = cloneDeep(this.config)
    if (this.children) {
      configCloned.props.children = this.children.filter(cn => cn.parent === this).map(cn => cn.exportJSONTree())
    }
    this.componentDefinition.props && this.componentDefinition.props.forEach(prop => {
      if (prop.type === 'slot' && this.config.props[prop.name]) {
        configCloned.props[prop.name] = this.composite.getNode(this.config.props[prop.name]).exportJSONTree()
      }
    })
    // configCloned.$id = ELEMENT_SCHEMA_URL
    return configCloned
  }
}
