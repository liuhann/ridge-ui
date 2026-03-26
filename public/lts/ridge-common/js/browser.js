export default {
  name: 'Browser',
  state: {},
  actions: {
    openLink (link) { // 地址跳转
      if (link.startsWith('#')) {
        window.location.hash = link.substring(1)
      } else {
        window.location.href = link
      }
    }
  }
}
