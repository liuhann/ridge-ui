import loadjs from 'loadjs'

const baseUrl = '/npm'
window.baseUrl = baseUrl

const assets = [
  '/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css',
  '/react@18.3.1/umd/react.production.min.js',
  '/react-dom@18.3.1/umd/react-dom.production.min.js',
  '/@douyinfe/semi-ui/dist/css/semi.min.css',
  '/@douyinfe/semi-ui/dist/umd/semi-ui.min.js'
]

const load = async () => {
  for (let i = 0; i < assets.length; i++) {
    await loadjs(baseUrl + assets[i], {
      returnPromise: true
    })
    document.querySelector('progress').setAttribute('value', (i + 1) * 16)
  }
  await import(/* webpackChunkName: "ridge-editor-main" */ './main.jsx')

  document.body.removeChild(document.querySelector('#loading-overview'))
}
load()
