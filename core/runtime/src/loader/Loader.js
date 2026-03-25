import debug from 'debug'
import memoize from 'lodash/memoize'

import { loadCss, loadWebFont, loadScript, loadJSON } from '../utils/load'
import { addStringPrefix, extractPackageAndPath } from '../utils/string'
const log = debug('ridge:loader')

const trace = window.showError || function () {}

class Loader {
  /**
   * 构造器
   * @param {string} baseUrl  元素下载基础地址
   * @param {string} loadPropControl  加载属性的自定义控制编辑
   */
  constructor (baseUrl, registries = ['ridge-externals/registry.json']) {
    this.baseUrl = baseUrl.replace(/\/$/, '')
    log('RidgeLoader baseUrl: ' + this.baseUrl)

    // this.getPackageJSON = memoize(this._getPackageJSON)
    this.loadPackageMemoized = memoize(this.loadPackage)
    this.loadWebFont = memoize(loadWebFont)
    this.confirmExternalsMemoized = memoize(this.confirmExternals)
    this.packageMap = null
    this.registries = registries
    this.loadCss = loadCss
  }

  async confirmExternals () {
    if (!this.packageMap) {
      this.packageMap = new Map()
      for (const registry of this.registries) {
        const packagesLoaded = await this.loadJSON(registry)
        if (Array.isArray(packagesLoaded)) {
          for (const pkg of packagesLoaded) {
            this.packageMap.set(pkg.module, pkg)
          }
        }
      }
    }
  }

  /**
   * 加载组件， 路径为 ${npmPackageName}/${componentId}
   * 例如
   * ridge-container/flex
   * antd/Button
   * @douyinfe/semi-ui/Tree
   * 首先加载组件包完整dist， 然后通过其全局变量获取组件 例如 SemiUI.Tree / Antd.Button 等
   * 其中下载dist地址会有额外映射表维护 例如 antd 需要下载 js和css 另外还有依赖的react
   * 另外，因为组件包有多个组件，组件包依赖只加载一次
   * @param {String} componentPath 组件路径
   */
  async loadComponent (path) {
    await this.confirmExternalsMemoized()
    const { packageName, componentPath } = extractPackageAndPath(path)

    const loaded = this.getComponentFromGlobalVar(packageName, componentPath)
    if (loaded) {
      return loaded
    }
    // 3. 加载组件包
    await this.loadPackageMemoized(packageName)
    return this.getComponentFromGlobalVar(packageName, componentPath)
  }

  getComponentFromGlobalVar (packageName, componentPath) {
    // 查找组件包的externals配置
    const packageConfig = this.packageMap.get(packageName)

    if (!packageConfig) {
      console.error('对应组件包未定义:', packageName)
      return null
    }
    const globalVar = packageConfig.root

    if (window[globalVar]) {
      if (!window[globalVar][componentPath]) {
        console.error('组件在组件包中不存在', globalVar, componentPath)
        return null
      } else {
        return window[globalVar][componentPath]
      }
    } else {
      return null
    }
  }

  /**
   * 加载组件包（JS+CSS）
   * @param {String} packageName 包名（如 antd、@douyinfe/semi-ui）
   * @returns {Promise}
   */
  async loadPackage (packageName) {
    const packageConfig = this.packageMap.get(packageName)
    if (!packageConfig) return

    // 根存在也就不再加载
    const globalVar = packageConfig.root
    if (window[globalVar]) {
      return
    }
    try {
      // 1. 先加载组件包的依赖
      if (packageConfig.dependencies && packageConfig.dependencies.length > 0) {
        const promisedLoading = []
        for (const dependency of packageConfig.dependencies) {
          promisedLoading.push(this.loadPackageMemoized(dependency))
        }
        await Promise.all(promisedLoading)
      }
      if (Array.isArray(packageConfig.dist)) {
        for (const distPath of packageConfig.dist) {
          await this.loadScript(distPath)
        }
      } else if (typeof packageConfig.dist === 'string') {
        await this.loadScript(packageConfig.dist)
      }
    } catch (error) {
      console.error(`加载组件包 ${packageConfig.module} 失败：`, error)
      throw error
    }
  }

  removeCss (href) {
    if (!href) return
    const links = Array.from(document.head.children).filter(node => node.tagName.toLowerCase() === 'link')

    for (const link of links) {
      if (link.href.endsWith(href)) {
        document.head.removeChild(link)
      }
    }
  }

  /**
   * 给定一个资源地址，基于基础地址（npm根）下载资源
   * @param {*} url
   * @returns
   */
  async loadScript (url) {
    if (url == null) {
      return
    }
    try {
      const loadUrl = addStringPrefix(this.baseUrl, url)

      // script和link标签具体相同结尾的：不重复加载
      if (Array.from(document.querySelectorAll('script')).find(script => script.src && script.src.endsWith(loadUrl)) ||
        Array.from(document.querySelectorAll('link')).find(script => script.href && script.href.endsWith(loadUrl))) {
        log('Script loaded: ', loadUrl)
        return loadUrl
      }

      trace('Load:' + loadUrl)
      if (loadUrl.endsWith('.css')) {
        await loadCss(loadUrl)
      } else if (loadUrl.endsWith('.js')) {
        await loadScript(loadUrl)
      }
      return loadUrl
    } catch (e) {
      console.error('JS Load Error:', `${url}`)
    }
  }

  async loadJSON (path) {
    return await loadJSON(addStringPrefix(this.baseUrl, path))
  }
}

export default Loader
