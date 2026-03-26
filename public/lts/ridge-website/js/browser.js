
export default {
  name: 'Browser',
  state: {},
  actions: {
    openLink (link) {  // 地址跳转
      if (link.startsWith('#')) {
        location.hash = link.substring(1)
      } else {
        location.href = link  
      }
    },
    openNewLink (link) {  // 新窗口打开
      window.open(link)
    }
  }
}
