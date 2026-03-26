/**
 * localStorage工具库，提供对象存储和字段查找功能
 */
class LocalStorageUtil {
  constructor (namespace = 'app') {
    this.namespace = namespace
  }

  /**
     * 生成带命名空间的完整key
     */
  _getFullKey (key) {
    return `${this.namespace}:${key}`
  }

  /**
     * 保存对象到localStorage
     * @param {string} key - 存储的键名
     * @param {Object} obj - 要存储的对象
     */
  saveObject (key, obj) {
    try {
      const fullKey = this._getFullKey(key)
      localStorage.setItem(fullKey, JSON.stringify(obj))
      return true
    } catch (error) {
      console.error('保存对象失败:', error)
      return false
    }
  }

  /**
     * 从localStorage读取对象
     * @param {string} key - 存储的键名
     * @returns {Object|null} - 返回存储的对象，如果不存在则返回null
     */
  getObject (key) {
    try {
      const fullKey = this._getFullKey(key)
      const value = localStorage.getItem(fullKey)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error('读取对象失败:', error)
      return null
    }
  }

  /**
     * 删除指定key的对象
     * @param {string} key - 存储的键名
     */
  deleteObject (key) {
    try {
      const fullKey = this._getFullKey(key)
      localStorage.removeItem(fullKey)
      return true
    } catch (error) {
      console.error('删除对象失败:', error)
      return false
    }
  }

  /**
     * 清空所有命名空间下的对象
     */
  clearAll () {
    try {
      const prefix = `${this.namespace}:`
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i)
        if (key.startsWith(prefix)) {
          localStorage.removeItem(key)
        }
      }
      return true
    } catch (error) {
      console.error('清空所有对象失败:', error)
      return false
    }
  }

  /**
     * 获取所有存储的key
     * @returns {Array<string>} - 返回所有存储的key数组
     */
  getAllKeys () {
    try {
      const prefix = `${this.namespace}:`
      const keys = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key.startsWith(prefix)) {
          keys.push(key.substring(prefix.length))
        }
      }
      return keys
    } catch (error) {
      console.error('获取所有键失败:', error)
      return []
    }
  }

  /**
     * 按字段查找对象
     * @param {string} field - 要查找的字段名
     * @param {any} value - 要查找的值
     * @param {boolean} [isContains=false] - 是否使用包含匹配，默认为精确匹配
     * @returns {Array<Object>} - 返回匹配的对象数组
     */
  findByField (field, value, isContains = false) {
    try {
      const results = []
      const keys = this.getAllKeys()

      for (const key of keys) {
        const obj = this.getObject(key)
        if (obj && obj.hasOwnProperty(field)) {
          const fieldValue = obj[field]

          if (isContains) {
            // 包含匹配
            if (typeof fieldValue === 'string' &&
                            fieldValue.includes(String(value))) {
              results.push(obj)
            }
          } else {
            // 精确匹配
            if (fieldValue === value) {
              results.push(obj)
            }
          }
        }
      }

      return results
    } catch (error) {
      console.error('按字段查找失败:', error)
      return []
    }
  }

  /**
     * 获取所有存储的对象
     * @returns {Array<Object>} - 返回所有存储的对象数组
     */
  getAllObjects () {
    try {
      const objects = []
      const keys = this.getAllKeys()

      for (const key of keys) {
        const obj = this.getObject(key)
        if (obj) {
          objects.push(obj)
        }
      }

      return objects
    } catch (error) {
      console.error('获取所有对象失败:', error)
      return []
    }
  }
}
