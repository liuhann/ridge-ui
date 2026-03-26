import '/npm/jszip/dist/jszip.min.js'
import { getStoreStatus, downloadAppPackage, showError, fullscreenLoading } from '/npm/ridge-common/js/utils.js' 

const ridgeBaseUrl = window.RIDGE_NPM_REPO ?? '/npm'
export default {
  name: 'XUserHome',
  events: [{
    label: '打开应用',
    name: 'open-app'
  }],
  state: {
    userAppList: [],
    userListEmpty: true // 列表为空
  },

  computed: {
    appName: scope => scope.item.description,
    appIcon: scope => scope.item.icon ? `${ridgeBaseUrl}/${scope.item.name}/${scope.item.icon}` : `${ridgeBaseUrl}/ridge-container/icons/DuoIconsBox2.svg`
  },

  setup() {
    this.getUserAppList()
  },

  actions: {
    async openApp (scope) { // 打开应用
      const close = fullscreenLoading()
      const appName = scope.item.name
      const packageFile = await downloadAppPackage(appName)
      
      try {
        const zip = new JSZip()
        await zip.loadAsync(packageFile)
        await zip.forEach(async (filePath, zipObject) => {
          if (filePath.endsWith('.json')) {
            ridge.loader.setJSONCache(`${appName}/${filePath}`, JSON.parse(await zipObject.async('text')))
          }
        })

        const packageJSONObject = await ridge.loader.loadJSON(`${appName}/package.json`)

        if (packageJSONObject) {
          this.emit('open-app', packageJSONObject)
        } else {
          showError('应用打开异常-应用描述文件不存在')
        }
      } catch (e) {
        showError('应用打开异常', e)
        return false
      } finally {
        close()
      }
    },
    async getUserAppList () { // 更新用户应用列表
      const userStoreStatus = await getStoreStatus()

      if (userStoreStatus) {
        this.userAppList = userStoreStatus.userApps
        if (this.userAppList.length > 0) {
          this.userListEmpty = false
        } else {
          this.userListEmpty = true
        }
      }
    }
  }
}
