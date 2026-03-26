export default {
  name: 'Hello',
  properties: [{
    label: '默认名称',
    type: 'string',
    name: 'name',
    value: '酷炫阳光'
  }],
  state: properties => {
    return {
      name: properties.name //姓名
    }
  },
  actions: {
    generateRandomNetName() { // 豆包编写：生成网名
      const adjectives = ["快乐", "阳光", "闪耀", "梦幻", "甜蜜", "酷炫", "清新", "灵动", "神秘", "优雅", "可爱"]
      const nouns = ["精灵", "猫咪", "云朵", "星星", "蝴蝶", "雨滴", "彩虹", "微风", "海浪", "花朵", "森林"]
      return adjectives[Math.floor(Math.random() * adjectives.length)] 
        + '而又' + adjectives[Math.floor(Math.random() * adjectives.length)] + '的' + nouns[Math.floor(Math.random() * nouns.length)]
    },
    
    setName (args, payload, c) { // 设置名称
      console.log(args, payload, c)
      this.name = this.generateRandomNetName()
    }
  }
}
