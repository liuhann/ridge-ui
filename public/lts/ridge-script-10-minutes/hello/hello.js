
async function fetchJsonWithCors(url) {
    try {
        // 发起一个 fetch 请求，设置 mode 为 'cors'
        const response = await fetch(url, {
            mode: 'cors' 
        })

        // 检查响应状态是否成功
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        // 将响应数据解析为 JSON 对象
        const jsonData = await response.json()

        return jsonData
    } catch (error) {
        // 捕获并处理可能出现的错误
        console.error('Error fetching JSON data:', error)
        return null
    }
}


export default {
  name: 'Hello',
  externals: [
    '/lodash/lodash.min.js'
  ],
  properties: [{
    label: '默认名称',
    type: 'string',
    name: 'defaultName',
    value: '凶猛的老虎'
  }],
  events: [{
    label: '名称改变',
    name: 'nameChanged'
  }],
  state: properties => {
    return {
      compact: _.compact([0, 1, false, 2, '', 3]),
      adjectives: [],
      animals: [],
      value: 65,
      unit: 'kg',
      name: properties.defaultName // 姓名
    }
  },

  computed: {
    weight: {
      get() {
        return this.value + this.unit
      },
      set(newValue) {
          // 匹配数字部分
        const numberMatch = newValue.match(/\d+/)
        // 匹配非数字部分
        const unitMatch = newValue.match(/[^\d]+/)

        // 获取数字和单位
        this.value = numberMatch ? parseFloat(numberMatch[0]) : 0
        this.unit = unitMatch ? unitMatch[0] : ''
      }
    },
    animalName: {
      get (scope) {
        return scope.item
      },
      set (value, state, scope) {
        state.animals[scope.i] = value
      }
    }
  },

  async setup() {
      this.adjectives = await fetchJsonWithCors(`https://cdn.jsdelivr.net/npm/animal-names-cn/data/adjectives.json`)
      this.animals = await fetchJsonWithCors(`https://cdn.jsdelivr.net/npm/animal-names-cn/data/names.json`)
      // do subscription
  },

  destory() {
      // unregister
  },

  watch: {
    name () {
      this.value = Math.floor(Math.random() * 100)
      this.emit('nameChanged', this.name)
    },
    defaultName (newValue) {
      this.value = newValue
    }
  },
  actions: {
    setName: async context => {
      const { adjectives, animals } = context
      if (adjectives == null || animals == null) {
        console.error('无法获取名称')
        context.name = '无法获取'
        return
      }
      
      context.name = adjectives[Math.floor(Math.random() * adjectives.length)] + animals[Math.floor(Math.random() * animals.length)]
    }
  }
}
