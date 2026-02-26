import NeCollection from './NeCollection.js'
import debug from 'debug'
import once from 'lodash/once.js'
// import LowCollection from './LowCollection.js'
import Localforge from 'localforage'
import { blobToDataUrl, dataURLtoBlob, dataURLToString, stringToDataUrl, saveAs } from '../utils/blob.js'
import { getFileTree, eachNode, filterTree, mapTree } from '../panels/files/buildFileTree.js'
import { APP_PACKAGE_JSON, PAGE_JSON_TEMPLATE } from '../utils/template.js'
import axios from 'axios'
import { basename, dirname, extname, formateDate, nanoid } from '../utils/string.js'
import { getByMimeType } from '../utils/mimeTypes.js'
import helloZipApp from '../ridge-app-hello-1.0.0.zip'
import JSZip from 'jszip'

const trace = debug('ridge:app-service')

/**
 * 应用管理服务，用于创建、修改、查询应用下资源（包括页面、图片、音视频、组件包等）
 */
export default class ApplicationService {
  constructor (appId) {
    this.appId = appId
    this.collection = new NeCollection('ridge.app.' + appId)
    this.store = Localforge.createInstance({ name: 'ridge-store-' + appId })
    this.dataUrls = {}
    this.fileTree = null
  }

  getFileTree () {
    return this.fileTree
  }

  mapFileTree (map) {
    return mapTree(this.fileTree, map)
  }

  filterFiles (filter) {
    return filterTree(this.fileTree, filter)
  }

  getFileByPath (path) {
    const filtered = filterTree(this.fileTree, f => f.path === path)
    if (filtered.length > 0) {
      return filtered[0]
    } else {
      return null
    }
  }

  getAppFileTree () {
    return this.fileTree
  }

  async updateAppFileTree () {
    trace('Update File Tree')
    const files = await this.getFiles()
    this.updateFileBlobUrls(files)
    this.fileTree = getFileTree(files)
  }

  // 更新工作区间所有文件类型的二进制
  async updateFileBlobUrls (files) {
    const updateUrls = {}
    for (const file of files) {
      if (file.type !== 'page' && file.type !== 'directory') {
        // 非页面和文件夹
        if (this.dataUrls[file.id]) {
          updateUrls[file.id] = this.dataUrls[file.id]
        } else {
          const dataUrl = await this.store.getItem(file.id)
          updateUrls[file.id] = dataUrl
        }
      }
    }
    this.dataUrls = updateUrls
  }

  async createDirectory (parent, name) {
    trace('createDirectory', parent, name)
    const one = await this.collection.findOne({
      parent,
      name
    })
    if (one) {
      throw new Error('File existed', name)
    }

    const dirObject = {
      parent,
      id: nanoid(10),
      name,
      type: 'directory'
    }
    const dir = await this.collection.insert(dirObject)
    return dir
  }

  /**
   * 增加组合组件（页面）
   * @param {*} parentId
   * @param {*} name
   * @param {*} content
   */
  async createComposite (parentId, name, composite) {
    trace('createComposite', parentId, name)
    const one = await this.collection.findOne({
      parentId,
      name
    })
    if (one) {
      throw new Error('File existed', name)
    }

    const id = nanoid(10)
    const pageContent = composite ?? PAGE_JSON_TEMPLATE

    const pageObject = {
      id,
      name,
      type: 'page',
      parent: parentId,
      mimeType: 'text/json'
    }
    await this.store.setItem(id, pageContent)
    await this.collection.insert(pageObject)
    return pageObject
  }

  /**
   * 新增文件
   * @param {*} file
   * @param {*} dir
   * @returns
   */
  async createFile (parentId, name, blob, mimeType) {
    trace('createFile', parentId, name)
    const one = await this.collection.findOne({
      parent: parentId,
      name
    })
    if (one) {
      throw new Error('File existed', name)
    }

    const id = nanoid(10)
    const dataUrl = await blobToDataUrl(blob, mimeType)
    let isComposite = false
    if (blob.type === 'application/json') {
      const jsonString = await dataURLToString(dataUrl)
      try {
        const jsonContent = JSON.parse(jsonString)
        if (jsonContent.elements && jsonContent.children) {
          isComposite = true
          this.createComposite(parentId, jsonContent.name, jsonContent)
        }
      } catch (e) {}
    }

    if (!isComposite) {
      await this.store.setItem(id, dataUrl)

      let mtype = blob.type || mimeType

      if (!mtype) {
        mtype = getByMimeType(extname(name))
      }

      return await this.collection.insert({
        id,
        mimeType: mtype,
        size: blob.size,
        name,
        parent: parentId
      })
    }
  }

