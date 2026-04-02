import Selecto from 'selecto'
import { createMoveable } from './moveable'
import Mousetrap from 'mousetrap'
import DragStore from './DragStore'

// import html2canvas from 'html2canvas'

import EditorComposite from './EditorComposite.js'
import debug from 'debug'
import { fitRectIntoBounds } from '../utils/rectUtils'
import { loader } from 'ridgejs'

import {
  isElementMovable,
  isElementSelectable,
  isElementResizable,
  getElementRectConfig,
  onDragOver,
  onDragOut,
  screenToViewport,
  getElementCenter
} from './workspaceUtils.js'

export const RIDGE_ELEMENT = '.ridge-editor-element'
const trace = debug('ridge:workspace')

/**
 * 控制工作区组件的Drag/Resize/New等动作
 * 控制编辑器的工作区缩放/平移
 */
export default class WorkSpaceControl {
  init ({
    workspaceEl,
    viewPortEl,
    editorStore
  }) {
    this.workspaceEl = workspaceEl
    this.viewPortEl = viewPortEl
    this.editorStore = editorStore
    this.zoom = 1
    this.selectorDropableTarget = ['.ridge-container', '.ridge-droppable']

    this.initKeyBind()
    this.initComponentDrop()
    this.viewPortX = 0
    this.viewPortY = 0

    this.dragActive = true
    this.selected = []
    this.viewPortEl.style.transformOrigin = 'top left'
    this.currentComposite = null
  }

  enable () {
    this.initSelecto()
    this.initMoveable()
    this.setWorkSpaceMovable()
    this.enabled = true
  }

  setDragActive (dragActive) {
    this.dragActive = dragActive
  }

  disable () {
    if (this.enabled) {
      this.currentComposite = null
      this.selecto.destroy()
      this.selecto = null
      this.moveable.destroy()
      this.moveable = null
      if (this.workspaceMovable) {
        this.workspaceMovable.destroy()
        this.workspaceMovable = null
      }
      this.viewPortEl.style.transform = ''
      this.enabled = false
    }
  }

  updateMovable () {
    this.moveable.updateRect()
  }

  fitByWidth () {
    const wsbc = this.workspaceEl.getBoundingClientRect()
    const vpbc = this.viewPortEl.getBoundingClientRect()

    this.viewPortX = 292
    this.viewPortY = 7

    // 排除掉左右面板可得到宽度
    const availableWidth = wsbc.width - 300 - 314
    if (vpbc.width < availableWidth) {
      this.zoom = 1
    } else if (vpbc.width < availableWidth * 2) {
      this.zoom = Math.floor(availableWidth / vpbc.width * 100) / 100
    } else {
      this.zoom = 0.5
    }
    this.viewPortEl.style.transform = `translate(${this.viewPortX}px, ${this.viewPortY}px) scale(${this.zoom})`
    return this.zoom
  }

  fitToCenter (padding = 40) {
    this.viewPortEl.style.transform = ''
    const wsbc = this.workspaceEl.getBoundingClientRect()
    const vpbc = this.viewPortEl.getBoundingClientRect()
    this.zoom = 1

    const fitted = fitRectIntoBounds({
      width: vpbc.width,
      height: vpbc.height
    }, {
      width: wsbc.width - padding * 2,
      height: wsbc.height - padding * 2
    })

    if (fitted.width !== vpbc.width) {
      this.viewPortX = 0
      this.viewPortY = 0
      return this.zoom
      // this.zoom = fitted.width / vpbc.width
    }

    this.viewPortX = (wsbc.width - fitted.width) / 2
    this.viewPortY = (wsbc.height - fitted.height) / 2

    this.viewPortEl.style.transform = `translate(${this.viewPortX}px, ${this.viewPortY}px) scale(${this.zoom})`

    return this.zoom
  }

  setZoom (zoom) {
    this.zoom = zoom

    if (this.moveable) {
      this.moveable.target = []
      this.moveable.updateTarget()
    }

    this.viewPortEl.style.transform = `translate(${this.viewPortX}px, ${this.viewPortY}px) scale(${this.zoom})`
  }

  getTransform () {
    return {
      viewPortX: this.viewPortX,
      viewPortY: this.viewPortY,
      zoom: this.zoom
    }
  }

