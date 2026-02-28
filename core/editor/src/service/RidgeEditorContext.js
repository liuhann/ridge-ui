/* global location */
/* global localStorage */
import Debug from 'debug'
import RidgeContext, { Element, Composite } from 'ridgejs'
import WorkSpaceControl from '../workspace/WorkspaceControl.js'
import { cloneDeep, isEqual } from 'lodash'

import { getNodeListConfig } from '../workspace/editorUtils.js'
import EditorComposite from '../workspace/EditorComposite.js'
import { ensureLeading } from '../utils/string.js'

import { localRepoService } from '../store/app.store.js'
import { removeUrlProtocol } from 'ridgejs/src/utils/string.js'
// import PreviewComposite from '../workspace/PreviewComposite.js'

// import { appService } from '../store/app.store.js'

const debug = Debug('ridge:editor')

const NPM_CDN_SERVER = new URLSearchParams(location.href).get('registry') || localStorage.getItem('registry') || window.baseUrl || 'https://cdn.jsdelivr.net/npm'

// eslint-disable-next-line
// const baseUrl = (location.host.startsWith('localhost') || location.host.startsWith('127.0.0.1')) ? '/npm' : NPM_CDN_SERVER
const baseUrl = NPM_CDN_SERVER

/**
 * 'no-react' service for editor.
 * connect each part and manage state for editor
 **/
class RidgeEditorContext extends RidgeContext {
  constructor () {
    super({ baseUrl: '/npm', loadPropControl: true })
    window.ridge = this
    // Register For Panel

    // this.theme = localStorage.getItem('ridge-theme') || '@douyinfe/semi-ui/dist/css/semi.min.css'
    // this.isLight = localStorage.getItem('ridge-is-light') || true

    // this.services.appService = appService
    // this.services.distributeService = new DistributionService(this)
    // this.services.npmService = new NpmService()

    // 存放配置性数据例如类样式列表等，供配置过程使用
    // this.pluginData = []

    // this.setTheme(this.theme)

    // 保存工作区间打开过的页面列表
    // this.openedFileContentMap = new Map()

    // 页面位置map
    // this.pageTransformMap = new Map()
    // this.checkInterval = setInterval(this.checkModification.bind(this), 2000)
  }

  setTheme (url) {
    this.services.loader.removeCss(localStorage.getItem('ridge-theme'))
    localStorage.setItem('ridge-theme', url)

    this.services.loader.loadCss(this.baseUrl + '/' + url)
  }

  setLight (light) {
    localStorage.setItem('ridge-is-light', light)

    if (light === false || light === 'false') {
      document.body.setAttribute('theme-mode', 'dark')
    } else {
      document.body.setAttribute('theme-mode', 'light')
    }
  }

  setShowContainer (show) {
    if (show) {
      this.workspaceEl.classList.add('show-container')
    } else {
      this.workspaceEl.classList.remove('show-container')
    }
  }

  reload () {
    location.reload(true)
  }

  confirm (msg) {
    const { Editor } = this
    return Editor.confirm(msg)
  }

  async editorDidMount (Editor, workspaceEl, viewPortContainerEl) {
    this.Editor = Editor
    const { appService, npmService } = this.services

    const usp = new URLSearchParams(window.location.search)
    const importPath = usp.get('import')

    if (importPath) { // 从云端导入
      try {
        await Editor.confirm(`你将导入应用包：${importPath}。若工作区已包含内容会被覆盖，是否继续？（你可以先导出到本地磁盘或保存到云端进行备份）`)
        await appService.importFromRidgeCloud(importPath)
        // 创建一个URL对象
        const url = new URL(window.location.href)
        // 设置search属性为空字符串，以去除查询字符串
        url.search = ''
        location.href = url.href
      } catch (e) {
        // Ignore
      }
    }

    const packageName = usp.get('package')
    if (packageName) { // 从npm导入
      const packageInfo = await npmService.getPackage(packageName)
      if (packageInfo['dist-tags'] && packageInfo['dist-tags'].latest) {
        try {
          if (appService.getFileTree().length === 0) {
            this.Editor.setEditorLoadingMessage('正在分析入应用包 ' + packageInfo.description)
            await appService.importFromNpmRegistry(packageName, packageInfo['dist-tags'].latest)
          } else {
            await Editor.confirm(`你将导入应用包：${packageInfo.description}，版本：${packageInfo['dist-tags'].latest}。您工作区已包含内容,您可以先导出应用包到本地后保存后继续，否则当前工作会丢失。是否继续？`)
            await appService.backupCurrentApp()
            await appService.importFromNpmRegistry(packageName, packageInfo['dist-tags'].latest)
          }
          Editor.message('应用包已经导入：' + packageName)

          // 创建一个URL对象
          const url = new URL(window.location.href)
          // 设置search属性为空字符串，以去除查询字符串
          url.search = ''
          location.href = url.href
        } catch (e) {
        // Ignore
        }
      }
    }

    this.viewPortContainerEl = viewPortContainerEl
    this.workspaceEl = workspaceEl

    this.workspaceControl = new WorkSpaceControl()

    this.workspaceControl.init({
      workspaceEl,
      viewPortEl: viewPortContainerEl,
      context: this
    })
    this.Editor.setEditorLoaded()
    this.setShowContainer(true)
  }

