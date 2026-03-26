// 将十六进制颜色值转换为 HSL 颜色值
const hexToHsl = hex => {
  // 处理 #AAB 这种短格式，扩展为 #AAABBB
  if (hex.length === 4) {
    hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3]
  }
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h; let s; const l = (max + min) / 2

  if (max === min) {
    h = s = 0 // 灰色
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return [h * 360, s * 100, l * 100]
}

// 将 HSL 颜色值转换为十六进制颜色值
const hslToHex = (h, s, l) => {
  h /= 360
  s /= 100
  l /= 100

  let r, g, b

  if (s === 0) {
    r = g = b = l // 灰色
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  const toHex = (x) => {
    const hex = Math.round(x * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  return '#' + toHex(r) + toHex(g) + toHex(b)
}
// 计算两个 HSL 颜色之间的综合距离
function hslDistance (hslA, hslB) {
  const [hA, sA, lA] = hslA
  const [hB, sB, lB] = hslB
  // 可以根据实际情况调整权重
  const hWeight = 1
  const sWeight = 0.3
  const lWeight = 0.6
  const hDiff = Math.abs(hA - hB)
  const sDiff = Math.abs(sA - sB)
  const lDiff = Math.abs(lA - lB)
  return hWeight * hDiff + sWeight * sDiff + lWeight * lDiff
}


// 按相近颜色分类
function groupSimilarColors(colorArray) {
    const colorGroups = [];
    colorArray.forEach((colorObj) => {
        const hsl = hexToHsl(colorObj.color);
        let inserted = false;
        colorGroups.forEach((group) => {
            const groupHsl = hexToHsl(group[0].color);
            if (hslDistance(hsl, groupHsl) < 50) { // 距离阈值，可调整
                group.push(colorObj);
                inserted = true;
            }
        });
        if (!inserted) {
            colorGroups.push([colorObj]);
        }
    });
    return colorGroups;
}


// 定义 24 个基本色
const baseColors = [
    "#000000",
    "#545454",
    "#737373",
    "#a6a6a6",
    "#d9d9d9",
    "#ffffff",
    "#ff3131",
    "#ff5757",
    "#ff66c4",
    "#cb6ce6",
    "#8c52ff",
    "#5e17eb",
    "#0097b2",
    "#0cc0df",
    "#5ce1e6",
    "#38b6ff",
    "#5271ff",
    "#004aad",
    "#00bf63",
    "#7ed957",
    "#c1ff72",
    "#ffde59",
    "#ffbd59",
    "#ff914d"
];

// 按与基本色的距离对颜色数组进行分组
function groupColorsByBaseColor(colorArray) {
    const colorGroups = [];
    baseColors.forEach((baseColor) => {
        const baseHsl = hexToHsl(baseColor);
        const group = [];
        colorArray.forEach((colorObj) => {
            const hsl = hexToHsl(colorObj.color);
            if (hslDistance(hsl, baseHsl) < 30) { // 距离阈值，可调整
                group.push(colorObj);
            }
        });
        if (group.length > 0) {
            colorGroups.push(group);
        }
    });
    return colorGroups;
}


// 对包含颜色名称和十六进制颜色的数组进行排序，考虑视觉连续性
function sortColorArray (colorArray) {
  const colorObjects = colorArray.map(item => {
    const hsl = hexToHsl(item.color)
    return {
      ...item,
      hsl
    }
  })

  colorObjects.sort((a, b) => {
    // 先按色相排序
    if (a.hsl[0] !== b.hsl[0]) {
      return a.hsl[0] - b.hsl[0]
    }
    // 色相相同，按综合距离排序
    return hslDistance(a.hsl, [a.hsl[0], 0, 50]) - hslDistance(b.hsl, [b.hsl[0], 0, 50])
  })

  return colorObjects.map(item => ({
    name: item.name,
    color: item.color
  }))
}

export default {
  name: 'ColorLiner',
  externals: [
    '/china-color-names/lib/colors.js'
  ],
  state: {
    poem: '',
    groupColors: [], // 分类后颜色
    currentGroupingColors: [], // 某个分类下的颜色
    sortedColors: [], // 排序后颜色
    currentColor: {
      name: "",
      color: ""
    }
  },

  computed: {
    itemBgColor: scope => scope.item.color,
    itemColorName: scope => scope.item.name,
    groupItemColor: scope => baseColors[scope.i]
  },

  setup () {
    this.sortedColors = sortColorArray(window.CHINA_COLOR_NAMES)
    this.groupColors = groupColorsByBaseColor(window.CHINA_COLOR_NAMES)
  },

  actions: {
    selectColor : (context, scope) => {
      context.currentColor = scope.item
    },
    selectGroup: (context, scope) => {
      context.currentGroupingColors = sortColorArray(scope.item)
    },
    updateColor: context => {
      localStorage.setItem(context.currentColor.color, context.poem)
    }
  }
}
