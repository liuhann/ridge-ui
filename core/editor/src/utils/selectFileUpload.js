/**
 * 弹出 ZIP 文件选择框，选择后通过回调返回文件
 * @param {Function} callback - 选择文件后的回调函数，参数为选中的 File 对象（取消选择则为 null）
 */
function selectZipFile (callback) {
  // 1. 校验回调函数是否合法
  if (typeof callback !== 'function') {
    console.error('回调函数必须是一个函数类型')
    return
  }

  // 2. 动态创建文件选择 input 元素（不插入到 DOM 也能触发）
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  // 核心：限定只能选择 zip 文件（多浏览器兼容）
  fileInput.accept = '.zip, application/zip, application/x-zip-compressed, application/octet-stream'
  // 隐藏元素（视觉上无感知）
  fileInput.style.display = 'none'

  // 3. 监听文件选择事件
  fileInput.addEventListener('change', function (e) {
    // 获取选中的文件（只取第一个）
    const file = e.target.files?.[0] || null

    if (file) {
      // 二次校验文件类型（防止用户通过修改扩展名绕过限制）
      const isZipFile = file.name.endsWith('.zip') ||
                        file.type === 'application/zip' ||
                        file.type === 'application/x-zip-compressed'

      if (isZipFile) {
        callback(file) // 回调返回合法的 ZIP 文件
      } else {
        alert('请选择合法的 ZIP 压缩文件！')
        callback(null)
      }
    } else {
      callback(null) // 用户取消选择，返回 null
    }

    // 清理：移除元素避免内存泄漏
    fileInput.remove()
  })

  // 4. 监听取消选择的场景（部分浏览器支持）
  fileInput.addEventListener('cancel', function () {
    callback(null)
    fileInput.remove()
  })

  // 5. 触发文件选择框（必须通过用户交互触发，如点击/按键，否则浏览器会拦截）
  // 注意：该方法需在用户交互事件（如 click、touchstart）中调用，否则可能无效
  fileInput.click()
}

export default selectZipFile
