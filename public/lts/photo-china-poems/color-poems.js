const debounce = (func, wait) => {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}

const ridgeBaseUrl = window.RIDGE_HOST ?? ''

async function resizeImageFromUrl (url, maxWidth, maxHeight) {
  // 2. 创建图片对象并加载（处理跨域）
  const img = new Image()
  img.crossOrigin = 'anonymous'

  await new Promise((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = (e) => reject(new Error(`Image load error: ${e.message}`))
    img.src = url
  })

  // 3. 计算缩放尺寸
  let width = img.width
  let height = img.height

  if (width > maxWidth) {
    height = height * (maxWidth / width)
    width = maxWidth
  }

  if (height > maxHeight) {
    width = width * (maxHeight / height)
    height = maxHeight
  }

  // 4. 使用Canvas绘制缩放后的图片
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, width, height)

  // 5. 转换为Blob（强制使用JPEG格式，避免无效MIME类型）
  const resizedBlob = await new Promise(resolve => {
    canvas.toBlob(blob => {
      resolve(blob)
    }, 'image/jpeg', 0.8)
  })

  return URL.createObjectURL(resizedBlob)
}
function getContrastTextColor (bgColor) {
  // 移除 # 符号
  bgColor = bgColor.replace(/^#/, '')

  // 解析十六进制颜色为 RGB
  const r = parseInt(bgColor.substring(0, 2), 16)
  const g = parseInt(bgColor.substring(2, 4), 16)
  const b = parseInt(bgColor.substring(4, 6), 16)

  // 计算亮度
  const brightness = (0.299 * r + 0.587 * g + 0.114 * b)

  // 根据亮度选择文本颜色
  return brightness > 128 ? '#000000' : '#FFFFFF'
}

export default {
  name: 'PhotoPoems',
  externals: [
    '/china-color-names/dist/extract-colors.js' // 第三方库依赖加载
  ],
  state: {
    fileUrl: ridgeBaseUrl + '/npm/photo-china-poems/panda.jpg', // 文件地址
    backgroundColor: '', // 背景颜色
    useIndex: 0, // 选择的颜色索引
    poem: '怀琬琰以为心·佩江离而纫兰', // 古诗
    author: '', // 作者
    title: '', // 标题
    isFull: true, // 全屏
    width: 805,
    height: 680,
    colorList: [] // 颜色列表
  },

  computed: {
    tagColorName: { // 单项颜色名称
      get: scope => {
        return scope.item.name
      }
    },
    tagColorValue: { // 单项颜色值
      get: scope => {
        return scope.item.color
      }
    },
    tagTextColor: scope => getContrastTextColor(scope.item.color) // 单项颜色反色(可用于文字)
  },

  async setup () {
    this.onResizeFunc = debounce(() => {
      if (this.isFull) {
        this.width = window.innerWidth
        this.height = window.innerHeight
      }
    }, 300)
    window.addEventListener('resize', this.onResizeFunc)

    this.width = window.innerWidth
    this.height = window.innerHeight

    this.fileChanged()
  },
  destory () {
    window.removeEventListener('resize', this.onResizeFunc)
  },

  actions: {
    async fileChanged (url) { // 文件选中
      try {
        this.fileUrl = await resizeImageFromUrl(url || this.fileUrl, window.innerWidth * 4, window.innerHeight * 4)
      } catch (e) {
        this.fileUrl = url
      }
      this.colorList = await getColorPoems(this.fileUrl)
      this._selectColorByIndex(0)
    },

    async _selectColorByIndex (index) {
      this.useIndex = index
      this.backgroundColor = this.colorList[index].color
      this.poem = (this.colorList[index].poem ?? '').replace(/[，,]/g, '·').replace(/[.。]/g, '')
      this.author = this.colorList[index].author ?? ''
      this.title = this.colorList[index].title ?? ''
    },

    toggleColor (scope) { // 切换列表项
      this._selectColorByIndex(scope.i)
    }
  }
}
