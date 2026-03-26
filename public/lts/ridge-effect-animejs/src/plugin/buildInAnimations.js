const scaleOut = {
  scale: [1, 0],
  reverse: true
}

const fadeOutDown = {
  scale: [1, 2],
  opacity: [1, 0],
  translateY: [0, '100%']
}

const rotateOut = {
  rotate: [0, '45deg'],
  opacity: [1, 0]
}

const rotateOutBack = {
  rotate: [0, '45deg'],
  translateZ: [0, -180],
  opacity: [1, 0]
}

const rotateOutFwd = {
  rotate: [0, '45deg'],
  translateZ: [0, 180],
  opacity: [1, 0]
}

const flipOutHorTop = {
  rotateX: [0, 70],
  opacity: [1, 0]
}
const flipOutVerLeft = {
  rotateY: [0, -70],
  opacity: [1, 0]
}
const slideOutTop = {
  translateY: [0, '-100%'],
  opacity: [1, 0]
}

const swingOutTopBack = {
  rotateX: [0, '-100deg'],
  transformOrigin: 'top',
  opacity: [1, 0]
}

const fadeOutScaleBlur = {
  opacity: [1, 0],
  scale: [1, 3],
  transformOrigin: ['center', 'center'],
  filter: ['blur(0)', 'blur(10px)']
}

const animationOut = {
  fadeOutDown,
  rotateOutBack,
  rotateOut,
  flipOutHorTop,
  flipOutVerLeft,
  swingOutTopBack,
  rotateOutFwd,
  slideOutTop,
  scaleOut,
  fadeOutScaleBlur
}
const eases = [
  'linear',
  'inQuad', 'outQuad', 'inOutQuad',
  'inCubic', 'outCubic', 'inOutCubic',
  'inQuart', 'outQuart', 'inOutQuart',
  'inQuint', 'outQuint', 'inOutQuint',
  'inSine', 'outSine', 'inOutSine',
  'inCirc', 'outCirc', 'inOutCirc',
  'inExpo', 'outExpo', 'inOutExpo',
  'inBounce', 'outBounce', 'inOutBounce'
]

function createInAnimations (outAnimations) {
  return Object.fromEntries(
    Object.entries(outAnimations).map(([name, config]) => {
      const inName = name.replace('Out', 'In')

      const inConfig = Object.fromEntries(
        Object.entries(config).map(([prop, value]) => {
          // 反转数组类型的属性值
          const inValue = Array.isArray(value) ? [...value].reverse() : value
          return [prop, inValue]
        })
      )

      return [inName, inConfig]
    })
  )
}
const animationIn = createInAnimations(animationOut)

export {
  animationOut,
  animationIn,
  eases
}
