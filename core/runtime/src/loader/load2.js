class ComponentLoader {
  constructor () {
    // 1. 已加载的包缓存（避免重复加载）
    this.loadedPackages = new Set()

    // 2. 基础依赖 externals 配置（按指定格式）
    this.dependencyExternals = [
      {
        module: 'react',
        root: 'React',
        dist: 'react@18.3.1/umd/react.production.min.js'
      },
      {
        module: 'react-dom',
        dependencies: ['react'],
        root: 'ReactDOM',
        dist: 'react-dom@18.3.1/umd/react-dom.production.min.js'
      }
    ]

    // 3. 组件库 externals 配置（按指定格式，扩展多组件库）
    this.packageExternals = [
      // antd 配置
      {
        module: 'antd',
        root: 'Antd',
        dependencies: ['react', 'react-dom'],
        dist: {
          js: 'antd@5.12.8/dist/antd.min.js',
          css: 'antd@5.12.8/dist/antd.min.css'
        }
      },
      // semi-ui 配置
      {
        module: '@douyinfe/semi-ui',
        root: 'SemiUI',
        dependencies: ['react', 'react-dom'],
        dist: {
          js: '@douyinfe/semi-ui@2.61.0/dist/umd/semi-ui.min.js',
          css: '@douyinfe/semi-ui@2.61.0/dist/css/semi.min.css'
        }
      },
      // ridge-container 配置
      {
        module: 'ridge-container',
        root: 'RidgeContainer',
        dependencies: ['react'],
        dist: {
          js: 'ridge-container@1.2.0/dist/ridge-container.umd.js',
          css: 'ridge-container@1.2.0/dist/ridge-container.css'
        }
      },
      // 可扩展更多组件库
      {
        module: '@arco-design/web-react',
        root: 'ArcoDesign',
        dependencies: ['react', 'react-dom'],
        dist: {
          js: '@arco-design/web-react@2.52.0/dist/arco.min.js',
          css: '@arco-design/web-react@2.52.0/dist/arco.min.css'
        }
      }
    ]

    // CDN 基础地址（可根据环境配置）
    this.cdnBaseUrl = 'https://cdn.jsdelivr.net/npm/'
  }

  /**
   * 工具方法：根据module名称查找externals配置
   * @param {String} moduleName 模块名（如 react、antd、@douyinfe/semi-ui）
   * @param {Array} externalsList 配置列表（dependencyExternals / packageExternals）
   * @returns {Object|null} 匹配的配置项
   */
  findExternalsConfig (moduleName, externalsList) {
    return externalsList.find(item => item.module === moduleName) || null
  }

  /**
   * 解析组件路径，提取包名和组件路径
   * @param {String|Object} componentPath 组件路径（如 antd/Button、{packageName: 'antd', path: 'Button'}）
   * @returns {Object} { packageName, componentPath }
   */
  parseComponentPath (componentPath) {
    let packageName = ''
    let path = ''

    // 处理对象格式入参
    if (typeof componentPath === 'string') {
      const paths = componentPath.split('/').filter(Boolean) // 过滤空字符串
      if (paths.length === 0) {
        throw new Error('组件路径不能为空')
      }

      // 处理作用域包（如 @douyinfe/semi-ui）
      if (paths[0].startsWith('@')) {
        packageName = paths.splice(0, 2).join('/')
        path = paths.join('/')
      } else {
        packageName = paths.splice(0, 1).join('/')
        path = paths.join('/')
      }
    } else {
      throw new Error(`无效的组件路径格式：${componentPath}`)
    }

    if (!packageName || !path) {
      throw new Error(`解析组件路径失败：${JSON.stringify(componentPath)}`)
    }

    return { packageName, componentPath: path }
  }

  /**
   * 拼接完整CDN地址
   * @param {String} distPath dist配置路径（如 react@18.3.1/umd/react.production.min.js）
   * @returns {String} 完整CDN URL
   */
  getFullCdnUrl (distPath) {
    if (distPath.startsWith('http')) {
      return distPath // 已为完整URL，直接返回
    }
    return `${this.cdnBaseUrl}${distPath}`
  }

  /**
   * 加载单个JS文件（通过script标签）
   * @param {String} moduleName 模块名（用于日志）
   * @param {Object} externalsConfig 该模块的externals配置
   * @returns {Promise} 加载成功/失败的Promise
   */
  loadJS (moduleName, externalsConfig) {
    return new Promise((resolve, reject) => {
      const { root, dist } = externalsConfig
      // 已加载过则直接返回
      if (window[root]) {
        resolve()
        return
      }

      const fullUrl = this.getFullCdnUrl(dist)
      const script = document.createElement('script')
      script.src = fullUrl
      script.type = 'text/javascript'
      script.async = true

      // 加载成功回调
      script.onload = () => {
        // 校验全局变量是否存在（确保加载成功）
        if (!window[root]) {
          reject(new Error(`JS加载成功但全局变量 ${root} 未找到：${moduleName}（${fullUrl}）`))
          return
        }
        resolve()
      }

      // 加载失败回调
      script.onerror = () => {
        reject(new Error(`JS加载失败：${moduleName}（${fullUrl}）`))
      }

      document.head.appendChild(script)
    })
  }

  /**
   * 加载单个CSS文件（通过link标签）
   * @param {String} moduleName 模块名（用于日志）
   * @param {String} cssDist css的dist路径
   * @returns {Promise} 加载成功/失败的Promise
   */
  loadCSS (moduleName, cssDist) {
    return new Promise((resolve, reject) => {
      const fullUrl = this.getFullCdnUrl(cssDist)
      // 检查是否已加载过该CSS
      const existingLink = Array.from(document.head.querySelectorAll('link')).find(
        link => link.href === fullUrl
      )
      if (existingLink) {
        resolve()
        return
      }

      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = fullUrl

      link.onload = () => resolve()
      link.onerror = () => reject(new Error(`CSS加载失败：${moduleName}（${fullUrl}）`))

      document.head.appendChild(link)
    })
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
      await this.loadJS(depName, depConfig)
    }
  }

  /**
   * 加载组件包（JS+CSS）
   * @param {String} packageName 包名（如 antd、@douyinfe/semi-ui）
   * @returns {Promise}
   */
  async loadPackage (packageName) {
    // 已加载过则直接返回
    if (this.loadedPackages.has(packageName)) {
      return
    }

    // 查找组件包的externals配置
    const packageConfig = this.findExternalsConfig(packageName, this.packageExternals)
    if (!packageConfig) {
      throw new Error(`未找到组件包 ${packageName} 的externals配置`)
    }

    try {
      // 1. 先加载组件包的依赖
      if (packageConfig.dependencies && packageConfig.dependencies.length > 0) {
        await this.loadDependencies(packageConfig.dependencies)
      }

      // 2. 加载CSS（如有）
      if (packageConfig.dist?.css) {
        await this.loadCSS(packageName, packageConfig.dist.css)
      }

      // 3. 加载JS
      await this.loadJS(packageName, {
        root: packageConfig.root,
        dist: packageConfig.dist.js
      })

      // 4. 标记为已加载
      this.loadedPackages.add(packageName)
    } catch (error) {
      console.error(`加载组件包 ${packageName} 失败：`, error)
      throw error
    }
  }

  /**
   * 从全局变量中获取组件
   * @param {String} packageName 包名
   * @param {String} componentPath 组件路径（如 Button、Tree、flex）
   * @returns {Object} 组件对象
   */
  getComponentFromGlobal (packageName, componentPath) {
    // 查找组件包的externals配置
    const packageConfig = this.findExternalsConfig(packageName, this.packageExternals)
    if (!packageConfig) {
      throw new Error(`未找到组件包 ${packageName} 的externals配置`)
    }
    const globalVar = packageConfig.root

    // 方式1：包全局变量 + 组件名（如 Antd.Button、SemiUI.Tree）
    if (window[globalVar] && window[globalVar][componentPath]) {
      return window[globalVar][componentPath]
    }

    // 方式2：完整路径作为全局变量（如 ridge-container/flex）
    const fullGlobalKey = `${packageName}/${componentPath}`
    if (window[fullGlobalKey]) {
      return window[fullGlobalKey].default || window[fullGlobalKey]
    }

    // 方式3：兼容小驼峰/大驼峰（如 semi-ui 的 tree → Tree）
    const componentNameUpper = componentPath.charAt(0).toUpperCase() + componentPath.slice(1)
    if (window[globalVar] && window[globalVar][componentNameUpper]) {
      return window[globalVar][componentNameUpper]
    }

    throw new Error(`无法从全局变量 ${globalVar} 中获取组件：${packageName}/${componentPath}`)
  }

  /**
   * 核心方法：加载组件
   * @param {String|Object} componentPath 组件路径（如 antd/Button、{packageName: '@douyinfe/semi-ui', path: 'Tree'}）
   * @returns {Promise<Object>} 组件对象
   */
  async loadComponent (componentPath) {
    try {
      // 1. 解析组件路径
      const { packageName, componentPath: compPath } = this.parseComponentPath(componentPath)

      // 2. 先尝试从全局获取（避免重复加载）
      try {
        const component = this.getComponentFromGlobal(packageName, compPath)
        return {
          component,
          packageName,
          componentPath: `${packageName}/${compPath}`,
          loadedFromCache: true
        }
      } catch (e) {
        // 全局未找到，继续加载包
        console.log(`全局未找到组件 ${packageName}/${compPath}，开始加载组件包`)
      }

      // 3. 加载组件包
      await this.loadPackage(packageName)

      // 4. 再次获取组件
      const component = this.getComponentFromGlobal(packageName, compPath)

      return {
        component,
        packageName,
        componentPath: `${packageName}/${compPath}`,
        loadedFromCache: false
      }
    } catch (error) {
      console.error(`加载组件 ${JSON.stringify(componentPath)} 失败：`, error)
      throw error
    }
  }

  /**
   * 扩展externals配置（动态添加新组件库/依赖）
   * @param {String} type 配置类型（'package' | 'dependency'）
   * @param {Object} config 新的externals配置项
   */
  extendExternals (type, config) {
    if (type === 'package') {
      this.packageExternals.push(config)
    } else if (type === 'dependency') {
      this.dependencyExternals.push(config)
    } else {
      throw new Error('扩展类型仅支持 package 或 dependency')
    }
  }

  /**
   * 清除已加载的包缓存（调试用）
   */
  clearLoadedPackages () {
    this.loadedPackages.clear()
  }

  /**
   * 修改CDN基础地址（适配不同环境）
   * @param {String} baseUrl CDN基础地址
   */
  setCdnBaseUrl (baseUrl) {
    this.cdnBaseUrl = baseUrl
  }
}

// 导出单例（避免重复创建实例）
const componentLoader = new ComponentLoader()
export default componentLoader
