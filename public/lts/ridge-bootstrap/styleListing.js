function multiplyStringArrays (...arrays) {
  if (arrays.length === 0) {
    return []
  }
  return arrays.reduce((acc, currentArray) => {
    const temp = []
    for (let i = 0; i < acc.length; i++) {
      for (let j = 0; j < currentArray.length; j++) {
        temp.push(`${acc[i]}-${currentArray[j]}`)
      }
    }
    return temp
  })
}

const colors = ['primary', 'primary-emphasis', 'secondary', 'secondary-emphasis', 'success', 'success-emphasis', 'danger', 'danger-emphasis', 'warning', 'warning-emphasis', 'info', 'info-emphasis', 'light', 'light-emphasis', 'dark', 'dark-emphasis', 'body', 'body-emphasis', 'body-secondary', 'body-tertiary', 'black', 'white', 'black-50', 'white-50']
const contracts = ['light', 'white', 'white-50']
const bgContracts = ['primary', 'success', 'danger', 'dark', 'black']

const text = (color) => {
  return {
    html: `<div class="p-2 text-${color} ${contracts.indexOf(color) > -1 ? 'bg-dark' : ''}">${color}</div>`,
    key: 'text-' + color
  }
}

const textColor = {
  label: '文字颜色',
  value: 'text-color',
  multiple: false,
  classList: colors.map(color => text(color))
}

const fontWeight = {
  label: '字体粗细',
  value: 'font-weight',
  multiple: false,
  classList: ['bold', 'bolder', 'semibold', 'medium', 'normal', 'light', 'lighter'].map(weight => {
    return {
      key: 'fw-' + weight,
      html: `<div class="p-2 fw-${weight}">${weight}</div>`
    }
  })
}

const fontSize = {
  label: '文字大小',
  value: 'font-size',
  multiple: false,
  classList: [1, 2, 3, 4, 5, 6].map(i => {
    return {
      key: `fs-${i}`,
      html: `<p class="fs-${i}">文本</p>`
    }
  })
}

const textAlign = {
  label: '对齐',
  value: 'text-align',
  multiple: true,
  classList: ['text-start', 'text-center', 'text-end', 'align-baseline', 'align-top', 'align-middle', 'align-bottom', 'align-text-top', 'align-text-bottom'].map(align => {
    return {
      key: align,
      html: `<div class="p-2 ${align}">${align}</div>`
    }
  })
}

const textOther = {
  label: '其他排版',
  value: 'text-other',
  multiple: true,
  classList: ['lh-1', 'lh-sm', 'lh-base', 'lh-lg', 'font-monospace', 'text-truncate', 'text-decoration-underline',
    'text-decoration-line-through', 'text-decoration-none', 'fst-italic', 'text-uppercase', 'text-break', 'text-wrap', '.d-none', 'd-block'].map(i => {
    return {
      key: i,
      html: `<div class="p-2 ${i}">${i}</div>`
    }
  })
}

const bgColors = [
  'bg-primary',
  'bg-primary-subtle',
  'bg-secondary',
  'bg-secondary-subtle',
  'bg-success',
  'bg-success-subtle',
  'bg-danger',
  'bg-danger-subtle',
  'bg-warning',
  'bg-warning-subtle',
  'bg-info',
  'bg-info-subtle',
  'bg-light',
  'bg-light-subtle',
  'bg-dark',
  'bg-dark-subtle',
  'bg-body-secondary',
  'bg-body-tertiary',
  'bg-body',
  'bg-black',
  'bg-white',
  'bg-transparent'
]
const bg = color => {
  return {
    html: `<div class="p-2 ${color} ${bgContracts.indexOf(color) > -1 ? 'text-white' : ''}">${color}</div>`,
    key: color
  }
}
const backgroundColor = {
  label: '背景颜色',
  value: 'bg-color',
  multiple: false,
  classList: bgColors.map(color => bg(color))
}

