import LocalStorageUtil from '/npm/ridge-common/js/storage.js'

const stickyNoteColors = [
  { name: "淡奶油黄", color: "#FFF8D6" },
  { name: "薄荷绿", color: "#E0F2F1" },
  { name: "樱花粉", color: "#FCE4EC" },
  { name: "天空蓝", color: "#BBDEFB" },
  { name: "浅薰衣草紫", color: "#EDE7F6" },
  { name: "浅珊瑚橙", color: "#FFE0B2" }
]

export default {
  name: 'SimpleNote',
  state: {
    noteId: '', // 当前编辑Note
    plusIcon: 'plus-lg', // 增加或删除图标
    showSider: false, // 显示编辑窗口
    contentIndex: 0, // 当前内容区切换
    currentNote: '', // 当前编辑的内容
    currentSelectedColor: '', // 当前选中的颜色
    stickyNoteColors, // 颜色列表
    notes: [] // 便签列表
  },

  computed: {
    listItemColor: scope => scope.item.color,  // 列表项单色
    listItemText: scope => scope.item.content  // 单项文本
  },

  setup () {
    this.store = new LocalStorageUtil('simple-note')
    this.notes = this._getNoteList()
  },

  actions: {
    showNewNote () { // 新增便签
      if (this.contentIndex === 1) {
        this.noteId = ''
        this.currentSelectedColor = stickyNoteColors[0].color
        this.currentNote = ''
        this.toggleNoteEdit()
      } else {
        this.toggleNoteList()
      }
    },

    toggleNoteList () {
      this.contentIndex = 1
      this.currentNote = ''
      this.noteId = ''
      this.plusIcon = 'plus-lg'
    },

    toggleNoteEdit() {
      this.contentIndex = 2
      this.plusIcon = 'x-lg'
    },

    onEditNoteClick (scope) { // 编辑便签
      const { item } = scope
      this.noteId = item.id
      this.currentSelectedColor = item.color
      this.currentNote = item.content
      this.toggleNoteEdit()
    },

    onColorItemClick (scope) { // 切换便签颜色
      this.currentSelectedColor = scope.item.color
    },

    editNoteComplete () { // 保存
      if (this.noteId) {
        this.updateNote(this.noteId, this.currentNote, this.currentSelectedColor)
      } else {
        this._addNote(this.currentNote, this.currentSelectedColor)
      }
      this.toggleNoteList()
      this.notes = this._getNoteList()
    },

    onRemoveNoteClick() { // 删除便签
      this.removeNote(this.noteId)
      this.toggleNoteList()
      this.notes = this._getNoteList()
    },

    _getNoteList() {
      const notes = this.store.getAllObjects().sort((a, b)=> a.id > b.id ? -1 : 1)
      if (notes.length === 0) {
        this.contentIndex = 0
      } else {
        this.contentIndex = 1
      }
      return notes
    },
    
    _addNote(content, color) {
      const id = Date.now().toString(36)
      const record = {
        id,
        created: new Date(),
        color,
        content
      }
      this.store.saveObject(id, record)
      return record
    },

    updateNote(id, content, color) {
      this.store.deleteObject(id)
      return this._addNote(content, color)      
    },

    removeNote(id) {
      this.store.deleteObject(id)
    }
  }
}