  /**
   * 更新文本类文件内容
   * @param {*} key
   * @param {*} content
   * @param {*} mimeType
   */
  async updateFileContent (key, content, mimeType) {
    trace('updateFileContent', key, content)
    const file = this.filterFiles(file => file.id === key)[0]
    if (file) {
      file.textContent = content
      await this.store.setItem(key, await stringToDataUrl(content, file.mimeType))
    }
  }

  /**
     * 保存页面配置
     */
  async savePageContent (id, content) {
    // await this.collection.patch({ id }, {})
    await this.store.setItem(id, content)
  }

  /**
   * 资源重新命名
   * @param {*} id
   * @param {*} newName
   * @returns
   */
  async rename (id, newName) {
    const existed = await this.collection.findOne({ id })
    if (!existed) {
      return -1
    }

    if (existed.name === newName) {
      return 0
    }

    const nameDuplicated = await this.collection.findOne({
      parent: existed.parent,
      name: newName
    })

    if (nameDuplicated) {
      return -1
    }

    await this.collection.patch({ id }, {
      name: newName
    })
    return 1
  }

  async checkNewNameValid (parentId, newName) {
    const nameDuplicated = await this.collection.findOne({
      parent: parentId,
      name: newName
    })
    return nameDuplicated
  }

  /**
   * 移动到新的目录
   */
  async move (id, newParent) {
    const existed = await this.collection.findOne({ id })

    if (existed.parent === newParent) {
      return false
    }

    const nameDup = await this.collection.findOne({ parent: newParent, name: existed.name })
    if (!nameDup) {
      await this.collection.patch({ id }, {
        parent: newParent
      })
      await this.updateAppFileTree(true)
      return true
    } else {
      return false
    }
  }

  async copy (id) {
    const existed = await this.collection.findOne({ id })

    if (existed) {
      const newId = nanoid(10)
      const newObject = {
        id: newId,
        name: existed.name + '_' + newId,
        type: existed.type,
        parent: existed.parent,
        mimeType: existed.mimeType,
        copyFrom: id
      }
      await this.collection.insert(newObject)
      const content = await this.store.getItem(existed.id)
      if (content) {
        await this.store.setItem(newId, content)
      }
      await this.updateAppFileTree(true)
    }
  }

  // 删除一个节点到回收站
  async deleteFile (id) {
    let file = null
    if (typeof id === 'string') {
      file = await this.collection.findOne({ id })
    } else {
      file = id
    }

    if (file) {
      if (file.type !== 'directory') {
        await this.store.removeItem(file.id)
      }
      // 递归删除
      const children = await this.collection.find({
        parent: file.id
      })
      if (children.length) {
        for (const child of children) {
          await this.deleteFile(child.id)
        }
      }
      await this.collection.remove({ id: file.id })
      return true
    } else {
      return false
    }
  }

  async deleteFileByPath (path) {
    const file = await this.getFileByPath(path)

    if (file) {
      return await this.deleteFile(file)
    } else {
      return false
    }
  }

  async savePackageJSONObject (packageObject) {
    const file = this.getFileByPath('/package.json')
    await this.updateFileContent(file.key, JSON.stringify(packageObject, null, 2))
  }

  async publishApp (isPublishToNpm) {
    const appBlob = await this.getAppPackageBlob()
    const formData = new FormData()
    formData.append('file', appBlob)
    const publicAppResult = await axios.post(`/api/npm/publish?npm=${!!isPublishToNpm}`, formData)
    return {
      message: publicAppResult.data.msg,
      type: publicAppResult.data.code !== 200 ? 'error' : 'success'
    }
  }