  setTransform ({ viewPortX = 0, viewPortY = 0, zoom = 1 }) {
    this.viewPortX = viewPortX
    this.viewPortY = viewPortY
    this.zoom = zoom

    this.viewPortEl.style.transform = `translate(${this.viewPortX}px, ${this.viewPortY}px) scale(${this.zoom})`

    // 使用 scrollTo() 方法
    setTimeout(() => {
      this.workspaceEl.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    }, 500)
  }

  setWorkSpaceMovable () {
    this.workspaceMovable = createMoveable({
      target: this.workspaceEl,
      className: 'workspace-movable'
    })

    this.workspaceMovable.on('dragStart', ev => {
      if (ev.inputEvent.ctrlKey) {
        this.workspaceMovable.dragWorkSpace = true
        this.moveable.target = []
      } else {
        this.workspaceMovable.dragWorkSpace = false
      }
    })

    this.workspaceMovable.on('drag', ev => {
      if (ev.inputEvent.ctrlKey && this.workspaceMovable.dragWorkSpace) {
        this.moveable.target = null
        this.viewPortX += ev.delta[0]
        this.viewPortY += ev.delta[1]

        this.viewPortEl.style.transform = `translate(${this.viewPortX}px, ${this.viewPortY}px) scale(${this.zoom})`
      }
    })
  }

  isElementMovable (el) {
    if (this.moveable.target == null) {
      return false
    }
    if (this.moveable.target.length === 1 && this.moveable.target[0] == el) {
      return true
    }
    return false
  }

  /**
   * 初始化页面元素拖拽动作
   */
  initMoveable () {
    const sm = this

    this.moveable = createMoveable({
      target: [],
      snappable: true
    })

    this.moveable.on('dragStart', ev => {
      if (!this.dragActive) {
        return false
      }
      const el = ev.target

      if (el.ridgeNode && el.ridgeNode.parent && el.ridgeNode.parent !== this.currentComposite) { // 非根节点
        this.moveable.dragMill = new Date().getTime()
      }
    })

    this.moveable.on('drag', ev => {
      if (!this.dragActive) {
        return false
      }
      const target = ev.target
      if (!sm.isTargetMovable(target)) {
        return
      }
      if (this.workspaceMovable.dragWorkSpace) {
        return
      }
      // dragstart时，判断为容器内节点，设置开始标志
      if (this.moveable.dragMill && new Date().getTime() - this.moveable.dragMill < 280) {
        // 当标志小于300ms，不启动拖拽
        return
      }

      if (this.moveable.dragMill) {
        // 超过300ms并且有容器内标识：从容器移除
        sm.onElementDragStart(target, ev.inputEvent)
        this.moveable.dragMill = null
      }
      const event = ev.inputEvent
      const config = target.ridgeNode.config
      // 更新位置
      target.style.transform = `translate(${config.style.x + ev.dist[0]}px,${config.style.y + ev.dist[1]}px)`
      target.style.zIndex = 1010
      // 检查是否在容器上可放置
      this.checkDropTargetStatus({
        target,
        clientX: event.clientX,
        clientY: event.clientY
      })
    })

    this.moveable.on('dragEnd', ev => {
      if (!this.dragActive) {
        return false
      }
      const target = ev.target
      target.style.zIndex = ''
      if (ev.isDrag && sm.isTargetMovable(target) && this.moveable.dragMill == null /** dragMill存在时，表示为容器内节点并且未超过300ms，未从容器脱离 */) {
        sm.placeElementAt(target, ev.clientX, ev.clientY)
      } else {
        sm.selectElements([target])
      }
    })

    this.moveable.on('resize', ({
      target,
      width,
      height,
      drag,
      delta,
      transform
    }) => {
      if (!sm.isTargetResizable(target)) {
        return
      }
      const style = {}
      style.x = drag.translate[0]
      style.y = drag.translate[1]
      style.width = Math.round(width)
      style.height = Math.round(height)

      target.ridgeNode.updateConfig({ style })
    })

    this.moveable.on('resizeEnd', ({
      target,
      width,
      height,
      delta,
      transform
    }) => {
      // target.ridgeNode.forceUpdate()
      this.editorStore.getState().updateNodeRect(target.ridgeNode.config.style)
      this.selectElements([target])
    })

    this.moveable.on('dragGroup', ({
      events
    }) => {
      events.forEach(({
        target,
        transform
      }) => {
        if (!sm.isTargetMovable(target)) {
          return
        }
        if (target.ridgeNode.parent === this.currentComposite) {
          target.style.transform = transform
        }
      })
    })
    this.moveable.on('dragGroupEnd', (payload) => {
      payload.events.forEach(({ target }) => {
        // TODO 目前仅支持根节点？？
        if (target.ridgeNode.parent === this.currentComposit) {
          const bcr = target.getBoundingClientRect()
          this.putElementToRoot(target, bcr.left + bcr.width / 2, bcr.top + bcr.height / 2)
        }
      })
    })

    this.moveable.on('resizeGroup', ({
      events
    }) => {
      events.forEach(({
        target,
        width,
        height,
        delta,
        transform
      }) => {
        if (!sm.isTargetResizable(target)) {
          return
        }
        target.style.transform = transform
        delta[0] && (target.style.width = `${width}px`)
        delta[1] && (target.style.height = `${height}px`)
      })
    })

    this.moveable.on('resizeGroupEnd', payload => {
      payload.events.forEach(({ target }) => {
        if (!target.ridgeNode.config.parent) {
          const bcr = target.getBoundingClientRect()

          target.ridgeNode.updateConfig({
            style: {
              x: bcr.left + bcr.width / 2,
              y: bcr.top + bcr.height / 2
            }
          })
        }
      })
    })
  }

