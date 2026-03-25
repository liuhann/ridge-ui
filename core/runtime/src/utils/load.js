import { convertToValidVariableName, generateUrlFontName, addStringPrefix } from './string'
import { resolve } from './path'
import debug from 'debug'
import memoize from 'lodash/memoize'

const trace = window.trace || debug('ridge:load')

const obj = {}
const handler = {
  set: function (target, property, value) {
    target[property] = value

    globalThis.appModulesNotifier[property] && globalThis.appModulesNotifier[property](value)
    return true
  },
  // 获取拦截器，当访问对象属性时触发
  get: function (target, property) {
    return target[property]
  }
}

/**
 * 组件定义（js及其依赖）加载服务类
 * @class
 */

const loadJSON = async (url) => {
  const response = await window.fetch(url, {
    mode: 'cors',
    credentials: 'include'
  })
  if (response.ok) {
    return await response.json()
  } else {
    return null
  }
}

globalThis.appModules = new Proxy(obj, handler)
globalThis.appModulesNotifier = {}

const parseImportStatement = (importStr) => {
  // 优化后的正则表达式，能匹配多种 import 语句形式
  const regex = /import(?:\s*(\w+)\s*(?:,\s*\{([^}]+)\})?|\s*\{([^}]+)\}\s*(?:,\s*(\w+))?)\s*from\s*['"]([^'"]+)['"]|import\s+['"]([^'"]+)['"]/
  const match = importStr.match(regex)
  if (match) {
    let moduleNames = []
    let defaultModuleName = null
    if (match[1]) {
      // 处理仅导入默认模块或同时导入默认模块和命名模块时的默认模块名
      defaultModuleName = match[1]
    }
    if (match[2]) {
      // 处理同时导入默认模块和命名模块时的命名模块名
      moduleNames = match[2].split(',').map(name => name.trim())
    } else if (match[3]) {
      // 处理仅导入命名模块时的命名模块名
      moduleNames = match[3].split(',').map(name => name.trim())
    }
    if (match[4]) {
      // 处理同时导入命名模块和默认模块时的默认模块名
      defaultModuleName = match[4]
    }
    const filePath = match[5] || match[6]

    return {
      moduleNames,
      defaultModuleName,
      filePath
    }
  }
  return null
}

/**
 * 0. 处理 import ab from 'ccc' 转换为 const ab = globalThis.appModules['ccc'].default
 * 0. 处理 import from 'ccc' 直接去除
 * 1. import {a, b} from 'ccc' 转换为 const {a, b} = globalThis.appModules['ccc']
 * 2. 将 export  {a, b} 换为 globalThis.appModules['ccc'] = { a, b }
 * 3. 将 export const bb 转换为 globalThis.appModules['ccc'].bb = bb
 * 4. 将 export default {} 换为 globalThis.appModules['ccc'].default = {}
 * @param {*} es6Text
 * @param {*} exportModuleName
 * @returns
 */
