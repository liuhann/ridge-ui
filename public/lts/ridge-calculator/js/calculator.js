const appendNumber = (context, n) => {
  if (context.currentDisplay === '0' || context.shouldResetScreen) {
    resetScreen(context)
  }
  if (context.currentDisplay.length >= 12) {
    return
  }
  context.currentDisplay += n
}

const add = (a, b) => {
  return a + b
}

const substract = (a, b) => {
  return a - b
}

const multiply = (a, b) => {

  return a * b
  /*
  let result = a * b
  if (result.toString().length > 12) {
    result = BigInt(parseInt(a)) * BigInt(parseInt(b))
    return result.toString()
  } else {
    return result.toString()
  }
  
  // const resultStr = result.toString()

  // 超过12位时转换为科学计数法
  // if (resultStr.length > 12) {
    // return formatBigIntToExponential(result) // 保留3位小数
  // }
  return result.toString()
  */
}
function formatBigIntToExponential(bigIntValue) {
  const str = bigIntValue.toString()
  const sign = str.startsWith('-') ? '-' : ''
  const absStr = sign ? str.slice(1) : str

  if (absStr === '0') return '0.000e+0'

  // 提取系数和指数
  const coefficient = absStr[0] + '.' + absStr.slice(1, 4) // 保留前4位
  const exponent = absStr.length - 1

  // 四舍五入保留三位小数
  const roundedCoefficient = parseFloat(coefficient).toFixed(3)

  return `${sign}${coefficient}e+${exponent}`
}
const divide = (a, b) => {
  return a / b
}

const operate = (operator, a, b) => {
  a = Number(a)
  b = Number(b)
  switch (operator) {
    case '+':
      return add(a, b)
    case '-':
      return substract(a, b)
    case '*':
      return multiply(a, b)
    case '/':
      if (b === 0) return null
      else return divide(a, b)
    default:
      return null
  }
}

const resetScreen = (context) => {
  context.currentDisplay = ''
  context.shouldResetScreen = false
}

const roundResult = resultStr => {
  return resultStr
  // 超过12位时转换为科学计数法
  /*
  if (resultStr.length > 12) {
    return formatBigIntToExponential(resultStr) // 保留3位小数
  } else {
    return Math.round(resultStr * 1000) / 1000
  }
  */
}

const convertOperator = keyboardOperator => { // 转换展示字符
  if (keyboardOperator === '/') return '÷'
  if (keyboardOperator === '*') return '×'
  if (keyboardOperator === '-') return '−'
  if (keyboardOperator === '+') return '+'
  return keyboardOperator
}

const setOperation = (context, operator) => { // 设置运算符
  // 如果有计算符先计算
  if (context.currentOperation != null) evaluate(context)
  context.firstOperand = context.currentDisplay
  context.currentOperation = operator
  context.lastOperation = `${context.firstOperand} ${convertOperator(operator)}`
  context.shouldResetScreen = true
}

const evaluate = context => { // 计算
  if (context.currentOperation == null || context.shouldResetScreen) return
  if (context.currentOperation === '/' && context.currentDisplay === '0') {
    alert("You can't divide by 0!")
    return
  }

  context.secondOperand = context.currentDisplay
  context.currentDisplay = roundResult(
    operate(context.currentOperation, context.firstOperand, context.secondOperand)
  )
  context.lastOperation = `${context.firstOperand} ${convertOperator(context.currentOperation)} ${context.secondOperand} =`
  context.currentOperation = null
}

const back = context => { // 回退
  context.currentDisplay = context.currentDisplay.toString().slice(0, -1) || '0'
}

const toggleNegative = context => { // 切换正负数
  if (context.currentDisplay) {
    context.currentDisplay = -Number(context.currentDisplay)
  }
}

const clear = context => { // AC
  context.currentDisplay = '0'
  context.lastOperation = ''

  context.firstOperand = ''
  context.secondOperand = ''
  context.currentOperation = null
}

const appendPoint = context => { // 输入.点
  if (context.shouldResetScreen) context.resetScreen()
  if (context.currentDisplay.includes('.')) return
  context.currentDisplay += '.'
}

const handleKeyboardInput = (context, key) => {
  if (key >= 0 && key <= 9) appendNumber(context, key)
  if (key === '.') appendPoint(context)
  if (key === '%') handlePercent(context)
  if (key === '=' || key === 'Enter') evaluate(context)
  if (key === 'Backspace') back(context)
  if (key === 'Escape') clear(context)
  if (key === '+' || key === '-' || key === '*' || key === '/') setOperation(context, key)
}

const handlePercent = context => { // 处理百分号
  if (context.currentOperation === '/' || context.currentOperation === '*') {
    if (context.currentDisplay) {
      context.secondOperand = context.currentDisplay + '%'
      context.currentDisplay = roundResult(operate(context.currentOperation, context.firstOperand, Number(context.currentDisplay) / 100))
      context.lastOperation = `${context.firstOperand} ${context.currentOperation} ${context.secondOperand} =`
      context.currentOperation = null
    }
  }
  if (context.currentOperation === '+' || context.currentOperation === '−') {
    // 计算 a + a * n%
    if (context.currentDisplay) {
      context.secondOperand = context.currentDisplay + '%'
      context.currentDisplay = roundResult(operate(context.currentOperation, context.firstOperand, Number(context.firstOperand) * Number(context.currentDisplay) / 100))
      context.lastOperation = `${context.firstOperand} ${convertOperator(context.currentOperation)} ${context.secondOperand} =`
      context.currentOperation = null
    }
  }
}

export default {
  name: 'Calculator',
  state: {
    currentDisplay: '', // 当前结果行
    lastOperation: '' // 计算式行
  },

  setup () {
    this.keyDownhandler = event => {
      handleKeyboardInput(this, event.key)
    }
    window.addEventListener('keydown', this.keyDownhandler)
  },

  destory () {
    window.removeEventListener('keydown', this.keyDownhandler)
  },

  actions: {
    onKeyPressed (key) { // 按键按下
      const code = key.charCodeAt(0)
      if (code >= 48 && code <= 57) {
        appendNumber(this, key)
      }
      if (key === '+' || key === '-' || key === '*' || key === '/') {
        setOperation(this, key)
      }
      if (key === '=') {
        evaluate(this)
      }
      if (key === 'C') {
        back(this)
      }
      if (key === '!') {
        toggleNegative(this)
      }
      if (key === 'A') {
        clear(this)
      }
      if (key === '.') {
        appendPoint(this)
      }
    },
    appendPoint,
    back,
    clear,
    handlePercent
  }
}
