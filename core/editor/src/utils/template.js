import { VERSION } from 'ridgejs'

const PAGE_JSON_TEMPLATE = {
  version: VERSION,
  style: Object.assign({
    width: 1290,
    height: 960,
    classNames: []
  }),
  properties: {},
  cssFiles: [],
  jsFiles: [],
  elements: []
}

const APP_PACKAGE_JSON = {
  name: 'ridge-hello-app',
  version: '1.0.0',
  description: 'Hello Ridge应用',
  keywords: ['ridge-webapp']
}

const STORE_TEMPLATE = `
export default {
  name: 'Hello',
  state: {
    name: 'World' //姓名
  }
}
`

export {
  STORE_TEMPLATE,
  PAGE_JSON_TEMPLATE,
  APP_PACKAGE_JSON
}
