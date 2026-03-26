const multiplyStringArrays = (array1, array2) => {
  const result = []
  // 遍历第一个数组
  for (let i = 0; i < array1.length; i++) {
    // 遍历第二个数组
    for (let j = 0; j < array2.length; j++) {
      // 将两个数组的元素通过横线相连，并添加到结果数组中
      if (array1[i] === '' || array2[j] === '') {
        result.push(array1[i] + array2[j])
      } else {
        result.push(array1[i] + '-' + array2[j])
      }
    }
  }
  // 返回结果数组
  return result
}

function multiplyStringArraysWithReduce (...arrays) {
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

const linerGradient = {
  label: '线性渐变',
  value: 'linerGradient',
  multiple: false,
  classList: ['red-orange'].map(op => {
    return {
      key: 'rg5-' + op,
      html: `<div class="gradient-box rg5-${op}">${op}</div>`
    }
  })
}

const glassMorphism = {
  label: '玻璃效果',
  value: 'glassMorphism',
  multiple: false,
  classList: multiplyStringArraysWithReduce(['white', 'black'], ['4', '8', '16'], ['25', '50', '75']).map(op => {
    return {
      key: 'gm-' + op,
      html: `<div class="gradient-box gm-${op}">gm-${op}</div>`
    }
  })
}

export default {
  type: 'style',
  data: [linerGradient, glassMorphism]
}
