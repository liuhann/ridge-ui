import { FILE_FOLDER, FILE_IMAGE, FILE_JS, FILE_JSON, FILE_MARKDOWN, FILE_PAGE } from '../../icons/icons.js'
import { mapTree } from './buildFileTree.js'

export const getAppTreeData = (treeData, currentAppName) => {
  // SVG 图标集合 —— 专业、简洁、统一
  const ICONS = {
    folder: FILE_FOLDER,
    page: FILE_PAGE,
    js: FILE_JS,
    json: FILE_JSON,
    image: FILE_IMAGE,
    md: FILE_MARKDOWN
  }

  const fileTree = mapTree(treeData, file => {
    // 默认文件图标
    file.icon = ICONS.file

    if (file.mimeType) {
      if (file.mimeType === 'application/font-woff') {
        file.icon = ICONS.font
      } else if (file.mimeType.indexOf('audio') > -1) {
        file.icon = ICONS.audio
      } else if (file.mimeType.indexOf('image') > -1) {
        file.icon = ICONS.image
      }
    }

    file.label = file.name
    if (file.label.endsWith('.md')) {
      file.icon = ICONS.md
    }
    if (file.label.endsWith('.js')) {
      file.icon = ICONS.js
    }
    if (file.label.endsWith('.json')) {
      file.icon = ICONS.json
    }
    // 根据文件类型设置图标
    if (file.type === 'directory') {
      file.icon = ICONS.folder
    }
    // page 类型不显示 .json 后缀
    if (file.type === 'page' && file.name.endsWith('.json')) {
      file.label = file.name.replace(/\.json$/, '')
      file.icon = ICONS.page
    } else {
      file.label = file.name
    }

    return {
      raw: file,
      icon: file.icon,
      label: file.label,
      id: file.id,
      key: file.id
    }
  })

  return [{
    id: -1,
    key: -1,
    label: currentAppName,
    value: '-1',
    icon: ICONS.folder,
    raw: { path: '/', id: -1 },
    children: fileTree
  }]
}
