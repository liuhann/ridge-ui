import { animationOut, animationIn } from './buildInAnimations.js'

const storeOrResetStyle = (el) => {
  if (!el.originalStyleKeys) {
    el.originalStyleKeys = Array.from(el.style).map(key => [key, el.style[key]])
  } else {
    for (const key of el.style) {
      el.style[key] = ''
    }
    for (const [key, value] of el.originalStyleKeys) {
      el.style[key] = value
    }
  }
}

const animate = (el, config, complete) => {
  if (window.anime) {
    const { animate } = window.anime

    const animationConfig = animationIn[config.name] || animationOut[config.name]
    const animateProps = {
      ...animationConfig,
      onComplete: () => {
        complete && complete()
      }
    }

    if (config.d) {
      animateProps.duration = parseInt(config.d)
    }
    if (config.e) {
      animateProps.ease = config.e
    } else {
      animateProps.ease = 'inQuad'
    }

    if (!animateProps.duration) {
      animateProps.duration = 400
    }

    if (config.l) {
      if (Array.isArray(el)) {
        animateProps.delay = (el, i) => i * parseInt(config.l)
      } else {
        animateProps.delay = parseInt(config.l)
      }
    }

    if (Array.isArray(el)) {
      for (const ei of el) {
        storeOrResetStyle(ei)
      }
    } else {
      storeOrResetStyle(el)
    }

    window.requestAnimationFrame(() => {
      animate(el, animateProps)
    })
  }
}

const objectToQuery = (obj) => {
  const name = obj.name
  const query = Object.entries(obj)
    .filter(([key]) => key !== 'name')
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
  return `${name}?${query}`
}

const queryToObject = (queryStr) => {
  // 分割主值和参数字符串
  const [name, paramsStr] = queryStr.split('?')

  // 解析参数字符串
  const params = paramsStr?.split('&')
    .filter(part => part.includes('='))
    .reduce((acc, part) => {
      const [key, value] = part.split('=')
      acc[key] = value
      return acc
    }, {}) || {}

  // 合并主值和参数对象
  return { name, ...params }
}

// 转换动画配置为Select选项
function animationsToSelectOptions (enterAnimations, exitAnimations) {
  // 辅助函数：将动画对象转换为选项数组
  const mapAnimationsToOptions = (animations, prefix) =>
    Object.entries(animations).map(([name, config]) => ({
      label: name,
      value: name,
      config, // 保留原始配置供后续使用
      type: prefix // 标记动画类型
    }))

  return [
    {
      label: '进入动画',
      children: mapAnimationsToOptions(enterAnimations, 'enter')
    },
    {
      label: '退出动画',
      children: mapAnimationsToOptions(exitAnimations, 'exit')
    }
  ]
}

export { animate, objectToQuery, queryToObject, animationsToSelectOptions }