const borderColor = {
  label: '边框颜色',
  value: 'bd-color',
  classList: colors.map(color => {
    return {
      html: `<div class="p-2 border border-${color}">${color}</div>`,
      key: 'border-' + color
    }
  })
}
const shadow = {
  label: '阴影',
  value: 'shadow',
  multiple: false,
  classList: [{
    html: '<div class="shadow-none p-2 bg-body-tertiary rounded">无</div>',
    key: 'shadow-none'
  }, {
    html: '<div class="shadow-sm p-2 bg-body-tertiary rounded">小</div>',
    key: 'shadow-sm'
  }, {
    html: '<div class="shadow p-2 bg-body-tertiary rounded">正常</div>',
    key: 'shadow'
  }, {
    html: '<div class="shadow-lg p-2 bg-body-tertiary rounded">大</div>',
    key: 'shadow-lg'
  }]
}

const border = {
  label: '边框',
  value: 'border',
  multiple: true,
  classList: [{
    key: 'border',
    html: '<div class="border p-1">四边</div>'
  },
  {
    key: 'border-top',
    html: '<div class="border-top p-1">上边</div>'
  },
  {
    key: 'border-end',
    html: '<div class="border-end p-1">右边</div>'
  },
  {
    key: 'border-bottom',
    html: '<div class="border-bottom p-1">底边</div>'
  },
  {
    key: 'border-start',
    html: '<div class="border-start p-1">左边</div>'
  }]
}

const borderWidth = {
  label: '边框宽度',
  value: 'border-width',
  multiple: false,
  classList: [{
    key: 'border-0',
    html: '<div class="border border-0 p-4">无边框</div>'
  }, {
    key: 'border-1',
    html: '<div class="border border-1 p-4"></div>'
  },
  {
    key: 'border-2',
    html: '<div class="border border-2 p-4"></div>'
  },
  {
    key: 'border-3',
    html: '<div class="border border-3 p-4"></div>'
  },
  {
    key: 'border-4',
    html: '<div class="border border-4 p-4"></div>'
  },
  {
    key: 'border-5',
    html: '<div class="border border-5 p-4"></div>'
  }]
}

const borderRadius = {
  label: '边框圆角',
  value: 'border-radius',
  multiple: false,
  classList: ['rounded-circle', 'rounded-pill', ...multiplyStringArrays(['rounded', 'rounded-top', 'rounded-end', 'rounded-bottom', 'rounded-start'], ['1', '2', '3', '4', '5'])].map(key => {
    return {
      key,
      html: `<div class="border border-1 ${key} p-4"></div>`
    }
  })
}

const opacity = {
  label: '透明度',
  value: 'opacity',
  multiple: false,
  classList: ['0', '25', '50', '75', '100'].map(op => {
    return {
      key: 'opacity-' + op,
      html: `<div class="opacity-${op} p-3 m-2 bg-primary text-light fw-bold rounded">${op}%</div>`
    }
  }).concat(['0', '25', '50', '75', '100'].map(op => {
    return {
      key: 'bg-opacity-' + op,
      html: `<div class="opacity-${op} p-3 m-2 bg-primary text-light fw-bold rounded">bg-${op}%</div>`
    }
  }))
}

const padding = {
  label: '内边距',
  value: 'padding',
  multiple: true,
  classList: multiplyStringArrays(['p', 'pt', 'pb', 'ps', 'pe'], [0, 1, 2, 3, 4, 5, 'auto']).map(pp => {
    return {
      key: pp,
      html: `<div class="border border-1 ${pp}">${pp}</div>`
    }
  })
}

const margin = {
  label: '外边距',
  value: 'margin',
  multiple: true,
  classList: multiplyStringArrays(['m', 'mt', 'mb', 'ms', 'me'], [1, 2, 3, 4, 5, 'auto']).map(pp => {
    return {
      key: pp,
      html: `<div class="border border-1 ${pp}">${pp}</div>`
    }
  })
}

const objectFit = {
  label: '图片填充',
  value: 'objectfit',
  multiple: false,
  classList: ['cover', 'contain', 'fill', 'none', 'scale'].map(fit => {
    return {
      key: 'object-fit-' + fit,
      html: `<div class="border border-1 w-100 h-100 object-fit-${fit}">object-fit-${fit}</div>`
    }
  })
}
export default {
  type: 'style',
  data: [textColor, fontSize, fontWeight, textAlign, textOther, backgroundColor, shadow, border, borderWidth, borderColor, borderRadius, padding, margin, opacity, objectFit]
}
