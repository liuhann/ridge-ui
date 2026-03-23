import { customAlphabet } from 'nanoid'
import camelCase from 'lodash/camelCase'
import trim from 'lodash/trim'
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10)

const filename = fullPath => {
  const withExt = fullPath.substring(fullPath.lastIndexOf('/') + 1)
  // return withExt.includes('.') ? withExt.substring(0, withExt.lastIndexOf('.')) : withExt
  return withExt.split('.')[0]
}

/**
 * 清理路径中的多斜线（极简版）：将所有连续的 /（//、/// 等）无条件替换为单 /
 * 不考虑协议、URL 等特殊场景，仅处理斜线
 * @param {string} path - 待处理的路径字符串
 * @returns {string} 清理后的路径字符串（非字符串输入返回原值）
 */
const cleanMultiSlash = (path) => {
  // 边界处理：非字符串直接返回原值
  if (typeof path !== 'string') {
    return path
  }

  // 全局替换：所有连续的一个或多个 / → 单 /
  return path.replace(/\/+/g, '/')
}

/**
 * 通用字符串前缀补齐函数（适配路径场景）
 * @param {string} str - 需要处理的字符串/路径（如 "xx"、"/xx"、"/prefix/xx"）
 * @param {string} prefix - 目标前缀（如 "/prefix"、"prefix"，自动处理斜线）
 * @param {Object} [options] - 可选配置
 * @param {boolean} [options.allowDuplicate=false] - 是否允许重复前缀（默认false：去重）
 * @param {boolean} [options.allowEmpty=false] - 空字符串是否返回前缀（默认false：空字符串返回空）
 * @returns {string} 补齐前缀后的字符串
 */
const addStringPrefix = (prefix, str, options = {}) => {
  // 解构配置，设置默认值
  const { allowDuplicate = false, allowEmpty = false } = options

  // 边界处理：非字符串类型直接返回
  if (typeof str !== 'string') {
    return str
  }

  // 处理空字符串
  const trimmedStr = str.trim()
  if (trimmedStr === '') {
    return allowEmpty ? formatPrefix(prefix) : ''
  }

  // 格式化前缀和目标字符串（统一处理斜线）
  const formattedPrefix = formatPrefix(prefix) // 如 "prefix" → "/prefix"，"/prefix/" → "/prefix"
  const formattedStr = trimLeadingSlash(trimmedStr) // 如 "/xx" → "xx"，"xx" → "xx"

  // 检查是否已有该前缀（避免重复）
  const fullStrWithPrefix = `${formattedPrefix}/${formattedStr}`
  const hasPrefix = fullStrWithPrefix.startsWith(formattedPrefix) &&
                     fullStrWithPrefix !== formattedPrefix // 排除前缀本身的情况

  // 已有前缀且不允许重复 → 直接返回格式化后的完整路径
  if (hasPrefix && !allowDuplicate) {
    return fullStrWithPrefix
  }

  // 无前缀/允许重复 → 拼接前缀和字符串
  return fullStrWithPrefix
}

/**
 * 去掉字符串开头的所有斜线
 * @param {string} str - 原始字符串（如 "/xx"、"//xx"）
 * @returns {string} 处理后的字符串（如 "xx"）
 */
const trimLeadingSlash = (str) => {
  return str.replace(/^\/+/g, '')
}

// ---------------- 私有辅助函数 ----------------
/**
 * 格式化前缀（统一为 /xxx 格式）
 * @param {string} prefix - 原始前缀（如 "prefix"、"/prefix"、"/prefix/"）
 * @returns {string} 格式化后的前缀（如 "/prefix"）
 */
const formatPrefix = (prefix) => {
  if (typeof prefix !== 'string') return ''
  const trimmedPrefix = prefix.trim()
  if (trimmedPrefix === '') return ''
  // 去掉首尾多余斜线，再补开头斜线
  const purePrefix = trimmedPrefix.replace(/^\/+|\/+$/g, '')
  return purePrefix ? `/${purePrefix}` : ''
}

/**
 * 通用文件扩展名补齐函数
 * @param {string} str - 需要处理的文件名/字符串
 * @param {string} ext - 目标扩展名（如 "json"、"txt"，无需带点）
 * @param {Object} [options] - 可选配置
 * @param {boolean} [options.keepCase=false] - 是否保留原扩展名大小写（默认false：统一转为小写）
 * @param {boolean} [options.allowEmpty=false] - 空字符串是否返回 `${ext}`（默认false：空字符串返回空）
 * @returns {string} 补齐扩展名后的字符串
 */
