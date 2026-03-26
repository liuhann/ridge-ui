export default {
  name: 'OptionListStore',
  properties: [{
    name: 'value',
    label: '列表',
    type: 'array',
    value: []
  }],
  state: () => {
    return {
      jsonText: '',
      jsonTextError: '',
      mode: 'form',
      dialogVisible: false,
      btnToggleOn: false,
      opts: [], // 列表
      errorMsg: ''
    }
  },

  computed: {
    itemValue: {
      get: scope => {
        return scope.item.value
      },
      set: (val, state, scope) => {
        state.errorMsg = ''
        state.opts[scope.i].value = val
      }
    },
    itemLabel: {
      get: scope => {
        return scope.item.label
      },
      set: (val, state, scope) => {
        state.opts[scope.i].label = val
      }
    }
  },

  update (props) {
    this.state.opts = props.value || []
  },

  async setup () {
    this.state.opts = this.properties.value || []
  },

  destory () {
  },

  watch: {
  },

  actions: {
    closeModal() {
      this.state.dialogVisible = false
    },
    openModal() {
      this.state.dialogVisible = true
      this.state.mode = 'form'
      this.state.jsonText = JSON.stringify(this.properties.value, null, 2)
      this.state.btnToggleOn = false
    },
    onModeChange() {
      if (this.state.btnToggleOn) {
        this.state.jsonText =  JSON.stringify(this.state.opts, null, 2)
        this.state.btnToggleOn = true
        this.state.mode = 'json'      
      } else {
        try {
          const optObject = JSON.parse(this.state.jsonText)
          this.state.opts = optObject
          this.state.mode = 'form'
        } catch (e) {
          this.state.btnToggleOn = true
          this.state.jsonTextError = '当前编辑内容不符合JSON格式'
        }
      }
    },
    addListItem () {
      this.state.opts.push({
        label: '标签',
        value: 'key'
      })
    },
    removeListItem (scope) {
      this.state.opts = this.state.opts.filter((_, i) => i !== scope.i)
    },
    confirm () {
      if (this.btnToggleOn) {
        try {
          const optObject = JSON.parse(this.state.jsonText)
          this.emit('onChange', optObject)
          this.state.dialogVisible = false
        } catch (e) {
          this.state.jsonTextError = '当前编辑内容不符合JSON格式'
        }
      } else {
        this.emit('onChange', this.state.opts)
        this.state.dialogVisible = false
      }
    }
  }
}
