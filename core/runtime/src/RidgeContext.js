import './style.css'
import Loader from './loader/Loader.js'
import { loadRemoteJsModule } from './utils/load.js'
import Composite from './node/Composite.js'
import createDebug from 'debug'
import { isObject } from './utils/is.js'
import { ensureLeading } from './utils/string.js'

window.createDebug = createDebug

// createDebug.enable('ridge:context')

const VERSION = '1.5.0'

/**
 * The Ridge Platform Runtime
 */
class RidgeContext {
  /**
   * @param {baseUrl, loadPropControl}
   */
  constructor ({ baseUrl, loadPropControl }) {
    this.VERSION = VERSION
    this.baseUrl = baseUrl

    console.log('Ridge Runtime  Version:' + VERSION + ', baseUrl:' + this.baseUrl)
    // this.loadScript = this.loader.loadScript
    const loader = new Loader({ baseUrl: this.baseUrl, loadPropControl })
    this.loader = loader
    this.services = {
      loader
    }
  }

  /**
   * 解析Composite路径 例如
   * ridge-website/index
   * ridge-editor/page/somae
   * @ridgeui/editor/page/some
   * @param {*} { packageName, compositePath }
   * @returns
   */
  parseRidgePath (path) {
    const paths = path.split('/').filter(t => t)

    if (paths[0].startsWith('@')) {
      if (paths.length >= 3) {
        const [scope, name, ...compositePath] = paths
        return {
          packageName: scope + '/' + name,
          compositePath: compositePath.join('/')
        }
      } else {
        return null
      }
    } else {
      if (paths.length >= 2) {
        const [packageName, ...compositePath] = paths
        return {
          packageName,
          compositePath: compositePath.join('/')
        }
      } else {
        return null
      }
    }
  }

  createCompositeByPath (path, properties = {}) {
    const parsed = this.parseRidgePath(path)

    if (parsed) {
      return new Composite({
        context: this,
        packageName: parsed.packageName,
        compositePath: parsed.compositePath,
        properties
      })
    } else {
      return null
    }
  }

  /**
   * 创建
   * @param {*} packageName
   * @param {*} compositePath
   * @param {*} properties
   * @returns
   */
  createComposite (packageName, compositePath, properties) {
    try {
      return new Composite({
        context: this,
        packageName,
        compositePath: compositePath.startsWith('/') ? compositePath : ('/' + compositePath),
        properties
      })
    } catch (e) {
      console.error('createComposite error', e)
      return null
    }
  }

  /**
   * 加载页面JSON
   * @param {*} packageName 应用包名称
   * @param {*} compositePath 页面路径 (可选) 未填写时，则表示通过 packageName传入的是全路径
   * @returns
   */
  async loadComposite (packageName, compositePath) {
    if (compositePath) { // 包名和页面路径分开
      const path = compositePath.endsWith('.json') ? compositePath : (compositePath + '.json')
      return this.loader.loadJSON(`${packageName}/${path}`)
    } else {
      const url = packageName.endsWith('.json') ? packageName : (packageName + '.json')
      return this.loader.loadJSON(url)
    }
  }

  /**
   * 获取图片、视频等二进制类型的加载地址
   * @param {*} url 地址
   * @param {*} packageName 应用包名称
   * @returns
   */
  getBlobUrl (url, packageName) {
    if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('/')) {
      return url
    } else if (url.startsWith('composite://')) {
      if (packageName) {
        return this.baseUrl + '/' + packageName + ensureLeading(url.substring('composite://'.length))
      } else {
        return this.baseUrl + ensureLeading(url.substring('composite://'.length))
      }
    } else {
      return this.baseUrl + '/' + url
    }
  }

  /**
   * 加载应用的 npm/package.json 对象信息， 主要用途是获取应用全局配置
   * @param {*} packageName
   */
  async loadAppPackageJSON (packageName) {
    const packageJSONObject = await this.loader.getPackageJSON(packageName)

    this.applyPackageObjectSetting(packageJSONObject)

    return packageJSONObject
  }

  async loadFileContent (url) {
    return this.loader.loadTextContent(url)
  }

  /**
   * 加载Ridge Store Module JS 模块
   * @param {*} packageName
   * @param {*} filePath
   * @returns
   */
  async loadModule (packageName, filePath) {
    let jsPath = ''
    if (filePath.startsWith('composite://')) { // 包内脚本： 路径增加packageName
      jsPath = ('/' + packageName + '/' + filePath.substring('composite://'.length)).replace(/\/\//g, '/')
    } else if (filePath.startsWith('/')) { // 外部脚本
      jsPath = filePath
    }
    return loadRemoteJsModule(jsPath)
  }

  async loadScript (url) {
    return this.loader.loadScript(url)
  }

  /**
   * 加载包内提供的插件列表
   * @param {*} pkgName
   */
  async loadPlugin (pkg) {
    let packageJSONObject = pkg
    if (typeof pkg === 'string') {
      packageJSONObject = await this.loader.getPackageJSON(pkg)
    }

    await this.loader.confirmPackageDependencies(packageJSONObject.name)

    if (packageJSONObject.plugin) {
      const plugin = (await loadRemoteJsModule('/' + packageJSONObject.name + '/' + packageJSONObject.plugin)).default
      plugin.packageName = packageJSONObject.name
      return plugin
    }
  }

  /**
   * 为组件提供方法， 使其应用plugin（Effect）提供的功能进行显示优化
   * @param {*} key
   * @param {*} elements
   * @param {*} complete
   */
  async applyEffect (key, elements, complete) {
    try {
      if (!key || typeof key !== 'string') return

      const [packageName, effectValue] = key.split('/')

      const plugin = await this.loadPlugin(packageName)

      if (plugin && plugin.apply) {
        plugin.apply(effectValue, elements, () => {
          complete && complete()
        })
      }
    } catch (e) {
      console.error('Apply Plugin Error', e)
    }
  }

  applyPackageObjectSetting (packageObject) {
    if (packageObject.global && isObject(packageObject.global)) {
      for (const [key, value] of Object.entries(packageObject.global)) {
        if (!globalThis.hasOwnProperty(key)) {
          globalThis[key] = value
        }
      }
    }
  }
}

export default RidgeContext

export {
  RidgeContext,
  VERSION
}
