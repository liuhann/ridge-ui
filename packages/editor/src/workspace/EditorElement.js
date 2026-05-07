import { Element } from 'ridgejs'
import cloneDeep from 'lodash/cloneDeep.js'
import isEqual from 'lodash/isEqual.js'

import { nanoid } from '../utils/string'
import componentRegistry from '../service/ComponentRegistry'
import merge from 'lodash/merge'
import { getIconUrl } from '../panels/component/componentUtils'

const defaultConfig = {
  editor: { hidden: false, locked: false },
  styleEx: {},
  propEx: {},
  events: {},
  props: {},
  visible: true,
  slots: [],
  meta: { sync: [], url: [] }
}

export default class EditorElement extends Element {
  constructor ({ config, composite, componentMeta }) {
    // 在构造函数中接收 componentMeta
    super({ config, composite })
    if (componentMeta) {
      this.setComponentMeta(componentMeta)
    }
  }

  // ========================================================================
  // 设置组件元数据
  // ========================================================================
  setComponentMeta (componentMeta) {
    this.componentMeta = componentMeta
    // 元数据设置后，立即初始化属性元信息
    this.initPropertyMetadata()

    this.initPropsOnCreate()
  }

  // 获取组件元数据
  getComponentMeta () {
    return this.componentMeta || {}
  }

  // 检查是否已加载组件元数据
  isMetaLoaded () {
    return !!this.componentMeta
  }

  // ========================================================================
  // 编辑态属性
  // ========================================================================
  getProperties () {
    return {
      ...super.getProperties(),
      __isEdit: true,
      __el: this.el,
      __composite: this.composite
    }
  }

  updateConfig (config) {
    merge(this.config, config)
    this.style = { ...this.config.style }
    this.updateProps()
    this.updateStyle()
  }

  styleUpdated () {
    if (!this.el) return

    this.el.classList.add('ridge-editor-element')
    if (this.getLocked()) {
      this.el.classList.add('ridge-is-locked')
    } else {
      this.el.classList.remove('ridge-is-locked')
    }

    if (this.getHidden()) {
      this.el.classList.add('ridge-is-hidden')
    } else {
      this.el.classList.remove('ridge-is-hidden')
    }
    if (this.isContainer()) this.el.classList.add('ridge-container')
  }

  isContainer () {
    return this.getPropDefinations().some(p =>
      p.name === 'children' && p.type === 'children'
    )
  }

  // 对于像对话框、侧边弹窗等组件，全局运行的
  canDroppedOnElement () {
    return this.componentMeta?.portalled !== true
  }

  getPropDefinations () {
    return this.componentMeta?.properties || []
  }

  getPropDefination (name) {
    return this.getPropDefinations().find(p => p.name === name) || null
  }

  appendChild (node, { x, y } = {}, rect) {
    this.children ||= []
    let order = -1

    if (this.hasMethod('checkNodeOrder') && rect) {
      order = this.invoke('checkNodeOrder', [rect]) ?? -1
    }

    if (order >= 0) {
      this.children.splice(order, 0, node)
    } else {
      this.children.push(node)
    }

    node.parent = this
    this.invoke('appendChild', [node, { x, y }, order])
    node.forceUpdate()
    this.forceUpdate()

    this.config.props.children = this.children.map(c => c.getId())
  }

  removeChild (node) {
    this.children ||= []
    this.children = this.children.filter(c => c !== node)
    this.config.props.children = this.children.map(c => c.getId())
    node.parent = null

    this.invoke('removeChild', [node])
    this.forceUpdate()
  }

  // ========================================================================
  // 创建时初始化
  // ========================================================================
  initPropsOnCreate () {
    for (const prop of this.getPropDefinations()) {
      if (!prop.name) continue
      if (prop.defaultValue !== undefined && this.config.props[prop.name] === undefined) {
        this.config.props[prop.name] = prop.defaultValue
      }
      if (prop.name === 'children' && prop.type === 'children') {
        this.config.props.children ||= []
        this.children ||= []
      }
    }
  }

  // ========================================================================
  // 插槽
  // ========================================================================
  setSlot (slot) {
    this.config.slot = !!slot
    this.el?.classList.toggle('ridge-is-slot', this.config.slot)
  }

  getSlotElements () {
    return this.getPropDefinations()
      .filter(p => p.type === 'slot' && this.config.props[p.name])
      .map(p => this.config.props[p.name])
  }

  isSlotChildResizable (id) {
    for (const p of this.getPropDefinations()) {
      if (p.type === 'slot' && this.config.props[p.name] === id) {
        return p.resizable !== false
      }
    }
    return false
  }

  isResizable () {
    if (this.config.slot && this.parent) {
      return this.parent.isSlotChildResizable(this.config.id)
    }
    return true
  }

  updateChildConfig (children) {
    this.config.props.children = children.map(c => c.getId())
    this.properties.children = children
    this.updateProps()
  }

