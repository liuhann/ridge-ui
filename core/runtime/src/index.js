import Composite from './node/Composite.js'
import './style.css'
import Element from './node/Element.js'
import ValtioStore from './store/ValtioStore.js'
import ReactComposite from './framework/ReactComposite.jsx'
import { convertToValidVariableName } from './utils/string.js'
import Loader from './loader/Loader.js'
const ELEMENT_SCHEMA_URL = 'https://ridge-ui.com/schemas/element'
const COMPOSITE_SCHEMA_URL = 'https://ridge-ui.com/schemas/composite'

const VERSION = '2.0.0'
const ridgeBaseUrl = window.RIDGEUI_BASE_URL || '/npm'
const loader = new Loader(ridgeBaseUrl)
window.RidgeUI = {
  VERSION,
  ridgeBaseUrl,
  getLoader: baseUrl => {
    return new Loader(baseUrl)
  },
  loader,
  ReactComposite
}

export {
  loader,
  VERSION,
  ELEMENT_SCHEMA_URL,
  COMPOSITE_SCHEMA_URL,
  Composite,
  Element,
  ValtioStore,
  ReactComposite,
  convertToValidVariableName
}