  async getFiles (filter) {
    const query = {}
    if (filter) {
      query.name = new RegExp(filter)
    }
    const files = await this.collection.find(query)
    return files
  }

  // 根据id或者path获取文件
  async getFile (id) {
    trace('getFile', id)
    let file = await this.collection.findOne({ id })

    if (!file) {
      file = this.getFileByPath(id)
    } else {
      if (file.type !== 'directory') {
        file.content = await this.store.getItem(file.id)
        // 读取文本类型的内容写入 file.textContent
        if (file.mimeType && file.mimeType.startsWith('text') && typeof file.content === 'string' && file.content.startsWith('data:')) {
          const textContent = await (dataURLToString(file.content))
          trace('textContent', textContent)
          file.textContent = textContent
        }
      }
      return file
    }
  }

  /**
   * 确保当前目录存在
   * @param {*} filePath
   */
  async ensureDir (filePath) {
    const parentNames = filePath.split('/')
    let parentId = -1
    let currentFile = null

    for (const fileName of parentNames) {
      if (fileName) {
        currentFile = await this.collection.findOne({
          parent: parentId,
          name: fileName
        })
        if (currentFile == null) {
          currentFile = await this.createDirectory(parentId, fileName)
        }
        parentId = currentFile.id
      }
    }
    return currentFile
  }

  async getRecentPage () {
    // 首先更新页面目录数据
    const pages = await this.collection.find({
      parent: -1,
      type: 'page'
    }, {
      sort: {
        name: 1
      }
    })
    if (pages.length === 0) {
      return this.createPage(-1)
    } else {
      return {
        ...pages[0],
        ...(await this.store.getItem(pages[0].id))
      }
    }
  }

  /**
   * 根据文件获取文件所在路径
   */
  async getFilePath (file) {
    if (file.parent && file.parent !== -1) {
      const parentFile = await this.getFile(file.parent)
      return (await this.getFilePath(parentFile)) + '/' + file.name
    } else {
      return file.name
    }
  }

  async getByMimeType (mime) {
    const files = await this.collection.find({
      mimeType: new RegExp(mime)
    })
    for (const file of files) {
      if (file.type === 'file') {
        file.src = await this.store.getItem(file.id)
      }
    }
    return files
  }

  async isParent (parent, child) {
    let lop = await this.getFile(child)
    while (lop.parent !== -1) {
      if (lop.parent === parent) {
        return true
      }
      lop = await this.getFile(lop.parent)
    }
    return false
  }

  async updateDataUrl () {
    const images = await this.getByMimeType('image')
    for (const image of images) {
      this.dataUrls[image.id] = image.dataUrl
    }
  }

  getDataUrl (path) {
    if (path.startsWith('/')) {
      const file = this.getFileByPath(path)
      if (file) {
        return this.dataUrls[file.id]
      } else {
        return null
      }
    } else {
      return this.dataUrls[path]
    }
  }

  async getFileContent (file) {
    const dataUrl = await this.store.getItem(file.key)

    if (file.mimeType && file.mimeType.indexOf('text') > -1) {
      return await dataURLToString(dataUrl)
    } else {
      return await dataURLtoBlob(dataUrl)
    }
  }

  async getFileContentByPath (filePath) {
    const file = this.getFileByPath(filePath)
    if (file) {
      return await this.getFileContent(file)
    } else {
      return null
    }
  }

  async exportFileArchive (id) {
    await this.backUpService.exportFileArchive(id)
  }

  async getAppFileBlob () {
    return this.backUpService.getAppBlob()
  }

  async exportAppArchive () {
    await this.backUpService.exportAppArchive()
  }

  async exportPage (id) {
    const document = await this.collection.findOne({
      id
    })
    const content = await this.store.getItem(id)

    if (content) {
      if (document.type === 'page') {
        saveAs(new Blob([JSON.stringify(content)]), document.name + '.json')
      } else {
        saveAs(await dataURLtoBlob(content), document.name)
      }
    }
  }

  async getAppPackageBlob () {
    return this.backUpService.getAppBlob()
  }

