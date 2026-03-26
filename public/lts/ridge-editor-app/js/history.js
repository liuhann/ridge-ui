import  { showConfirm, showMessage } from '/npm/ridge-common/js/utils.js'

export default {
  name: 'LocalHistory',
  state: {
    dialogHistroyShow: false, // 显示历史对话框
    selectedKeys: [], // 选中
    historyList: []
  },

  async setup () {
    if (this.context.services.appService) { 
      this.historyList = await this.context.services.appService.getAllBackups()
    }
  },

  actions: {
    openDialogHistroy() { // 打开历史对话框
      this.dialogHistroyShow = true
    },
    onSelectionChange (keys) { // 选中
      this.selectedKeys = keys
    },
    async restoreHistory () { // 恢复历史
      if (this.selectedKeys.length === 1) {
        if (await showConfirm('当前工作区间同时会自动备份，确认恢复指定历史？')) {
          await this.context.services.appService.backupCurrentApp()
          await this.context.services.appService.recoverBackUpAppArchive(this.selectedKeys[0])
        }
      } else {
        showMessage('请选中一个历史进行恢复')
      }
    },

    async removeSelectedHistory () { // 删除历史
      if (this.selectedKeys.length > 0) {
        if (await showConfirm('确定删除指定的记录')) {
          for (const key of this.selectedKeys) {
            await this.context.services.appService.removeBackup(key)
          }
        }
        this.historyList = await this.context.services.appService.getAllBackups()
        this.selectedKeys = []
      } 
    }
  }
}
