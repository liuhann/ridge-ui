import debug from 'debug'
import memoize from 'lodash/memoize'

import ridgeExternals from 'ridge-externals'
import { loadRemoteJsModule, loadLocalJsModule, loadCss, loadWebFont, loadScript, loadJSON } from '../utils/load'
import { addStringPrefix, extractComponentPath } from '../utils/string'
const log = debug('ridge:loader')

const trace = window.showError || function () {}

/**
   * 工具方法：根据module名称查找externals配置
   * @param {String} moduleName 模块名（如 react、antd、@douyinfe/semi-ui）
   * @param {Array} externalsList 配置列表（dependencyExternals / packageExternals）
   * @returns {Object|null} 匹配的配置项
   */
const findExternalsConfig = (moduleName, externalsList) => {
  return externalsList.find(item => item.module === moduleName) || null
}

class Loader {
  /**
   * 构造器
   * @param {string} baseUrl  元素下载基础地址
   * @param {string} loadPropControl  加载属性的自定义控制编辑
   */
  constructor (baseUrl, externals = ['/npm/ridge-externals/externals-config.json']) {
    this.baseUrl = baseUrl.replace(/\/$/, '')
    log('RidgeLoader baseUrl: ' + this.baseUrl)

    // 加载的字体列表
    this.loadedFonts = []
    this.themeUrls = {}

    // this.getPackageJSON = memoize(this._getPackageJSON)
    this.loadExternal = memoize(this._loadExternal)
    this.loadJSON = memoize(this.loadJSON)
    this.loadTextContent = memoize(this.loadTextContent)
    this.loadStoreScript = memoize(this.loadStoreScript)
    this.loadLocalJsModule = loadLocalJsModule
    this.loadRemoteJsModule = loadRemoteJsModule
    this.confirmPackageDependencies = memoize(this._confirmPackageDependencies)
    this.loadWebFont = memoize(loadWebFont)
    this.loadCss = loadCss

    this.jsonCache = new Map()
    this.codeCache = new Map()
    this.blobCache = new Map()
  }

  async confirmExternals () {

  }

  getURIPath (resourceUrl) {
    return `${this.baseUrl}/${resourceUrl}`.replace(
      /(https?:\/\/)|(\/)+/g,
      (match, p1, p2) => p1 || '/'
    )
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
  async loadComponent (componentPath) {
    const { packageName, componentPath } = extractComponentPath(componentPath)

    // 查找组件包的externals配置
    const packageConfig = findExternalsConfig(packageName, this.packageExternals)

    if (!packageConfig) {
      console.error('对应组件包未定义:', packageName)
      return null
    }
    const globalVar = packageConfig.root

    const loaded = getComponentFromGlobalVar(globalVar, componentPath)
    if (loaded) {
      return loaded
    }
     // 3. 加载组件包
    await this.loadPackage(packageName)

    return getComponentFromGlobalVar(globalVar, componentPath)
  }

  getComponentFromGlobalVar(globalVar, componentPath) {
    if (window[globalVar]) {
      if (!window[globalVar][componentPath]) {
        console.error('组件在组件包中不存在', packageName, componentPath)
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
  async loadPackage (packageConfig) {
    // 已加载过则直接返回
    if (this.loadedPackages.has(packageConfig.module)) {
      return
    }
    try {
      // 1. 先加载组件包的依赖
      if (packageConfig.dependencies && packageConfig.dependencies.length > 0) {
        await this.loadDependencies(packageConfig.dependencies)
      }
      
      // 2. 加载CSS（如有）
      if (Array.isArray(packageConfig.dist)) {
        for (const distPath  of packageConfig.dist) {
          await this.loadScript(distPath)
        }
      } else if (typeof packageConfig.dist === 'string') {
        await this.loadScript(packageConfig.dist)
      }

      // 4. 标记为已加载
      this.loadedPackages.add(packageConfig.module)
    } catch (error) {
      console.error(`加载组件包 ${packageConfig.module} 失败：`, error)
      throw error
    }
  }

    /**
   * 加载依赖模块（递归加载，处理dependencies依赖链）
   * @param {Array<String>} dependencies 依赖模块名列表（如 ['react', 'react-dom']）
   * @returns {Promise}
   */
  async loadDependencies (dependencies = []) {
    for (const depName of dependencies) {
      // 查找依赖的externals配置
      const depConfig = this.findExternalsConfig(depName, this.dependencyExternals)
      if (!depConfig) {
        throw new Error(`未找到依赖模块 ${depName} 的externals配置`)
      }

      // 先加载当前依赖的子依赖
      if (depConfig.dependencies && depConfig.dependencies.length > 0) {
        await this.loadDependencies(depConfig.dependencies)
      }
      // 加载当前依赖
      await this.loadScript(depConfig.dist)
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

  getFinalCDNUrl (url) {
    let loadUrl = url.replace(/\/\//g, '/')
    if (!loadUrl.startsWith('/')) {
      loadUrl = '/' + loadUrl
    }
    loadUrl = this.baseUrl + loadUrl

    if (loadUrl.startsWith('/') || loadUrl.indexOf('')) {
      // 本地ridge-http服务
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

  /**
   *
   * @param {*} url
   */
  async loadStoreScript (url) {
    return loadRemoteJsModule(url)
  }

  async loadTextContent (url) {
    const loadPath = this.getURIPath(url)
    trace('Fetch:' + loadPath)
    const fetched = await window.fetch(loadPath, {
      mode: 'cors',
      credentials: 'include'
    })

    if (fetched.ok) {
      return await fetched.text()
    } else {
      return null
    }
  }

  async loadJSON (path) {
    const jsonUrl = this.getURIPath(path)

    return await loadJSON(jsonUrl)
  }
}

export default Loader
