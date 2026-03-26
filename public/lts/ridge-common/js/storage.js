class LocalStorageUtil {
  constructor (namespace = 'app') {
    this.namespace = namespace
  }

  _getFullKey (key) {
    return `${this.namespace}:${key}`
  }

  saveObject (key, obj) {
    try {
      localStorage.setItem(this._getFullKey(key), JSON.stringify(obj))
      return true
    } catch (e) {
      console.error('保存失败:', e)
      return false
    }
  }

  getObject (key) {
    try {
      const value = localStorage.getItem(this._getFullKey(key))
      return value ? JSON.parse(value) : null
    } catch (e) {
      console.error('读取失败:', e)
      return null
    }
  }

  deleteObject (key) {
    try {
      localStorage.removeItem(this._getFullKey(key))
      return true
    } catch (e) {
      console.error('删除失败:', e)
      return false
    }
  }

  clearAll () {
    try {
      const prefix = `${this.namespace}:`
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i)
        if (key.startsWith(prefix)) localStorage.removeItem(key)
      }
      return true
    } catch (e) {
      console.error('清空失败:', e)
      return false
    }
  }

  getAllKeys () {
    try {
      const prefix = `${this.namespace}:`
      const keys = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key.startsWith(prefix)) keys.push(key.substring(prefix.length))
      }
      return keys
    } catch (e) {
      console.error('获取键失败:', e)
      return []
    }
  }

  findByField (field, value, isContains = false) {
    try {
      return this.getAllKeys().reduce((acc, key) => {
        const obj = this.getObject(key)
        if (obj && obj[field] !== undefined) {
          const matches = isContains
            ? typeof obj[field] === 'string' && obj[field].includes(String(value))
            : obj[field] === value
          if (matches) acc.push(obj)
        }
        return acc
      }, [])
    } catch (e) {
      console.error('查找失败:', e)
      return []
    }
  }

  getAllObjects () {
    try {
      return this.getAllKeys().map(key => this.getObject(key)).filter(Boolean)
    } catch (e) {
      console.error('获取对象失败:', e)
      return []
    }
  }
}

export default LocalStorageUtil