  initSelecto () {
    this.selecto = new Selecto({
      // The container to add a selection element
      // container: '.viewport',
      // Selecto's root container (No transformed container. (default: null)
      rootContainer: null,
      // The area to drag selection element (default: container)
      dragContainer: this.workspaceEl,
      // Targets to select. You can register a queryselector or an Element.
      selectableTargets: [RIDGE_ELEMENT],
      // Whether to select by click (default: true)
      selectByClick: true,
      // Whether to select from the target inside (default: true)
      selectFromInside: true,
      // After the select, whether to select the next target with the selected target (deselected if the target is selected again).
      continueSelect: false,
      toggleContinueSelect: 'ctrl',
      preventDefault: true,
      // The container for keydown and keyup events
      keyContainer: window,
      // The rate at which the target overlaps the drag area to be selected. (default: 100)
      hitRate: 0
    })
    this.selecto.on('dragStart', this.onSelectoDragStart.bind(this))
    this.selecto.on('selectEnd', this.onSelectoDragEnd.bind(this))
  }

  /**
   * 工作区间鼠标拖拽启动开始：
   * 如果鼠标点击到组件，则启动组件的拖拽动作，否则启动组件选择框
   * @param {*} e
   * @returns
   */
  onSelectoDragStart (e) {
    const inputEvent = e.inputEvent
    const target = inputEvent.target
    if (target.classList && (target.classList.contains('moveable-area') || target.classList.contains('moveable-control'))) {
      e.stop()
      return
    }

    // 带ctrl键选择， 认为移动整个画布操作
    if (inputEvent.ctrlKey) {
      e.stop()
      return
    }

    // 点击在menu部分
    if (target.closest('.menu-bar')) {
      e.stop()
      return
    }

    // 已经选择了当前select节点的上级
    // if (this.moveable.target && this.moveable.target.length ===1 && isAncestor(this.moveable.target[0], target)) {
    //   e.stop()
    //   return
    // }

    // 拖拽起始位置位于元素内
    const closestRidgeNode = target.closest(RIDGE_ELEMENT)
    if (this.isElementMovable(closestRidgeNode)) {
      e.stop()
      return
    }

    if (closestRidgeNode && !this.isTargetSelectable(closestRidgeNode)) {
      return
    }

    if (closestRidgeNode) {
      // 穿透选择
      if (this.moveable.target && this.moveable.target.length === 1 && this.moveable.target[0].contains(closestRidgeNode) && this.disableClickThrough) {
        // 当前已经选择target并且包含了点击的节点，并且设置了禁用穿透选择，则不选择到子节点
        // 不改变对象
        e.stop()
        return
      } else {
        if (inputEvent.shiftKey && this.moveable.target) {
          if (Array.isArray(this.moveable.target)) {
            this.moveable.target.push(closestRidgeNode)
          } else {
            this.moveable.target = [this.moveable.target, closestRidgeNode]
          }
          // this.selectElements(this.moveable.target)
        } else {
          this.moveable.target = closestRidgeNode
        }
      }

      this.guidelines = [document.querySelector('.viewport-container'), ...Array.from(document.querySelectorAll(RIDGE_ELEMENT)).filter(el => {
        return el !== closestRidgeNode && el.closest(RIDGE_ELEMENT) !== closestRidgeNode
      })]
      this.moveable.elementGuidelines = this.guidelines
      this.moveable.elementSnapDirections = { top: true, left: true, bottom: true, right: true, center: true, middle: true }
      this.moveable.snapDirections = { top: true, left: true, bottom: true, right: true, center: true, middle: true }

      // this.onElementDragStart(closestRidgeNode, inputEvent)
      if (this.dragActive && !inputEvent.shiftKey) {
        this.moveable.dragStart(inputEvent)
      }

      e.inputEvent && e.inputEvent.stopPropagation()
      e.inputEvent && e.inputEvent.preventDefault()
      e.stop()
    } else if (inputEvent.ctrlKey) {
      // movableManager.current.getMoveable().dragStart(inputEvent)
      e.stop()
    }
  }

