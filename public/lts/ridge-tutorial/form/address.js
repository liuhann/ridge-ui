export default {
  name: 'ChinaRegionSelect',
  state: {
    _provinces: [],
    _cities: [],
    _areas: [],
    province: '', // 当前省
    city: '', // 当前市
    country: '', // 当前区县
    name: '', // 收货人
    nameValid: '', // 收货人有效性
    detailedAddress: '', // 详细地址
    detailAddressValid: '', // 详细地址有效性
    mobile: '', // 手机号码
    mobileValid: '', // 手机号码有效性
    email: '', // 邮箱地址
    nameAlias: '', // 地址别名
    locationTagValue: '', // 已选地址标签
    locationtags: [{  // 地址可选标签
      label: '家',
      value: 'home'
    }, {  
      label: '公司',
      value: 'company'
    }, { 
      label: '学校',
      value: 'scholl'
    }, { 
      label: '外出',
      value: 'outside'
    }],
  },

  computed: {
    provinceList () { // 省直辖市列表
      return this._provinces.map(p => ({ label: p.name, value: p.id}))
    },
    cityList () { // 城市列表
      return this._cities[this.province].map(p => ({ label: p.name, value: p.id}))
    },
    countryList () { // 区县列表
      return (this._areas[this.city] ?? []).map(p => ({ label: p.name, value: p.id}))
    }
  },

  async setup () {
    this._loadData()
  },

  destory () {
  },

  watch: {
    province () {
      this.city = this._cities[this.province][0].id
    },
    city () {
      this.country = this._areas[this.city][0].id
    }
  },

  actions: {
    async _loadData() {
      const provinces = await (await fetch('//unpkg.com/@mofe/china_regions@1.0.0/json/province.json')).json()
      const cities = await (await fetch('//unpkg.com/@mofe/china_regions@1.0.0/json/city.json')).json()
      const areaes = await (await fetch('//unpkg.com/@mofe/china_regions@1.0.0/json/area.json')).json()

      this._provinces = provinces
      this._cities = cities
      this._areas = areaes
     
      this.province = provinces[0].id
      this.city = cities[this.province][0].id
      this.country = areaes[this.city][0].id
    },

    checkValid () { // 执行验证
      this.nameValid = this.name !== ''
      this.detailAddressValid = this.detailedAddress !== ''
      this.mobileValid = /^1[3-9]\d{9}$/.test(this.mobile)
    },

    save() { // 保存
      this.checkValid()
      // 通过后进行提交等动作
    }
  }
}
