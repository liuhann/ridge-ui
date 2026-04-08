import debug from 'debug'

/**
 * 'no-react' service for editor.
 * connect each part and manage state for editor
 **/
class RidgeEditorContext {
  constructor () {
  }

  /**
   * 加载应用之下所有组件包定义文件(package.json)
   */
  async loadAppPackages () {
    const { appService } = this.services
    const appPackageObject = await appService.getPackageJSONObject()
    if (appPackageObject == null) {
      return []
    }
    const packageNames = Object.keys(appPackageObject.dependencies)
    const packagesLoading = []
    // Load Package
    for (const pkname of packageNames) {
      packagesLoading.push(await this.services.loader.getPackageJSON(pkname))
    }
    await Promise.allSettled(packagesLoading)
    const loadedPackages = packagesLoading.filter(n => n != null).map(pkg => {
      pkg.componentLoaded = false
      return pkg
    })

    loadedPackages.forEach(pkg => {
      // 加载主题
      if (pkg.themes) {
        if (appPackageObject.themes && appPackageObject.themes[pkg.name]) {
          this.services.loader.loadPackageTheme(pkg.name, appPackageObject.themes[pkg.name])
        } else if (pkg.themes.default) {
          this.services.loader.loadPackageTheme(pkg.name, pkg.themes.default)
        }
      }
    })
    this.uiPackages = loadedPackages.filter(pkg => pkg.ridgeDist || pkg.components)
    this.pluginPackages = loadedPackages.filter(pkg => pkg.plugin)
    this.storePackages = loadedPackages.filter(pkg => pkg.ridgeStores)

    this.appPackageObject = appPackageObject
    this.applyPackageObjectSetting(this.appPackageObject)
    return {
      loadedPackages: this.uiPackages,
      appPackageObject
    }
  }

  /**
   * Load current page to preview mode
   **/
  async loadPreview () {
    // load view
    // this.setShowContainer(false)
    this.previewComposite = new Composite({
      config: this.pageContent,
      context: this
    })

    await this.previewComposite.initialize()
    await this.previewComposite.mount(document.querySelector('.preview-view-port'))
  }

  /**
   * 创建新的组件实例
   * @param {*} definition 组件定义
   * @param {*} opts 组件属性
   * @returns
   */
  createElement (definition, opts) {
    const div = document.createElement('div')
    const ridgeNode = this.editorComposite.createNewElement(definition, opts, opts.props)
    ridgeNode.mount(div)

    // 只有mount后才能append
    this.editorComposite.appendChild(ridgeNode)
    this.editorComposite.onEditorElementCreated(ridgeNode)

    return ridgeNode
  }

  /**
   * 组件配置属性变更
   **/
  /**
   *
   * @param {Element} element 组件实例
   * @param {*} configValues 配置信息（全量）
   * @param {*} fieldUpdate 更新字段
   */
  updateComponentConfig (element, configValues, fieldUpdate) {
    const config = cloneDeep(configValues)
    const titleChanged = config.title !== element.config.title

    const slotChanged = element.updateConfig(config, fieldUpdate)

    if (titleChanged || slotChanged) {
      const { outlinePanel } = this.services
      outlinePanel.updateOutline()
      this.editorComposite.loadStore()
    }

    this.workspaceControl.updateMovable()
  }

  async onCodeEditComplete (id, code) {
    const file = await this.services.appService.getFile(id)

    if (!file) {
      return false
    }

    if (file.name === 'package.json') {
      try {
        const json = JSON.parse(code)
        if (json.name) {
          await this.services.appService.updateFileContent(id, code)
        }
      } catch (e) {
        console.error('parse package.json error', e)
        return false
      }
    } else {
      await this.services.appService.updateFileContent(id, code)
    }
    if (this.editorComposite) {
      await this.editorComposite.refresh()
    }
    return true
  }

  /**
   * 检查页面改动，改变时通知menubar
   */
  async checkModification () {
    if (this.editorComposite) {
      try {
        const pageJSONObject = this.editorComposite.exportPageJSON()
        const pageContent = await this.getPageContentById(this.currentOpenPageId)

        this.isModified = !isEqual(pageJSONObject, pageContent)

        this.services.menuBar && this.services.menuBar.setPageChanged(this.isModified)
      } catch (e) {}
    }

    this.isModified = true
  }