  onSelectoDragEnd ({ isDragStart, selected, inputEvent, rect }) {
    if (isDragStart) {
      inputEvent.preventDefault()
    }
    this.moveable.elementGuidelines = [document.querySelector('.viewport-container'), ...Array.from(document.querySelectorAll(RIDGE_ELEMENT)).filter(el => selected.indexOf(el) === -1)]
    this.guidelines = [document.querySelector('.viewport-container'), ...Array.from(document.querySelectorAll(`${RIDGE_ELEMENT}[snappable="true"]`)).filter(el => selected.indexOf(el) === -1)]

    this.selectElements(selected.filter(el => el.parentElement))
  }

  initComponentDrop () {
    this.workspaceEl.addEventListener('dragover', this.onWorkspaceDragOver.bind(this))
    this.workspaceEl.addEventListener('drop', this.onWorkspaceDrop.bind(this))
  }

  onWorkspaceDragOver (ev) {
    if (!this.enabled) {
      return
    }
    if (DragStore.getDragData()) {
      if (this.selected.length) {
        this.selectElements([])
      }
      ev.dataTransfer.dropEffect = 'move'

      this.checkDropTargetStatus({
        width: 100,
        height: 100,
        clientX: ev.clientX,
        clientY: ev.clientY
      })
    }
    ev.preventDefault()
  }

  async dropComposite () {

  }

  onWorkspaceDrop (ev) {
    if (!this.enabled) return
    ev.preventDefault()

    const rbcr = this.viewPortEl.getBoundingClientRect()

    const x = Math.floor((ev.pageX - rbcr.x) / this.zoom)
    const y = Math.floor((ev.pageY - rbcr.y) / this.zoom)

    // ✅ 从 DragStore 拿拖拽数据
    const dragData = DragStore.consumeDragData()
    if (!dragData) return

    const doDropComposite = async (compositeInfo) => {
      const compositeDef = await context.loader.loadComponent('ridge-container/composite')

      const def = {
        componentPath: 'ridge-container/composite'
      }

      let compositeLoaded = null
      const compisitePathProps = {}

      if (compositeInfo.componentPath) {
        const [pkgName, ...rest] = compositeInfo.componentPath.split('/')
        def.title = compositeInfo.title
        compisitePathProps.pagePath = rest.join('/')
        compisitePathProps.packageName = pkgName
        compositeLoaded = await context.loadComposite(
          pkgName,
          compisitePathProps.pagePath
        )
      } else if (compositeInfo.path) {
        compositeLoaded = await context.loadComposite(null, compositeInfo.path)
        const splited = compositeInfo.path.split('/')
        def.title = splited[splited.length - 1]
        compisitePathProps.pagePath = compositeInfo.path
      }

      if (compositeLoaded) {
        const ridgeNode = context.createElement(
          Object.assign({}, compositeDef, def),
          {
            x,
            y,
            width: compositeLoaded.style.width,
            height: compositeLoaded.style.height,
            props: {
              ...compositeLoaded.properties,
              ...compisitePathProps
            }
          }
        )
        this.placeElementAt(ridgeNode.el, ev.pageX, ev.pageY)
      }
    }

    // ✅ 根据拖拽数据类型分发
    if (dragData.type === 'composite') {
      doDropComposite(dragData)
    } else {
      // ✅ 组件创建：先留白
      const node = this.currentComposite.createElement({
        meta: dragData.item,
        path: dragData.packageName + '/' + dragData.componentName
      })
      this.placeElementAt(node.el, ev.pageX, ev.pageY)
      this.moveable.target = node.el
    }
  }