  /**
   *  Utils Methods
   **/
  // Check && Guess Element
  getNode (prm) {
    if (prm instanceof Element) {
      return prm
    } else if (typeof prm === 'string') {
      if (this.editorComposite) {
        return this.editorComposite.getNode(prm)
      } else if (this.runtimeView) {
        return this.runtimeView.getNode(prm)
      }
    } else if (prm instanceof Node) {
      return prm.ridgeNode
    }
    return null
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
   * 打开应用下的文件
   */
  async openFile (id) {
    const { appService } = this.services
    const file = await appService.getFile(id)
    if (file) {
      if (file.type === 'page') {
        await this.openNewPage(file)
      } else if (file.mimeType.startsWith('text/')) {
        this.Editor.openInCodeEditor(file)
      } else if (file.mimeType.startsWith('image/')) {
        this.Editor.openImage(file.content)
      }
    }
  }

  async getPageContentById (id) {
    const { appService } = this.services
    const file = await appService.getFile(id)
    if (file && file.type === 'page') {
      return file.content
    }
  }

  /**
   * 在编辑器新标签页打开页面
   * @param {*} page
   */
  async openNewPage (page) {
    if (this.currentOpenPageId && this.currentOpenPageId === page.id) { //
      return
    }

    if (this.currentOpenPageId) {
      this.closeCurrentPage(true)
    }

    this.currentOpenPageId = page.id
    this.openedFileContentMap.set(page.id, page.content)

    this.loadPageInWorkspace(page.id, page.name, page.content)
  }

  // 按路径打开新页面
  async openFileByPath (path) {
    const file = await this.services.appService.getFileByPath(path)
    if (file) {
      await this.openFile(file.id)
    }
  }

  /**
   * 加载页面到编辑器工作区间
   **/
  async loadPageInWorkspace (id, name, content) {
    this.currentOpenPageId = id
    let pageContent = null
    if (content) {
      pageContent = content
      pageContent.name = name
    } else {
      pageContent = this.openedFileContentMap.get(id)
    }

    const { Editor } = this
    Editor.setPageOpened(true)

    const { menuBar } = this.services

    if (this.editorComposite) {
      this.editorComposite.unmount()
    }
    this.editorComposite = new EditorComposite({
      id,
      config: cloneDeep(pageContent),
      context: this
    })
    this.editorComposite.firstPaint(this.viewPortContainerEl)
    menuBar.setOpenPage(id, pageContent.name)

    await this.editorComposite.mount()

    if (!this.workspaceControl.enabled) {
      this.workspaceControl.enable()
    }

    const { configPanel, outlinePanel } = this.services

    configPanel.updatePageConfigFields()
    this.workspaceControl.selectElements([])

    const transform = this.pageTransformMap.get(id)
    if (transform) {
      this.workspaceControl.setTransform(transform)
    } else {
      this.workspaceControl.setTransform({})
    }
    outlinePanel.updateOutline(true)
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
   * Switch Design/Preview Mode
   **/
  async toggleMode () {
    // Design -> Preview
    if (this.editorComposite) {
      await this.saveCurrentPage()
      this.editorComposite.unmount()
      this.editorComposite = null
      this.workspaceControl.disable()
      // toggle editor
      this.Editor.setPreview(true)
      this.loadPreview()
    } else if (this.previewComposite) {
      this.Editor.setPreview(false)
      this.previewComposite.unmount()
      // this.setShowContainer(false)
      await this.loadPageInWorkspace(this.currentOpenPageId)
    }
  }

  /**
   * Focus on page from workspace
   **/
  onPageSelected () {
    const { configPanel, outlinePanel } = this.services
    debug('onPageSelected')
    this.selectedNode = null
    this.sl = null
    configPanel.updatePageConfigFields()
    outlinePanel.setCurrentNode()
  }

  /**
   * 节点选择统一处理： 更新配置面板和大纲面板
   **/
  onElementSelected (node) {
    const { configPanel, outlinePanel } = this.services
    debug('onElementSelected', node)
    if (node) {
      node.selected()
      configPanel.componentSelected(node)
      outlinePanel.setCurrentNode(node)
    } else {
      configPanel.updatePageConfigFields()
      outlinePanel.setCurrentNode(null)
    }
    this.selectedNode = node
    this.sl = node
  }

  /**
   * 元素移除触发
   **/
  onElementRemoved (element) {
    const view = this.getNode(element)
    if (view && this.editorComposite) {
      this.editorComposite.deleteNode(view)
    }
    const { outlinePanel } = this.services
    outlinePanel.updateOutline()
  }

  /**
   * Move end event(from workspace) handler
   **/
  onElementMoveEnd (element) {
    const { configPanel, outlinePanel } = this.services
    const node = this.getNode(element)
    if (node) {
      configPanel.componentSelected(node)
      outlinePanel.updateOutline()
    }
  }

  onFileRenamed (id, newName) {
    if (this.currentOpenPageId === id) {
      this.editorComposite.config.name = newName
      const { configPanel } = this.services

      configPanel.updatePageConfigFields()
    }
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
      const file = localRepoService.getCurrentAppService().getFileByPath(removeUrlProtocol(path) + '.json')
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
      // 加载content以便后续解析
      // if (filePath && filePath.startsWith('/')) {
      //   Module.jsContent = await super.loadFileContent(filePath)
      // }
      return Module
    }
  }

  async loadFileContent (filePath) {
    const inAppPath = filePath.replace('composite://', '')
    const { appService } = this.services
    const file = appService.getFileByPath(inAppPath)
    if (file) {
      if (!file.textContent) {
        file.textContent = await appService.getFileContent(file)
      }
      return file.textContent
    } else {
      return super.loadFileContent(filePath)
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
      return localRepoService.getCurrentAppService().getDataUrl(removeUrlProtocol(url))
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

const ridgeEditorContext = new RidgeEditorContext({ baseUrl, loadPropControl: true })

export default ridgeEditorContext