  getIcon () {
    return <img className='outline-element-icon' src={getIconUrl(this.getComponentMeta()?.icon)} />
  }

  async loadMeta () {
    if (!this.componentMeta) {
      try {
        const componentMeta = await componentRegistry.getComponentMeta(`${this.config.path}`)
        if (componentMeta) {
          this.componentMeta = componentMeta
          // 元数据加载成功后，初始化属性元信息
          this.initPropertyMetadata()
        }
      } catch (e) {}
    }
  }

  // ========================================================================
  // 初始化属性元信息（仅在 meta 加载/设置时调用一次）
  // ========================================================================
  initPropertyMetadata () {
    if (!this.componentMeta) return

    const propsDef = this.componentMeta.properties || []
    const eventsDef = this.componentMeta.events || []

    // 1. 收集【支持双向绑定】的属性：
    //    规则：prop.input === true 且存在 prop.inputEvent
    //    兼容旧规则：value + onChange
    const syncProps = []

    // 新规则：支持配置 input: true + inputEvent: "onChange" 的属性
    propsDef.forEach(prop => {
      if (prop.input === true && prop.inputEvent) {
        syncProps.push(prop.name, prop.inputEvent)
      }
    })

    // 旧规则（兼容）：properties 包含 value 并且 events 包含 onChange
    const hasValueProp = propsDef.some(p => p.name === 'value')
    const hasOnChangeEvent = eventsDef.some(e => e.name === 'onChange' || e.name === 'on-change')
    if (hasValueProp && hasOnChangeEvent && !syncProps.length) {
      syncProps.push('value', 'onChange')
    }

    // 2. 收集资源属性列表（不动你原有逻辑）
    const urlProps = []
    const resourceTypes = ['image', 'file', 'url', 'video', 'audio']

    propsDef.forEach(prop => {
      if (resourceTypes.includes(prop.type)) {
        urlProps.push(prop.name)
      }
    })

    // 保存简化后的 meta 结构
    this.config.meta = {
      sync: syncProps,
      url: urlProps
    }
  }

  // ========================================================================
  // 克隆（编辑复制）
  // ========================================================================
  clone () {
    const cfg = cloneDeep(this.config)
    cfg.id = nanoid(5)

    const cloned = new EditorElement({
      composite: this.composite,
      componentMeta: this.componentMeta, // 传递 componentMeta
      config: cfg
    })

    // 注意：clone 时不异步加载，componentMeta 已经传递

    if (this.children) {
      cloned.children = this.children.map(child => {
        const c = child.clone()
        c.parent = cloned
        this.composite.nodes[c.getId()] = c
        return c
      })
    }

    this.composite.nodes[cloned.getId()] = cloned
    return cloned
  }

  getLocked () {
    return this.config?.editor?.locked
  }

  setLocked (locked) {
    if (!this.config.editor) {
      this.config.editor = {}
    }
    this.config.editor.locked = locked
    this.styleUpdated()
  }

  getHidden () {
    return this.config?.editor?.hidden
  }

  setHidden (hidden) {
    if (!this.config.editor) {
      this.config.editor = {}
    }
    this.config.editor.hidden = hidden
    this.styleUpdated()
  }

  /**
   * 导出当前元素的 JSON 配置数据
   * @returns {Object} 包含元素配置、URL 属性标记及插槽信息的 JSON 对象
   */
  exportJSON () {
    const json = cloneDeep(this.config)

    // ==========================
    // 🔥 核心：移除默认值属性（不导出）
    // ==========================
    const propsDef = this.getPropDefinations()
    if (json.props) {
      for (const prop of propsDef) {
        const propName = prop.name
        const defaultValue = prop.defaultValue

        // 如果配置里的值 === 默认值 → 删除，不导出
        if (propName !== undefined && propName !== 'children' && defaultValue !== undefined && json.props[propName] === defaultValue && prop.required !== true) {
          delete json.props[propName]
        }
      }
    }

    // 清理编辑器默认值
    for (const key in defaultConfig) {
      if (isEqual(json[key], defaultConfig[key])) {
        delete json[key]
      }
    }

    // 子节点是组件
    if (this.getPropDefination('children')?.type === 'children') {
      json.props.children = this.children?.map(c => c.getId()) || []
    }
    // deprecated
    json.slots = this.getSlotElements()
    if (this.componentMeta?.portalled) {
      json.style.portalled = true
    }
    return json
  }

  exportJSONTree () {
    const tree = cloneDeep(this.config)
    tree.props.children = this.children?.map(c => c.exportJSONTree()) || []

    for (const p of this.getPropDefinations()) {
      if (p.type === 'slot' && this.config.props[p.name]) {
        const node = this.composite.getNode(this.config.props[p.name])
        tree.props[p.name] = node?.exportJSONTree()
      }
    }
    return tree
  }
}