  /**
   * 检查并显示指定位置的放置情况，主要是容器放置处理
   */
  checkDropTargetStatus ({ target, clientX, clientY, width, height }) {
    this.getDroppableTarget(target, {
      x: clientX,
      y: clientY,
      width,
      height
    })
  }

  /**
   * 页面元素（el）释放到工作区某个位置结束
   * @param {Element} el 元素DOM对象
   * @param {number} x 鼠标当前位置X
   * @param {number} y 鼠标位置Y
   */
  placeElementAt (el, x, y) {
    trace('placeElementAt:', el, { x, y })
    // 获取可放置的容器
    const targetEl = this.getDroppableTarget(el, {
      x,
      y
    }, false)
    const targetParent = targetEl ? targetEl.ridgeNode : null
    if (targetParent) {
      // 放入一个容器
      trace('Into container', targetParent)

      const bcr = el.getBoundingClientRect()
      const pbcr = targetEl.getBoundingClientRect()

      this.currentComposite.removeChild(el.ridgeNode)
      targetParent.appendChild(el.ridgeNode, {
        x: Math.floor((bcr.x - pbcr.x) / this.zoom),
        y: Math.floor((bcr.y - pbcr.y) / this.zoom)
      }, bcr)
    } else {
      this.putElementToRoot(el, x, y)
    }

    this.selectElements([el])
    this.ensureDragPlacement(null)
    this.moveable.updateTarget()
  }

  /**
   * 将元素放置到根页面上某个位置
   * @param {*} el HTML元素
   * @param {*} x
   * @param {*} y
   */
  putElementToRoot (el, x, y) {
    const rbcr = this.viewPortEl.getBoundingClientRect()
    const bcr = el.getBoundingClientRect()

    const clientX = x || (bcr.x + bcr.width / 2)
    const clientY = y || (bcr.y + bcr.height / 2)

    const viewportX = (clientX - rbcr.left) / this.zoom
    const viewportY = (clientY - rbcr.top) / this.zoom

    const finalX = viewportX - bcr.width / 2
    const finalY = viewportY - bcr.height / 2

    el.ridgeNode.updateConfig({
      style: {
        x: Math.floor(finalX),
        y: Math.floor(finalY)
      }
    })
    this.editorStore.getState().updateNodeRect(el.ridgeNode.config.style)
    this.moveable.updateTarget()
  }

  /**
   * 处理开始拖拽事件, 处理当前节点从父容器脱离放置到根上
   * @param {*} el
   * @param {*} event
   */
  // 修改 onElementDragStart 方法
  onElementDragStart (el) {
    if (el.ridgeNode && el.ridgeNode.parent &&
        el.ridgeNode.parent !== this.currentComposite) { // 非根节点
      const rectConfig = getElementRectConfig(el)
      el.ridgeNode.parent.removeChild(el.ridgeNode)
      this.currentComposite.appendChild(el.ridgeNode)

      // 更新大纲面板
      this.editorStore.getState().outlinePanel?.updateOutline?.()

      el.ridgeNode.updateConfig({
        style: rectConfig
      })
    }
  }

  /**
   * 设置选择元素，包含选择“空”的情况
   * @param {*} elements
   * @param {*} disableClickThrough 选择后是否可以直接选择当前节点的下级节点, 从面板发起的选择一般不允许向下选择
   */
  selectElements (elements, disableClickThrough) {
    this.disableClickThrough = disableClickThrough

    // 去除之前选中状态
    document.querySelectorAll(`${RIDGE_ELEMENT}.selected`).forEach(el => {
      el.classList.remove('selected')
    })

    if (elements && elements.length > 0) {
      this.selected = elements.filter(el => isElementSelectable(el))
    } else {
      this.selected = []
    }

    if (this.selected.length > 1) {
      this.selected = this.selected.filter(el =>
        el.parentElement?.classList?.contains('ridge-composite')
      )
    }

    if (this.selected.length === 1 && this.selected[0].ridgeNode) {
      const el = this.selected[0]

      // 节点可用宽高小于配置宽高时
      if (el.ridgeNode.config.style.width && el.style.width &&
          el.style.width.indexOf('px') > -1 &&
          parseInt(el.style.width) !== el.offsetWidth) {
        el.style.width = el.offsetWidth + 'px'
        el.ridgeNode.config.style.width = el.offsetWidth
      }

      this.editorStore.getState().selectElement(this.selected[0].ridgeNode)
    } else if (elements.length === 1 && elements[0].ridgeNode) {
      this.editorStore.getState().selectElement(elements[0].ridgeNode)
    } else if (this.selected.length === 0) {
      this.editorStore.getState().selectPage()
      this.selected = []
      this.moveable.target = null
    }

    if (this.selected.length === 0) {
      this.moveable.target = null
    } else {
      this.moveable.target = this.selected
    }

    this.setSelectedStatus()
    this.moveable.updateTarget()
  }