  /**
   * 保存当前正编辑页面
   */
  async saveCurrentPage () {
    if (this.editorComposite) {
      const { appService } = this.services

      let pageJSONObject = null
      try {
        pageJSONObject = this.editorComposite.exportPageJSON()
      } catch (e) {
        await this.confirm('页面保存出现错误，继续将丢失一些错误的组件， 是否继续')
        pageJSONObject = this.editorComposite.exportPageJSON()
      }

      if (pageJSONObject) {
        debug('Save Page ', pageJSONObject)
        try {
          this.pageContent = pageJSONObject
          this.openedFileContentMap.set(this.currentOpenPageId, pageJSONObject)

          await appService.savePageContent(this.currentOpenPageId, pageJSONObject)
          this.services.menuBar.setPageChanged(false)
        } catch (e) {
          console.error('save page error', e)
        }
      }
    }
  }

  /**
   * 关闭当前页面，支持保持，如果保持的话可以直接切换
   * @param {*} keep 是否保持
   */
  closeCurrentPage (keep) {
    if (keep) {
      this.openedFileContentMap.set(this.currentOpenPageId, this.editorComposite.exportPageJSON())
      this.pageTransformMap.set(this.currentOpenPageId, this.workspaceControl.getTransform())
    } else {
      this.openedFileContentMap.delete(this.currentOpenPageId)
    }
    if (this.editorComposite) {
      this.editorComposite.unmount()
    }
    this.currentOpenPageId = null
    this.editorComposite = null
    this.workspaceControl.disable()

    if (this.openedFileContentMap.size === 0) {
      this.Editor.setPageOpened(false)
    }
    // this.Editor.togglePageClose()
  }

  getOpenedFileMap () {
    return this.openedFileContentMap
  }

  getSelectedNode () {
    return this.selectedNode
  }

  getLocaleText (text) {
    return text
  }

  // 判断是否是预览模式
  isPreviewMode () {
    return this.previewComposite != null
  }

  /**
   * 加载composite页面
   * @param {*} packageName 所在pkg名称
   * @param {*} path 页面路径
   * @returns
   */
  async loadComposite (packageName, path) {
    if (packageName != null) { // 包含包名说明来自外部
      return super.loadComposite(packageName, path)
    } else if (path != null) {
      const file = localRepoService.getCurrentAppService().getFile(removeUrlProtocol(path) + '.json')
      if (file && file.json) {
        return file.json
      }
    }
  }

  /**
   * 加载应用的 npm/package.json 对象信息， 主要用途是获取应用全局配置
   * @param {*} packageName
   */
  async loadAppPackageJSON (packageName) {
    if (packageName != null) {
      return super.loadAppPackageJSON(packageName)
    } else {
      return await this.services.appService.getPackageJSONObject()
    }
  }

  /**
   * @override
   * 编辑器情况下加载jsStore模块
   * @param {*} packageName 包名，编辑器本地暂时不需要
   * @param {*} filePath 文件地址
   */
  async loadModule (packageName, filePath) {
    if (packageName == null && filePath.startsWith('composite://')) {
      // 获取前端编辑应用的脚本
      const { appService } = this.services
      const inAppPath = filePath.replace('composite://', '')

      const Module = await this.loader.loadLocalJsModule(inAppPath, {
        load: async filePath => {
          return appService.getFileContentByPath(filePath)
        }
      })
      if (Module) {
        if (Module.default && Module.default.name) {
          Object.assign(Module, Module.default)
        }
        Module.jsContent = await appService.getFileContentByPath(inAppPath)
        return Module
      } else {
        return null
      }
    } else {
      // 服务端脚本
      const Module = await super.loadModule(packageName, filePath)
      return Module
    }
  }

  /**
   * 获取图片地址： 编辑情况下直接读取本地localStorage下的图片base64
   * @override
   * @param {*} url 图片配置地址
   * @returns base64图片字符串
   */
  getBlobUrl (url, packageName) {
    if (url.startsWith('composite://') && packageName == null) {
      return localRepoService.getCurrentAppService().getFileUrl(removeUrlProtocol(url))
    } else {
      return super.getBlobUrl(url, packageName)
    }
  }

  /**
   * 获取节点列表的配置数据
   * @param {*} nodes
   */
  onCopyNodes (nodes) {
    this.copied = getNodeListConfig(nodes)
  }

  /**
   * 粘贴节点
   */
  async onPasteNodes () {
    if (this.copied && this.copied.length) {
      const els = []
      for (const copiedNode of this.copied) {
        const element = await this.editorComposite.importNewElement(copiedNode)
        if (this.selectedNode && this.selectedNode.isContainer()) {
          this.selectedNode.appendChild(element)
        } else {
          this.editorComposite.appendChild(element)
          element.updateStyleConfig({
            y: element.config.style.y + 10,
            x: element.config.style.x + 10
          })
        }
        els.push(element.el)
      }
      this.workspaceControl.selectElements(els)
    }
  }
}

const ridgeEditorContext = new RidgeEditorContext({ baseUrl: '/npm', loadPropControl: true })

export default ridgeEditorContext
