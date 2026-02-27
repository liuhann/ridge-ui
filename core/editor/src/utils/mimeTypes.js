// 定义通用MIME类型映射表
const MimeType = new Map([
  ['.js', 'text/javascript'],
  ['.json', 'text/json'],
  ['.md', 'text/markdown'],
  ['.woff', 'application/font-woff'],
  ['.gif', 'image/gif'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.webp', 'image/webp'],
  ['.zip', 'application/zip'],
  ['.mid', 'audio/midi'],
  ['.mp4a', 'audio/mp4'],
  ['.m4a', 'audio/mp4a-latm'],
  ['.ogg', 'audio/ogg'],
  ['.aac', 'audio/x-aac'],
  ['.m3u', 'audio/x-mpegurl'],
  ['.wma', 'audio/x-ms-wma'],
  ['.ico', 'image/x-icon'],
  ['.css', 'text/css'],
  ['.csv', 'text/csv'],
  ['.html', 'text/html'],
  ['.txt', 'text/plain'],
  ['.avi', 'video/x-msvideo']
])

/**
 * 根据文件扩展名获取MIME类型
 * @param {string | undefined | null} ext - 文件扩展名（无需带点，如 'js'、'png'）
 * @returns {string} 对应的MIME类型，未知/空则返回通用默认值
 */
export const getByMimeType = (ext) => {
  // 第一步：处理ext为空/无效的情况（null/undefined/空字符串）
  if (!ext || typeof ext !== 'string' || ext.trim() === '') {
    return 'application/octet-stream' // 标准未知二进制数据MIME类型
  }

  // 第二步：统一格式（去除首尾空格，避免传入 ' js ' 这类带空格的情况）
  const normalizedExt = ext.trim().toLowerCase() // 转小写，兼容 'JS'/'Js' 等情况

  // 第三步：优先查映射表，无则拼接（保留原逻辑，但优化拼接规则）
  const matchedType = MimeType.get('.' + normalizedExt)
  if (matchedType) {
    return matchedType
  }

  // 兜底：非标准扩展名，按规范拼接（如 ext为 'docx' → 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 更规范，但原逻辑是拼接application/ext）
  // 若想严格遵循规范，可直接返回默认值；若保留原逻辑，用下面这行
  return `application/${normalizedExt}`
}
