import loadjs from 'loadjs'

const baseUrl = '/npm'
window.baseUrl = baseUrl

// 1) CSS 并行加载
const cssAssets = [
  '/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css',
  '/@douyinfe/semi-ui/dist/css/semi.min.css'
]

// 2) JS 必须按顺序加载
const jsAssets = [
  '/react@18.3.1/umd/react.production.min.js',
  '/react-dom@18.3.1/umd/react-dom.production.min.js',
  '/@douyinfe/semi-ui/dist/umd/semi-ui.min.js'
]

const allAssets = [...cssAssets, ...jsAssets]
const total = allAssets.length
let loaded = 0

// 进度条
const progressEl = document.querySelector('progress')
const setProgress = (val) => {
  progressEl.setAttribute('value', Math.min(val, 100))
}

// 加载单个资源
function loadAsset (url) {
  return loadjs(baseUrl + url, { returnPromise: true }).then(() => {
    loaded += 1
    setProgress((loaded / total) * 100)
  })
}

// 主加载逻辑
async function loadApp () {
  try {
    // ------------------------------
    // 第一步：并行加载 CSS（超快）
    // ------------------------------
    const cssPromises = cssAssets.map(loadAsset)
    await Promise.all(cssPromises)

    // ------------------------------
    // 第二步：串行加载 JS（保证顺序）
    // ------------------------------
    for (const js of jsAssets) {
      await loadAsset(js)
    }

    // ------------------------------
    // 加载业务代码
    // ------------------------------
    const { init } = await import('./main.jsx')
    init()

    // 关闭 loading
    document.body.removeChild(document.querySelector('#loading-overview'))

    // HMR 热更新
    if (module.hot) {
      module.hot.accept('./main.jsx', () => {
        const { init: newInit } = require('./main.jsx')
        newInit()
      })
    }
  } catch (err) {
    console.error('加载失败', err)
    setProgress(100)
  }
}

loadApp()
