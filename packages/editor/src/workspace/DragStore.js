class DragStore {
  constructor() {
    this.payload = null
  }

  startDrag(data) {
    this.payload = data
  }

  getDragData() {
    const data = this.payload
    this.payload = null // 一次性的
    return data
  }
}

export default new DragStore()