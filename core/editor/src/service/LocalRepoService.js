import ApplicationService from './ApplicationService.js'
import NeCollection from './NeCollection.js'

export default class LocalRepoService {
  constructor () {
    this.collection = new NeCollection('ridge.repo.db')
    this.appServices = {}
  }

  // 持久化保存当前App
  async persistanceApp (id, name) {
    const existed = await this.collection.findOne({ id })

    if (!existed) {
      await this.collection.insert({
        id,
        name
      })
    } else {
      await this.collection.update({
        id
      }, {
        name
      })
    }
  }

  async setCurrentApp (id, appService) {
    window.localStorage.setItem('ridge-current-app-id', id)
    this.appServices[id] = appService
  }

  async getCurrentAppId () {
    return window.localStorage.getItem('ridge-current-app-id')
  }

  getAppService (id) {
    if (!this.appServices[id]) {
      this.appServices[id] = new ApplicationService(id)
    }
    return this.appServices[id]
  }

  async removeApp (id) {
    if (id == null) return
    await this.collection.remove({
      id
    })
  }

  async renameApp (id, newName) {
    const existed = await this.collection.findOne({ id })
    if (existed) {
      await this.collection.patch({
        id
      }, {
        name: newName
      })
    }
  }

  async getApp (id) {
    const existed = await this.collection.findOne({ id })
    if (existed) {
      return existed
    } else {
      return null
    }
  }

  async getLocalAppList () {
    return await this.collection.find({})
  }
}
