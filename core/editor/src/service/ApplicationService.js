import NeCollection from './NeCollection.js'
import debug from 'debug'
import Localforge from 'localforage'
import { blobToDataUrl, dataURLtoBlob, dataURLToString, stringToDataUrl, saveAs } from '../utils/blob.js'
import { getFileTree, filterTree, mapTree } from '../panels/files/buildFileTree.js'
import { basename, dirname, extname, nanoid } from '../utils/string.js'
import { getByMimeType } from '../utils/mimeTypes.js'
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
    this.dataUrlByPath = new Map()
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

  getFile (id) {
    if (id == null) {
      return null
    }
    const filtered = filterTree(this.fileTree, f => (f.path === id || f.id === id))
    return filtered[0]
  }

  async updateAppFileTree (updateContent = true) {
    trace('Update File Tree')
    const files = await this.getFiles()

    if (updateContent) {
      await this.cacheLoacalFileContents(files)
    }
    this.fileTree = getFileTree(files)
  }

  // 更新工作区间图片资源信息
  async cacheLoacalFileContents (files) {
    for (const file of files) {
      if (file.mimeType) {
        if (file.mimeType.indexOf('image') > -1) {
          file.url = await this.store.getItem(file.id)
        }

        if (file.mimeType.indexOf('text') > -1) {
          const dataUrl = await this.store.getItem(file.id)
          file.textContent = await dataURLToString(dataUrl)
          if (file.mimeType === 'text/json') {
            try {
              file.json = JSON.parse(file.textContent)

              if (file.json.version && file.json.elements) { // 页面类型处理
                file.type = 'page'
              }
            } catch (e) {}
          }
        }
      }
    }
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

    await this.updateAppFileTree(false)
    return dir
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
    await this.store.setItem(id, dataUrl)
    let mtype = blob.type || mimeType
    if (!mtype) {
      mtype = getByMimeType(extname(name))
    }

    const inserted = await this.collection.insert({
      id,
      mimeType: mtype,
      size: blob.size,
      name,
      parent: parentId
    })

    await this.updateAppFileTree()
    return inserted
  }

  /**
   * 更新文本类文件内容 （只有问题才可能被更新）
   * @param {*} key
   * @param {*} content
   * @param {*} mimeType
   */
  async updateFileContent (key, content) {
    trace('updateFileContent', key, content)
    const file = this.getFile(key)
    if (file) {
      file.textContent = content
      await this.store.setItem(key, await stringToDataUrl(content, file.mimeType))
      if (file.mimeType === 'text/json') {
        try {
          file.json = JSON.parse(content)
        } catch (e) {}
      }
    }
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

  checkNewNameValid (id, newName) {
    const file = this.getFile(id)

    if (file) {
      const same = this.filterFiles(node => node.parent === file.parent && node.id !== id && node.name === newName)
      if (same.length > 0) {
        return false
      } else {
        return true
      }
    }
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
      await this.updateAppFileTree()
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

      await this.updateAppFileTree(false)
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

  async getFiles (filter) {
    const query = {}
    if (filter) {
      query.name = new RegExp(filter)
    }
    const files = await this.collection.find(query)
    return files
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

  getFileUrl (path) {
    const file = this.getFile(path)

    if (file) {
      return file.url
    } else {
      return null
    }
  }

  /**
   * 递归将目录压缩到zip包中
   * @param {*} zip
   * @param {*} files
   */
  async zipFolder (zip, files) {
    for (const file of files) {
      if (file.type === 'directory') {
        const zipFolder = zip.folder(file.name)
        await this.zipFolder(zipFolder, file.children)
      } else {
        const dataUrl = await this.store.getItem(file.id)
        zip.file(file.name, await dataURLtoBlob(dataUrl))
      }
    }
  }

  async exportAppArchive () {
    const zip = new JSZip()
    const files = await this.getFiles()
    this.fileTree = getFileTree(files)

    await this.zipFolder(zip, this.fileTree)
    const blob = await zip.generateAsync({ type: 'blob' })
    return blob
  }

  async exportPage (id) {
    const document = await this.collection.findOne({
      id
    })
    const content = await this.store.getItem(id)
    if (document && content) {
      saveAs(await dataURLtoBlob(content), document.name)
    }
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
    const jsonFile = this.getFile('/package.json')

    if (jsonFile) {
      try {
        this.appPackageJSONObject = jsonFile.json
        return this.appPackageJSONObject
      } catch (e) {
      }
    }
    return null
  }

  async updateAppPackageJSON (packageJSONObject) {
    const file = await this.getFile('/package.json')
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

    // 其他类型文件，例如图片、脚本
    const mimeType = getByMimeType(ext)
    await this.createFile(parentId, filename, new File([await zipObject.async('blob')], filename, {
      type: mimeType
    }), mimeType)
  }

  async importFromNpmRegistry (packageName, version) {
    return await this.backUpService.importFromNpmRegistry(packageName, version)
  }
}