  // 更新选择的状态
  setSelectedStatus () {
    if (this.selected.length === 1) {
      this.moveable.moveable = true
      this.moveable.resizable = true
    } else if (this.selected.length > 1) {
      this.moveable.resizable = false
    }
    this.moveable.elementGuidelines = [document.querySelector('.viewport-container'),
      ...Array.from(document.querySelectorAll(`.viewport-container > ${RIDGE_ELEMENT}:not(.ridge-is-hidden)`)).filter(el => this.selected.indexOf(el) === -1)]
  }

  isTargetMovable (el) {
    if (!this.dragActive || !isElementMovable(el)) {
      return false
    }
    return true
  }

  isTargetSelectable (el) {
    return isElementSelectable(el)
  }

  isTargetResizable (el) {
    return isElementResizable(el)
  }

  unSelectElements (elements) {
    this.selected = this.selected.filter(el => elements.indexOf(el) === -1)
    this.moveable.target = this.selected
    this.moveable.updateTarget()
  }

  /**
   * 判断正拖拽的节点是否在容器内部区域。（存在嵌套、重叠情况下取最顶层那个）
   * @param {Element} dragEl 被拖拽的DOM Element
   * @param {{x, y}} pointPos 鼠标位置（不存在则取dragEl正中坐标）
   * @param {boolean} updateDragOver 是否更新dragOver状态
   * @returns {Element} 可放置的容器DOM Element
   */
  getDroppableTarget (dragEl, pointPos, updateDragOver = true) {
  // 1. 修复：返回 null 而非 []
    if (dragEl && dragEl.ridgeNode && !dragEl.ridgeNode.canDroppedOnElement()) {
      return null
    }

    let droppableElements = []
    for (const selector of this.selectorDropableTarget) {
      droppableElements = droppableElements.concat(
        Array.from(document.querySelectorAll(selector))
      )
    }

    const zoom = this.zoom || 1
    const filtered = Array.from(droppableElements).filter(el => {
      if (!el.ridgeNode) return false

      // 2. 修复：禁止拖拽元素把自己当容器
      if (dragEl === el) return false
      if (dragEl && dragEl.contains(el)) return false
      if (el.contains(dragEl)) return true

      const { x, y, width, height } = el.getBoundingClientRect()

      // 3. 修复：鼠标坐标必须除以 zoom
      const mouseX = pointPos.x / zoom
      const mouseY = pointPos.y / zoom
      const elemX = x / zoom
      const elemY = y / zoom
      const elemW = width / zoom
      const elemH = height / zoom

      return (
        mouseX > elemX &&
      mouseX < elemX + elemW &&
      mouseY > elemY &&
      mouseY < elemY + elemH
      )
    })

    let target = null
    if (filtered.length === 1) {
      target = filtered[0]
    } else if (filtered.length > 1) {
    // 4. 修复：嵌套容器 → 取 最内层 + 最高层级
      const sorted = filtered.sort((a, b) => {
        if (a.contains(b)) return -1 // a 包含 b → b 更内层，排前面
        if (b.contains(a)) return 1 // b 包含 a → a 更内层，排前面

        // 5. 修复：取真实计算样式 zIndex
        const za = Number(getComputedStyle(a).zIndex) || 0
        const zb = Number(getComputedStyle(b).zIndex) || 0
        return zb - za
      })
      target = sorted[0]
    }

    this.ensureDragPlacement(target)
    return target
  }

