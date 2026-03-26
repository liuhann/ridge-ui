export default {
  name: 'ImageSelectStore',
  state: () => {
    return {
      modalOpen: false,
      appDirTree: [],
      appDirName: '',
      fileInfoById: {},
      appDirImageList: [],
      listImagePath: '',
      currentImagePath: '',
      currentListSelectedIndex: -1,
      tabList: [{
        label: '在线地址',
        value: 'remoteUrl'
      }, {
        label: '从当前应用选择',
        value: 'inApp'
      }],
      currentTab: 'remoteUrl'
    }
  },

  computed: {
    itemImgSrc: scope => scope.item.srcUrl,
    deleteBtnVisible: {
      get () {
        return this.currentImagePath !== ''
      },
      dependencies: ['currentImagePath']
    }
  },

  async setup () {
    const folderTree = ridge.services.appService.getFileTree()
    this.appDirTree = this.convertTreeList(folderTree)
    // this.currentImagePath = this.properties.value
  },

  destory () {
  },

  watch: {
    async appDirName () {
      const appDirImageList = this.fileInfoById[this.appDirName]?.children.filter(n => n.mimeType && n.mimeType.startsWith('image'))

      for (const img of appDirImageList) {
        img.srcUrl = await ridge.services.appService.store.getItem(img.key)
      }
      this.appDirImageList = appDirImageList
    },

    value (val) {
      this.currentImagePath = val
    }
  },

  actions: {
    convertTreeList (items) {
      const result = []
      for (const item of items) {
        if (item.children && item.children.length) {
          const ni = {
            label: item.label,
            value: item.value,
            children: this.convertTreeList(item.children)
          }
          result.push(ni)
        }
        this.fileInfoById[item.value] = item
      }
      return result
    },
    openModal () {
      this.state.modalOpen = true
    },
    confirmSelected () {
      let finalImagePath = null
      if (this.state.listImagePath && this.state.listImagePath.startsWith('http')) { 
        // 使用了在线地址
        finalImagePath = this.state.listImagePath
      } else {
        finalImagePath = 'composite://' + this.state.listImagePath
      }
      this.state.currentImagePath = finalImagePath
      this.emit('input', finalImagePath)
      this.state.modalOpen = false
    },
    removeImage () {
      this.state.currentImagePath = ''
      this.emit('input', '')
    },
    selectImageInApp (i) {
      this.state.listImagePath = this.appDirImageList[i].path
      this.state.currentListSelectedIndex = i
    }
  }
}
