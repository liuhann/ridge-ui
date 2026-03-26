export default {
  name: 'ClickCopy',
  state: {
    pastingList: [],
    loading: false,
    sortType: 'newest'
  },

  computed: {
    itemText: scope => scope.item.text // 单项文本
  },

  setup () {
    // 组件创建时加载本地存储的数据
    this.loadFromStorage()
  },

  actions: {
    // 从剪贴板添加内容到列表
    async addFromClipboard () {
      try {
        this.loading = true
        // 读取剪贴板内容
        const text = await navigator.clipboard.readText()

        if (!text.trim()) {
          this.showNotification('剪贴板内容为空', 'warning')
          return
        }

        // 添加到列表
        this.addToPastingList(text)
      } catch (error) {
        console.error('无法访问剪贴板:', error)
      } finally {
        this.loading = false
      }
    },

    // 添加文本到列表
    addToPastingList (text) {
      // 检查是否已有相同内容
      const existingIndex = this.pastingList.findIndex(item => item.text === text)
      if (existingIndex !== -1) {
        // 如果有，移除原有项
        this.pastingList.splice(existingIndex, 1)
      }

      // 添加新项到列表
      this.pastingList.unshift({
        text,
        time: new Date().toISOString()
      })
      this.showNotification('剪切板内容已经添加')
      // 保存到本地存储
      this.saveToStorage()
    },

    // 复制文本到剪贴板
    async copyToClipboard (scope) {
      try {
        this.loading = true
        // 写入剪贴板
        await navigator.clipboard.writeText(scope.item.text)
        this.showNotification('已复制到剪贴板', 'success')
      } catch (error) {
        console.error('无法复制到剪贴板:', error)
        this.showNotification('复制失败', 'error')
      } finally {
        this.loading = false
      }
    },

    // 删除单个项目
    deleteItem (scope) {
      const index = scope.i
      this.pastingList.splice(index, 1)
      this.saveToStorage()
    },

    // 清空所有项目
    clearAll () {
      if (confirm('确定要清空所有剪贴板历史吗？')) {
        this.pastingList = []
        this.saveToStorage()
      }
    },

    // 导出数据
    exportData () {
      const dataStr = JSON.stringify(this.pastingList, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)

      const a = document.createElement('a')
      a.href = url
      a.download = `clipboard-history-${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      this.showNotification('已导出数据', 'success')
    },

    showNotification (msg) {
      if (window.SemiUI) {
        const { Toast } = window.SemiUI
        Toast.success(msg)
      } else {
        alert(msg)
      }
    },

    // 导入数据
    importData ([file]) {
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          if (Array.isArray(data)) {
            this.pastingList = data
            this.saveToStorage()
            this.showNotification('已导入数据', 'success')
          } else {
            throw new Error('无效的数据格式')
          }
        } catch (error) {
          console.error('导入失败:', error)
          this.showNotification('导入失败，无效的文件格式', 'error')
        }
      }
      reader.readAsText(file)
    },

    // 保存到本地存储
    saveToStorage () {
      try {
        localStorage.setItem('clipboard_history', JSON.stringify(this.pastingList))
      } catch (error) {
        console.error('无法保存到本地存储:', error)
      }
    },

    // 从本地存储加载
    loadFromStorage () {
      try {
        const data = localStorage.getItem('clipboard_history')
        if (data) {
          this.pastingList = JSON.parse(data)
        }
      } catch (error) {
        console.error('无法从本地存储加载:', error)
        this.pastingList = []
      }
    },

    // 格式化日期
    formatDate (dateString) {
      const date = new Date(dateString)
      return date.toLocaleString()
    }
  }
}
