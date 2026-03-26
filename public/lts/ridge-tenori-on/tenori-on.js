export default {
  name: 'TenoriOn',
  state: {
    animationSpeed: 3,
    tenoriList: [],
    shareDialogVisible: false,
    matrixValue: '',
    tenoriMatrix: []
  },

  computed: {
    gridDelay: (scope) => {
      return 3000 / 16 * scope.item.i
    },
    gridLevel: scope => scope.item.j,
    girdActive: scope => scope.item.active
  },

  setup () {
    this.initTenoriMatrix()
  },

  actions: {
    initTenoriMatrix (actives = []) {
      const matrix = []
      for (let i = 0; i < 16; i++) {
        matrix[i] = []
        for (let j = 0; j < 16; j++) {
          matrix[i][j] = {
            i,
            j,
            active: actives.indexOf(i + ':' + j) > -1
          }
        }
      }
      this.tenoriMatrix = matrix
      this.matrix2List()
    },

    matrix2List () {
      const list = []
      for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 16; j++) {
          list.push(this.tenoriMatrix[i][j])
        }
      }
      this.tenoriList = list
    },

    reset () {
      this.tenoriList = this.tenoriList.map(item => {
          return Object.assign(item, {
            active: false
          })
      })
    },

    pause () {
      if (this.animationSpeed) {
        this.animationSpeed = 0
      } else {
        this.animationSpeed = 3
      }
    },

    toggleActive (scope) {
      this.tenoriList = this.tenoriList.map(item => {
        if (item.i === scope.item.i && item.j === scope.item.j) {
          return Object.assign(item, {
            active: !item.active
          })
        } else {
          return item
        }
      })
      this.matrixValue = this.tenoriList.filter(t=> t.active).map(t => t.i + ':' + t.j).join(',')
    },

    showShareDialog() {
      this.shareDialogVisible = true
    },

    importShareDialog() {
      try {
        this.setMatrixFromValue()
        this.shareDialogVisible = false
      } catch (e) {
        // 
      }
    },

    setMatrixFromValue () {
      const actives = this.matrixValue.split(',')
      this.initTenoriMatrix(actives)
    }
  }
}