const addFileExtension = (str, ext, options = {}) => {
  // 解构配置，设置默认值
  const { keepCase = false, allowEmpty = false } = options

  // 边界处理：非字符串类型直接返回
  if (typeof str !== 'string') {
    return str
  }

  // 处理空字符串
  const trimmedStr = str.trim()
  if (trimmedStr === '') {
    return allowEmpty ? `.${ext}` : ''
  }

  // 格式化扩展名（去掉可能的点，统一为纯名称）
  const pureExt = ext.startsWith('.') ? ext.slice(1) : ext
  // 构建正则：匹配结尾的 .扩展名（忽略大小写）
  const extReg = new RegExp(`\\.${pureExt}$`, 'i')

  // 已有目标扩展名 → 按配置处理大小写
  if (extReg.test(trimmedStr)) {
    if (keepCase) {
      return trimmedStr // 保留原大小写（如 .JSON → .JSON）
    } else {
      return trimmedStr.replace(extReg, `.${pureExt}`) // 统一为小写（如 .JSON → .json）
    }
  }

  // 无目标扩展名 → 追加 .扩展名
  return `${trimmedStr}.${pureExt}`
}

// ---------------- 快捷方法：封装常用扩展名（可选） ----------------
// 快捷补齐 .json（复用通用方法，减少重复传参）
const addJsonSuffix = (str, options = {}) => {
  return addFileExtension(str, 'json', options)
}

const hashString = str => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash.toString()
}

const generateUrlFontName = fontUrl => filename(fontUrl)
/*
const generateUrlFontName = fontUrl => {
  // 从字体 URL 中提取文件名部分
  const fileName = fontUrl.split('/').pop()
  // 生成基于 URL 的哈希值
  const urlHash = hashString(fontUrl)
  // 结合文件名和哈希值生成唯一的字体名称
  return `${fileName.replace(/\.\w+$/, '')}-${urlHash}`
}
*/

// 将数值转换为合法的css长度值  主要是  12-> 12px
const toCSSLength = (value) => {
  if (value == null) return value // 处理 null/undefined
  const str = String(value).trim()
  return /^(auto|inherit|initial|unset|0|calc|min|max|clamp)/.test(str) ||
         /[^\d.]\s*\d/.test(str)
    ? str
    : `${parseFloat(str) || 0}px`
}

const ensureLeading = (str, slash = '/') => {
  return str.startsWith(slash) ? str : (slash + str)
}

/**
 * 移除 URL 中的协议部分（如 https://、ridge:// 等）
 * @param {string} url - 待处理的 URL 字符串
 * @returns {string} 移除协议后的字符串，若输入非字符串或无协议则返回原内容
 */
const removeUrlProtocol = (url) => {
  // 校验输入类型，非字符串直接返回
  if (typeof url !== 'string') {
    return url
  }

  // 正则匹配任意协议头（xxx://），并替换为空
  // 正则说明：
  // ^ - 匹配字符串开头
  // [a-zA-Z0-9-]+ - 匹配协议名（字母、数字、短横线）
  // :// - 匹配协议分隔符
  return ensureLeading(url.replace(/^[a-zA-Z0-9-]+:\/\//, ''))
}

const hasUrlProtocol = (url) => {
  // 非字符串输入直接返回 false
  if (typeof url !== 'string') {
    return false
  }

  // 复用和移除方法一致的正则，仅做匹配判断
  const protocolReg = /^[a-zA-Z0-9-]+:\/\//
  return protocolReg.test(url.trim()) // 去除首尾空格后判断，避免空格干扰
}

const convertToValidVariableName = str => {
  // 1. 移除所有非字母数字的字符，并用空字符串替换
  // 2. 确保变量名不以数字开头（如果以数字开头，前面添加下划线）
  let variableName = str.replace(/[^a-zA-Z0-9]/g, '_')

  // 检查是否以数字开头
  if (/^\d/.test(variableName)) {
    variableName = '_' + variableName
  }
  return variableName
}

/**
   * 解析组件路径，提取包名和组件路径
   * @param {String|Object} componentPath 组件路径（如 antd/Button、{packageName: 'antd', path: 'Button'}）
   * @returns {Object} { packageName, componentPath }
   */
const extractComponentPath = (componentPath) => {
  let packageName = ''
  let path = ''

  // 处理对象格式入参
  if (typeof componentPath === 'string') {
    const paths = componentPath.split('/').filter(Boolean) // 过滤空字符串
    if (paths.length === 0) {
      throw new Error('组件路径不能为空')
    }

    // 处理作用域包（如 @douyinfe/semi-ui）
    if (paths[0].startsWith('@')) {
      packageName = paths.splice(0, 2).join('/')
      path = paths.join('/')
    } else {
      packageName = paths.splice(0, 1).join('/')
      path = paths.join('/')
    }
  } else {
    throw new Error(`无效的组件路径格式：${componentPath}`)
  }

  if (!packageName || !path) {
    throw new Error(`解析组件路径失败：${JSON.stringify(componentPath)}`)
  }
  return { packageName, componentPath: path }
}

export {
  extractComponentPath,
  cleanMultiSlash,
  hasUrlProtocol,
  addFileExtension,
  addStringPrefix,
  addJsonSuffix,
  convertToValidVariableName,
  filename,
  camelCase,
  trim,
  hashString,
  toCSSLength,
  generateUrlFontName,
  removeUrlProtocol,
  ensureLeading,
  nanoid
}
