async function fetchJson(url) {
  try {
    // 发起 fetch 请求
    const response = await fetch(url, {
      mode: 'cors'
    })

    // 检查响应状态是否为 200 - 299 之间
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    // 将响应数据解析为 JSON 格式
    const data = await response.json()
    return data
  } catch (error) {
      // 捕获请求过程中可能出现的错误，并返回 null
      console.error('请求出错:', error)
      return null
  }
}

export default {
  name: 'Hello',
  properties: [{
    label: 'CDN',
    type: 'string',
    name: 'cdnUrl',
    value: 'https://cdn.jsdelivr.net/npm'
  }],
  state: {
    name: 'World' //姓名
  }, 
  actions: {
    async setName () { // 设置名称
      const adjectives = await fetchJson(`${this.properties.cdnUrl}/animal-names-cn/data/adjectives.json`)
      const animals = await fetchJson(`${this.properties.cdnUrl}/animal-names-cn/data/names.json`)

      if (adjectives.length === null || animals.length === null) {
        console.error('无法获取有效的形容词或动物名称数组')
        this.name = '未知名称'
        return
      }
      this.name = adjectives[Math.floor(Math.random() * adjectives.length)] + animals[Math.floor(Math.random() * animals.length)]
    },

    setDropName: context => { // 设置固定名称
      context.name = '闪耀de雨滴'
    }
  }
}