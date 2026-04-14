// workspaceUtils.js

function isIntersect (rect1, rect2) {
  if ((rect1.x + rect1.width < rect2.x) || (rect1.x > rect2.x + rect2.width) || (rect1.y + rect1.height < rect2.y) || (rect1.y > rect2.y + rect2.height)) {
    return false
  } else {
    return true
  }
}

// 检查元素是否可移动
export function isElementMovable (element) {
  if (!element || !element.classList) return false
  return !element.classList.contains('ridge-is-locked') &&
         !element.classList.contains('ridge-is-full')
}

// 检查元素是否可选择
export function isElementSelectable (element) {
  if (!element || !element.classList) return false
  return !element.classList.contains('ridge-is-hidden') &&
         !element.classList.contains('ridge-is-locked') &&
         !element.closest('.ridge-is-hidden')
}

// 检查元素是否可调整大小
export function isElementResizable (element) {
  if (!element || !element.classList) return false
  if (element.classList.contains('ridge-is-locked') ||
      element.classList.contains('ridge-is-hidden')) {
    return false
  }
  if (element.classList.contains('ridge-is-slot')) {
    return element.ridgeNode?.isResizable?.() ?? true
  }
  return true
}

// 获取元素的矩形配置
export function getElementRectConfig (element, viewPortEl, zoom) {
  const beforeRect = element.getBoundingClientRect()
  const rbcr = viewPortEl.getBoundingClientRect()

  return {
    position: 'absolute',
    visible: true,
    x: (beforeRect.x - rbcr.x) / zoom,
    y: (beforeRect.y - rbcr.y) / zoom,
    width: beforeRect.width / zoom,
    height: beforeRect.height / zoom
  }
}

// 坐标转换：从屏幕坐标转换到视口坐标
export function screenToViewport ({ x, y }, viewPortEl, zoom) {
  const rbcr = viewPortEl.getBoundingClientRect()
  return {
    x: (x - rbcr.x) / zoom,
    y: (y - rbcr.y) / zoom
  }
}

// 坐标转换：从视口坐标转换到屏幕坐标
export function viewportToScreen ({ x, y }, viewPortEl, zoom) {
  const rbcr = viewPortEl.getBoundingClientRect()
  return {
    x: x * zoom + rbcr.x,
    y: y * zoom + rbcr.y
  }
}

// 计算元素的中心点
export function getElementCenter (element) {
  const rect = element.getBoundingClientRect()
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  }
}

// 拖拽上浮（显示阴影）
export function onDragOver (containerEl, dragNode) {
  if (!containerEl) return

  // 👇 安全设置 position：只在没有定位时才加，不覆盖原有样式
  const computed = window.getComputedStyle(containerEl)
  if (computed.position === 'static') {
    containerEl.style.position = 'relative'
    // 标记是我们加的，方便移除
    containerEl.setAttribute('data-drag-relative', 'true')
  }

  let existedNode = null
  existedNode = containerEl.querySelector(':scope > .drop-shadow')

  if (existedNode) {
    if (!isIntersect(dragNode.getBoundingClientRect(), existedNode.getBoundingClientRect())) {
      containerEl.removeChild(existedNode)
      existedNode = null
    }
  } else {
    const shadowNode = document.createElement('div')
    shadowNode.classList.add('drop-shadow')
    shadowNode.innerHTML = '可以放入容器内'

    containerEl.appendChild(shadowNode)

    if (!containerEl.style.position) {
      containerEl.style.position = 'relative'
    }
  }
}

// 拖拽离开（清除阴影）
export function onDragOut (containerEl) {
  if (containerEl.querySelector(':scope > .drop-shadow')) {
    containerEl.removeChild(containerEl.querySelector(':scope > .drop-shadow'))
  }
}