  ensureDragPlacement (target) {
    // 检查是否已存在拖拽浮层
    let hintLayer = document.querySelector('.drag-target-hint')
    if (target == null) {
      if (hintLayer) {
        this.viewPortEl.removeChild(hintLayer)
      }
      return
    }

    if (!hintLayer) {
      // 创建目标元素的拖拽提示层
      hintLayer = document.createElement('div')
      hintLayer.className = 'drag-target-hint'
      hintLayer.dataset.targetId = target.id || 'target_' + Date.now()
      hintLayer.textContent = '拖放内容到此处'
      // 将提示层添加到浮层
      this.viewPortEl.appendChild(hintLayer)
    }

    const rect = target.getBoundingClientRect()
    const vprect = this.viewPortEl.getBoundingClientRect()
    hintLayer.style.top = (rect.top - vprect.top) / this.zoom + 'px'
    hintLayer.style.left = (rect.left - vprect.left) / this.zoom + 'px'
    hintLayer.style.width = rect.width / this.zoom + 'px'
    hintLayer.style.height = rect.height / this.zoom + 'px'
  }

  downloadImg (name, canvasImg) {
    const a = document.createElement('a') // 生成一个a元素
    const event = new window.MouseEvent('click') // 创建一个单击事件

    a.download = name || this.props.photoName || 'photo' // 设置图片名称
    a.href = canvasImg
    a.dispatchEvent(event) // 触发a的点击事件
  }

  async loadPage (pageContent, path, appService) {
    const editorComposite = new EditorComposite({
      loader,
      appName: 'local',
      path,
      appService,
      config: pageContent
    })

    await editorComposite.mount(this.viewPortEl)

    if (!this.enabled) {
      this.enable()
    }
    this.selectElements([])
    this.currentComposite = editorComposite
    return editorComposite
  }

  // 修改键盘事件处理
  initKeyBind () {
    Mousetrap.bind('del', () => {
      if (!this.enabled || !this.dragActive) return

      if (Array.isArray(this.moveable.target)) {
        for (const el of this.moveable.target) {
          this.onElementRemoved(el)
        }
      } else if (this.moveable.target) {
        this.onElementRemoved(this.moveable.target)
      }
      this.moveable.target = null
    })

    Mousetrap.bind('right', () => this.moveSelectedElement({ x: 1 }))
    Mousetrap.bind('left', () => this.moveSelectedElement({ x: -1 }))
    Mousetrap.bind('up', () => this.moveSelectedElement({ y: -1 }))
    Mousetrap.bind('down', () => this.moveSelectedElement({ y: 1 }))

    Mousetrap.bind('ctrl+c', () => {
      if (!this.enabled) return
      if (this.selected) {
        this.onCopyNodes(this.selected.map(el => el.ridgeNode))
      } else {
        this.onCopyNodes([])
      }
    })

    Mousetrap.bind('ctrl+s', e => {
      if (!this.enabled) return
      e.preventDefault()
      this.saveCurrentPage()
    })

    Mousetrap.bind('ctrl+v', e => {
      if (!this.enabled) return
      e.preventDefault()
      this.onPasteNodes()
    })

    this.workspaceEl.onwheel = (event) => {
      if (!this.enabled) return
      event.preventDefault()
      let targetZoom = this.zoom + (event.deltaY > 0 ? -1 : 1) * 0.01
      targetZoom = Math.min(Math.max(0.1, targetZoom), 2)
      this.setZoom(targetZoom)
    }
  }

  // 新增：移动选中元素的方法
  moveSelectedElement (delta) {
    if (!this.selected) return

    for (const el of this.selected) {
      const ridgeNode = el.ridgeNode
      if (!ridgeNode) continue

      const newStyle = { ...ridgeNode.config.style }
      if (delta.x) newStyle.x = (newStyle.x || 0) + delta.x
      if (delta.y) newStyle.y = (newStyle.y || 0) + delta.y

      ridgeNode.updateStyleConfig(newStyle)
    }
    this.moveable.updateTarget()
  }

  // 新增：需要实现的方法（可能需要从其他地方移过来）
  onElementRemoved (element) {
    // 实现删除元素的逻辑
    const ridgeNode = element.ridgeNode
    if (ridgeNode && ridgeNode.parent) {
      ridgeNode.parent.removeChild(ridgeNode)
    }
  }

  onCopyNodes (nodes) {
    // 实现复制逻辑
    console.log('Copy nodes:', nodes)
  }

  onPasteNodes () {
    // 实现粘贴逻辑
    console.log('Paste nodes')
  }

  saveCurrentPage () {
    // 实现保存逻辑
    console.log('Save current page')
  }
}
