const styleProperties = [{
  label: '背景',
  children: [{
    name: 'backgroundColor',
    label: '背景颜色',
    type: 'color',
    value: ''
  }]
}]

export default {
  name: 'CSSEdit',
  properties: [{
    name: 'style',
    label: '样式值',
    type: 'object',
    value: {}
  }],
  state: {
    name: 'World' //姓名
  }
}
