import { setAvatar } from '/npm/ridge-common/js/utils.js'
export default {
  name: 'Avatar',
  events: [{
    label: '保存成功',
    name: 'save-success'
  }],
  state: () => {
    return {
      upload: null,
      croppedDataUrl: ''
    }
  },
  computed: {
    confirmDisabled () {
      return this.croppedDataUrl === ''
    }
  },

  actions: {
    setCroppedDataUrl (payload) { // 设置剪裁后图片
      this.croppedDataUrl = payload
    },
    async saveUserAvatar() { // 保存用户头像
      if (this.croppedDataUrl) {
        await setAvatar(await (await fetch(this.croppedDataUrl)).blob())
        this.emit('save-success')
      }
    }
  }
}