function transformES6Text (es6Text, exportModuleName) {
  // 提取 import 语句中的模块名
  const importRegex = /import\s+([\s\S]*?)\s+from\s+(['"])([^'"]+)\2/g
  const importMatches = []
  let match
  while ((match = importRegex.exec(es6Text)) !== null) {
    importMatches.push(match[3])
  }

  if (!globalThis.appModules[exportModuleName]) {
    globalThis.appModules[exportModuleName] = {}
  }

  // 处理 import ab from 'ccc' 转换为 const ab = globalThis.appModules['ccc'].default
  const singleImportRegex = /import\s+(\w+)\s+from\s+(['"])([^'"]+)\2/g
  const transformedSingleImport = es6Text.replace(singleImportRegex, (_, importName, __, source) => {
    const importPath = resolve(exportModuleName, source)
    return `const ${importName} = globalThis.appModules['${importPath}'].default;`
  })

  // 处理 import from 'ccc' 直接去除
  const bareImportRegex = /import\s+(['"])([^'"]+)\1/g
  const transformedBareImport = transformedSingleImport.replace(bareImportRegex, '')

  const transformedImport = transformedBareImport.replace(importRegex, (_, imports, __, source) => {
    // 1. 将 import {a, b} from 'ccc' 转换为 const {a, b} = globalThis.appModules['ccc']
    const importPath = resolve(exportModuleName, source)
    return `const ${imports} = globalThis.appModules['${importPath}'];`
  })
  // 2. 将 export  {a, b} 换为 globalThis.appModules['ccc'] = { a, b }
  const exportNamedRegex = /export\s+(\{[^}]+\})/g
  const exportNamedRegexTransformed = transformedImport.replace(exportNamedRegex, `globalThis.appModules['${exportModuleName}'] = $1;`)

  // 3. 将 export const bb 转换为 globalThis.appModules['ccc'].bb = bb
  const exportConstRegex = /export\s+const\s+(\w+)\s*=/g
  const transformedExportConst = exportNamedRegexTransformed.replace(exportConstRegex, `globalThis.appModules['${exportModuleName}'].$1 = $1;`)

  // 4. 将 export default {} 换为 globalThis.appModules['ccc'].default = {}
  const exportDefaultRegex = /export\s+default\s+(\{[\s\S]*\})/g
  const transformedExportDefault = transformedExportConst.replace(exportDefaultRegex, `globalThis.appModules['${exportModuleName}'].default = $1;`)

  return transformedExportDefault
}

const cleanImports = sourceCode => {
  const importStatements = []
  let updatedSourceCode = sourceCode
  // 改进后的正则表达式，能匹配有解构和无解构的 import 语句
  const importRegex = /\bimport\s+(?:(?:(?:\*\s+as\s+)?[\w$]+|(?:\{[\s\w$*,]+?\}))\s+from\s+)?['"][^'"]+['"];?/gm
  let match
  while ((match = importRegex.exec(sourceCode))) {
    const {
      moduleNames,
      filePath
    } = parseImportStatement(match[0])
    importStatements.push({
      moduleNames,
      filePath
    })
    updatedSourceCode = updatedSourceCode.replace(match[0], '')
  }

  return {
    sourceCode,
    updatedSourceCode,
    importStatements
  }
}

/**
 * 加载远程模块，并返回模块结果
 */
const loadRemoteJsModule = memoize(async (modulePath) => {
  trace('load Remote:', modulePath)

  // 处理外部加载情况
  const moduleVariableName = convertToValidVariableName(modulePath)
  if (globalThis[moduleVariableName]) {
    return globalThis[moduleVariableName]
  }

  if (globalThis[modulePath]) {
    return globalThis.appModules[modulePath]
  }

  let moduleUrl = modulePath
  if (window.RidgeUI && window.RidgeUI.ridgeBaseUrl) {
    const npmPrefix = window.RidgeUI.ridgeBaseUrl
    moduleUrl = addStringPrefix(npmPrefix, modulePath)
  }
  trace('load Remote:', moduleUrl)
  const textContent = `
      import * as currentModule from '${moduleUrl}'
      globalThis.appModules['${moduleUrl}'] = currentModule
    `
  const scriptEl = document.createElement('script')
  scriptEl.type = 'module'
  // scriptEl.baseURI = '/npm'
  return new Promise((resolve, reject) => {
    try {
      globalThis.appModulesNotifier[moduleUrl] = Module => {
        trace('Callback:', moduleUrl)
        if (Module) {
          resolve(Module.default || Module)
        } else {
          resolve(null)
        }
      }
      scriptEl.textContent = textContent
      document.head.append(scriptEl)
    } catch (e) {
      trace('remote js error', e)
      resolve(null)
    } finally {
      // window.onerror = null
      // document.head.removeChild(scriptEl)
    }
  })
})

// 加载js为text，然后执行StoreModule加载
const loadRemoteJsModuleLts = memoize(async (modulePath) => {
  let jsPath = modulePath
  if (window.ridge && window.ridge.baseUrl) {
    jsPath = (window.ridge.baseUrl + '/' + jsPath.replace(/^\/npm/, '').replace(/^\//, ''))
  }

  trace('load Remote:', jsPath)
  return await loadLocalJsModule(jsPath, {
    load: async url => {
      const fetched = await window.fetch(url, {
        mode: 'cors',
        credentials: 'include'
      })

      if (fetched.ok) {
        const jsText = await fetched.text()
        return jsText
      } else {
        return null
      }
    }
  })
})

/**
 * 从当前工作区间（浏览器缓存 或者zip文件之中）加载JS模块
 * 因为本地文件的动态加载，本地文件没有远程url，并且会另外import其他代码， 这个情况下， 需要解析其 import .. from 的部分，然后转换
 * @param {*} filePath 当前工作区间的路径
 * @param {*} loader 加载器，需要提供load方法加载正文内容
 * @returns
 */
const loadLocalJsModule = async (filePath, loader) => {
  // 先使用loader加载代码内容
  const sourceCode = await loader.load(filePath)

  if (sourceCode) {
    // 获取import 的from部分列表
    const { importStatements } = cleanImports(sourceCode)

    for (const importStatment of importStatements) {
      if (importStatment.filePath.startsWith('/')) { // 斜线开头则从本地npm路径加载  使用现在运行的 npm路径
        await loadRemoteJsModule(importStatment.filePath)
      } else {
        // 本地： 则先计算本地的路径（使用resolve）递归调用本地加载
        const targetPath = resolve(filePath, importStatment.filePath)
        await loadLocalJsModule(targetPath, loader)
      }
    }

    // 解析es6到 iifs
    const iifsCode = transformES6Text(sourceCode, filePath)

    const scriptEl = document.createElement('script')
    const textContent = `(function() {
      ${iifsCode}
    })()` //
    scriptEl.textContent = textContent

    try {
      document.head.append(scriptEl)
    } catch (e) {

    } finally {
      document.head.removeChild(scriptEl)
    }
    const ModuleLoaded = globalThis.appModules[filePath]
    if (ModuleLoaded) {
      ModuleLoaded.jsContent = sourceCode
      return ModuleLoaded
    } else {
      return null
    }
  } else {
    return null
  }
}

function loadWebFont (fontUrl) {
  const fontName = generateUrlFontName(fontUrl)

  // 创建 @font-face 样式规则
  const fontFaceRule = `
      @font-face {
          font-family: '${fontName}';
          src: url('${fontUrl}') format('woff2');
          font-weight: normal;
          font-style: normal;
      }
  `
  // 创建一个 style 元素
  const style = document.createElement('style')
  style.type = 'text/css'
  style.textContent = fontFaceRule

  // 将 style 元素添加到 head 中
  document.head.appendChild(style)

  return fontName
}

function loadCss (href) {
  // Create new link Element
  const link = document.createElement('link')

  // set the attributes for link element
  link.rel = 'stylesheet'

  link.type = 'text/css'

  link.href = href

  // Get HTML head element to append
  // link element to it
  document.getElementsByTagName('HEAD')[0].appendChild(link)
}

// 辅助函数：查找已存在的 script 标签
function findExistingScript (url) {
  return Array.from(document.querySelectorAll('script[src]'))
    .find(script => script.src === url)
}

async function loadScript (url) {
  // 验证URL有效性
  if (!url || (typeof url !== 'string')) {
    throw new Error('Invalid script URL provided')
  }

  // 创建基础URL对象进行验证
  let scriptUrl
  try {
    scriptUrl = new URL(url, window.location.href)
  } catch (e) {
    throw new Error(`Malformed script URL: ${url}`)
  }

  // 检查协议安全性
  const secureProtocols = ['https:', 'http:']
  if (!secureProtocols.includes(scriptUrl.protocol)) {
    throw new Error(`Unsupported protocol: ${scriptUrl.protocol}`)
  }

  findExistingScript(url)

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = url

    // 仅当需要跨域时设置crossOrigin
    if (scriptUrl.origin !== window.location.origin) {
      script.crossOrigin = 'anonymous'
    }

    // 成功加载回调
    script.onload = () => {
      window.showError && window.showError(`Script successfully: ${url}`)
      resolve()
    }

    // 加载失败回调
    script.onerror = (event) => {
      window.showError && window.showError(`Failed to load script: ${url}`, event)
      if (script.parentNode) script.parentNode.removeChild(script)
      reject(new Error(`Script load failed: ${url}`))
    }
    // 添加到文档中触发加载
    document.head.appendChild(script)
  })
}

export {
  loadJSON,
  loadCss,
  loadScript,
  loadWebFont,
  loadLocalJsModule,
  loadRemoteJsModule
}