  async reset () {
    await this.backupCurrentApp()
    await this.collection.clean()
    await this.store.clear()

    window.location.reload()
    // location.href = location.href
  }

  /**
     * 导入应用的存档
     * @param {*} file 选择的文件
     * @param {*} appService 应用管理服务
     */
  async importAppArchive (file) {
    const zip = new JSZip()

    try {
      await zip.loadAsync(file)
    } catch (e) {
      console.error('invalid zip file', e)
      return false
    }

    await this.collection.clean()
    await this.store.clear()
    const fileMap = []
    zip.forEach(async (filePath, zipObject) => {
      fileMap.push({
        filePath,
        zipObject
      })
    })

    for (const { filePath, zipObject } of fileMap) {
      if (!zipObject.dir) {
        await this.importZipEntryFile(filePath, zipObject)
      } else {
        await this.ensureDir(filePath)
      }
    }

    await this.updateAppFileTree()
    this.appPackageJSONObject = await this.getAppPackageJSON()

    if (!this.appPackageJSONObject) {
      await this.updateAppPackageJSON({
        name: 'ridge-' + this.appId,
        version: '1.0.0',
        description: '未命名应用'
      })
    }
    this.appPackageJSONObject = await this.getAppPackageJSON()
  }

  async getAppPackageJSON () {
    if (this.appPackageJSONObject) {
      return this.appPackageJSONObject
    }
    const jsonContent = await this.getFileContentByPath('/package.json')
    if (jsonContent) {
      try {
        this.appPackageJSONObject = JSON.parse(jsonContent)
        return this.appPackageJSONObject
      } catch (e) {
      }
    }
    return null
  }

  async updateAppPackageJSON (packageJSONObject) {
    const file = await this.getFileByPath('/package.json')
    if (!file) {
      await this.createFile(-1, 'package.json', new File([JSON.stringify(packageJSONObject, null, 2), 'package.json']), 'text/json')
    } else {
      await this.updateFileContent(file.id, JSON.stringify(packageJSONObject, null, 2))
    }
    this.appPackageJSONObject = packageJSONObject
  }

  /**
   * 导入单个文件(zipEntry)到当前应用
   * @param {*} filePath
   * @param {*} zipObject
   */
  async importZipEntryFile (filePath, zipObject) {
    const dirNode = await this.ensureDir(dirname(filePath))
    const parentId = dirNode ? dirNode.id : -1
    const filename = basename(zipObject.name)
    const ext = extname(zipObject.name)
    if (filePath.endsWith('.json')) { // 对json文件判断是否为图纸，是图纸则导入
      const jsonObject = JSON.parse(await zipObject.async('text'))
      if (jsonObject.elements) {
        await this.createComposite(parentId, basename(filename, '.json'), jsonObject)
      } else {
        await this.createFile(parentId, filename, new File([JSON.stringify(jsonObject, null, 2)], filename), 'text/json')
      }
    } else {
      // 其他类型文件，例如图片、脚本
      const mimeType = getByMimeType(ext)
      await this.createFile(parentId, filename, new File([await zipObject.async('blob')], filename, {
        type: mimeType
      }), getByMimeType(ext))
    }
  }

  async importHelloArchive () {
    const response = await fetch(helloZipApp)
    const buffer = await response.arrayBuffer()
    await this.importAppArchive(buffer)
  }

  async backupCurrentApp () {
    await this.backUpService.backup()
  }

  async importFromNpmRegistry (packageName, version) {
    await this.backupCurrentApp()
    return await this.backUpService.importFromNpmRegistry(packageName, version)
  }

  async importFromRidgeCloud (path) {
    await this.backupCurrentApp()
    return await this.backUpService.importFromRidgeCloud(path)
  }

  async backUpAppArchive (tag) {
    await this.backUpService.createHistory(this.collection, tag)
  }

  async recoverBackUpAppArchive (id) {
    await this.backUpService.recover(id)
  }

  async getAllBackups () {
    return await this.backUpService.listAllHistory()
  }

  async removeBackup (id) {
    return await this.backUpService.deleteHistory(id)
  }

  async exportArchive () {
    this.backUpService.exportColl(this.collection)
  }

  async archive () {

  }
}
