const ALL =
`bounce
flash
pulse
rubberBand
shakeX
shakeY
headShake
swing
tada
wobble
jello
heartBeat
backInDown
backInLeft
backInRight
backInUp
backOutDown
backOutLeft
backOutRight
backOutUp
bounceIn
bounceInDown
bounceInLeft
bounceInRight
bounceInUp
bounceOut
bounceOutDown
bounceOutLeft
bounceOutRight
bounceOutUp
fadeIn
fadeInDown
fadeInDownBig
fadeInLeft
fadeInLeftBig
fadeInRight
fadeInRightBig
fadeInUp
fadeInUpBig
fadeInTopLeft
fadeInTopRight
fadeInBottomLeft
fadeInBottomRight
fadeOut
fadeOutDown
fadeOutDownBig
fadeOutLeft
fadeOutLeftBig
fadeOutRight
fadeOutRightBig
fadeOutUp
fadeOutUpBig
fadeOutTopLeft
fadeOutTopRight
fadeOutBottomRight
fadeOutBottomLeft
Flippers
flip
flipInX
flipInY
flipOutX
flipOutY
Lightspeed
lightSpeedInRight
lightSpeedInLeft
lightSpeedOutRight
lightSpeedOutLeft
rotateIn
rotateInDownLeft
rotateInDownRight
rotateInUpLeft
rotateInUpRight
rotateOut
rotateOutDownLeft
rotateOutDownRight
rotateOutUpLeft
rotateOutUpRight
Specials
hinge
jackInTheBox
rollIn
rollOut
zoomIn
zoomInDown
zoomInLeft
zoomInRight
zoomInUp
zoomOut
zoomOutDown
zoomOutLeft
zoomOutRight
zoomOutUp
slideInDown
slideInLeft
slideInRight
slideInUp
slideOutDown
slideOutLeft
slideOutRight
slideOutUp`.split('\n')
const In = ALL.filter(name => name.includes('In'))
const Out = ALL.filter(name => name.includes('Out'))
const Attention = ALL.filter(name => !name.includes('Out') && !name.includes('In'))

const boxStyle = 'width: 120px; height: 60px; border: 1px solid #ccc; display:flex;align-items:center;justify-content:center;'
const animationIn = {
  label: '进入效果',
  value: 'in',
  multiple: false,
  classList: In.map(className => {
    return {
      key: 'animate__' + className,
      html: `<div style="${boxStyle}">${className}</div>`
    }
  })
}

const animationOut = {
  label: '离开效果',
  value: 'out',
  multiple: false,
  classList: Out.map(className => {
    return {
      key: 'animate__' + className,
      html: `<div style="${boxStyle}">${className}</div>`
    }
  })
}

const animationAttention = {
  label: '醒目效果',
  value: 'attention',
  multiple: false,
  classList: Attention.map(className => {
    return {
      key: 'animate__' + className,
      html: `<div style="${boxStyle}">${className}</div>`
    }
  })
}
const repeat = {
  label: '重复',
  value: 'repeat',
  multiple: false,
  classList: ['infinite', 'repeat-1', 'repeat-2', 'repeat-3'].map(name => {
    return {
      key: 'animate__' + name,
      html: `<div style="${boxStyle}">${name}</div>`
    }
  })
}

const delay = {
  label: '延时',
  value: 'delay',
  multiple: false,
  classList: ['delay-1s', 'delay-2s', 'delay-3s', 'delay-4s', 'delay-5s'].map(name => {
    return {
      key: 'animate__' + name,
      html: `<div style="${boxStyle}">${name}</div>`
    }
  })
}

const duration = {
  label: '持续',
  value: 'duration',
  multiple: false,
  classList: ['faster', 'fast', 'slow', 'slower'].map(name => {
    return {
      key: 'animate__' + name,
      html: `<div style="${boxStyle}">${name}</div>`
    }
  })
}

export default [{
  label: '开关',
  value: 'open',
  multiple: false,
  classList: [{
    key: 'animate__animated',
    html: `<div style="${boxStyle}">Animated</div>`
  }]
}, animationIn, animationOut, animationAttention, repeat, delay, duration]
