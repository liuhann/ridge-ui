import React, { useState, useEffect } from 'react'

import { IN_APP_FILE_PREFIEX } from 'ridgejs'
import { withField, TreeSelect, Tree, TagInput, Popover, Icon, Tag, Typography } from '@douyinfe/semi-ui'
import { getAppTreeData } from '../../panels/files/utils.js'
import appStore from '../../store/app.store.js'
import editorStore from '../../store/editor.store'
import { filterTreeKeepStructure, mapTree } from '../../panels/files/buildFileTree.js'

// 资源文件地址选择, 支持从应用内和外部同时选择、单个或者多个。
// 选择应用文件后会返回 composite:// 开头的路径
// 在Tag中合并显示应用内外的文件
const AppFileSelectEdit = ({
  value,
  onChange,
  options
}) => {
  const [visible, setVisible] = useState(false)
  const [treeData, setTreeData] = useState([])

  const currentAppFilesTree = appStore(state => state.currentAppFilesTree)
  const currentAppName = appStore((state) => state.currentAppName)
  const openFile = editorStore(state => state.openFile)
  const { Title } = Typography

  useEffect(() => {
    const filtered = filterTreeKeepStructure(currentAppFilesTree, file => {
      return file.mimeType && file.mimeType.indexOf(options.fileType) > -1
    })
    const data = mapTree(getAppTreeData(filtered, currentAppName), node => {
      return {
        label: node.label,
        value: node.raw.path,
        key: node.raw.path,
        disabled: node.children != null,
        isLeaf: node.children == null,
        children: node.children
      }
    })
    setTreeData(data)
  }, [currentAppFilesTree, options.fileType])

  // 选择文件后，将 composite:// 开头的路径返回给上层
  const changeWithComposite = (selectedNodes) => {
    // 🔥 关键：只保留叶子节点（文件），过滤掉父节点
    const filtered = selectedNodes.filter(node => node.children == null)

    if (options.multiple) {
      // 获取当前已选中的非应用内文件（外部文件）
      const externalFiles = (Array.isArray(value) ? value : []).filter(it => !it.startsWith(IN_APP_FILE_PREFIEX))
      // 新选中的应用内文件添加前缀
      const newInternalFiles = filtered.map(node => IN_APP_FILE_PREFIEX + node)

      onChange && onChange([...newInternalFiles, ...externalFiles])
    } else {
      const file = filtered[0] || ''
      if (file) {
        // 单选模式：直接添加前缀
        onChange && onChange(IN_APP_FILE_PREFIEX + file)
        setVisible(false)
      }
    }
  }

  // 自行输入的修改
  const changeWithTagInput = val => {
    if (options.multiple) {
      onChange && onChange(val)
    } else {
      onChange && onChange(val[0] || '')
    }
  }

  const getRemovePrefixValue = () => {
    if (options.multiple) {
      if (Array.isArray(value)) {
        // 多选：过滤出带前缀的值，并去掉前缀，用于树组件选中状态
        return value
          .filter(it => it.startsWith(IN_APP_FILE_PREFIEX))
          .map(it => it.substring(IN_APP_FILE_PREFIEX.length))
      } else {
        return []
      }
    } else {
      if (typeof value === 'string') {
        // 单选：如果带前缀则去掉，否则返回空（因为树组件只识别应用内路径）
        return value.startsWith(IN_APP_FILE_PREFIEX) ? value.substring(IN_APP_FILE_PREFIEX.length) : ''
      }
      return ''
    }
  }

  const renderTagItem = (item, index, onClose) => {
    return (
      <Tag
        key={index}
        closable
        color='white'
        onClick={() => {
          if (item.startsWith(IN_APP_FILE_PREFIEX)) {
            openFile(item.substring(IN_APP_FILE_PREFIEX.length))
          }
        }}
        onClose={onClose}
        style={{ margin: '2px 4px 2px 0' }}
      >
        {item && item.startsWith(IN_APP_FILE_PREFIEX) ? item.substring(item.lastIndexOf('/') + 1) : item}
      </Tag>
    )
  }

  const treeValue = getRemovePrefixValue()
  return (
    <Popover
      trigger='custom'
      className='pop-select-file'
      visible={visible}
      showArrow
      onClickOutSide={() => setVisible(false)}
      position='leftTop'
      style={{
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        padding: '12px 0',
        overflow: 'hidden'
      }}
      content={
        <div className='pop-select-file-content'>
          {/* 标题 */}
          <div style={{
            padding: '0 16px 12px',
            borderBottom: '1px var(--semi-color-border) solid',
            marginBottom: 6
          }}
          >
            <Title
              heading={6}
              style={{
                margin: 0,
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--semi-color-text-0)'
              }}
            >
              从应用中选择
            </Title>
          </div>

          {/* 树组件：只允许选文件 */}
          <Tree
            checkRelation='unRelated'
            multiple={options.multiple}
            style={{ width: 320, height: 400 }}
            value={treeValue}
            onChange={changeWithComposite}
            treeData={treeData}
          />
        </div>
      }
    >
      <TagInput
        onFocus={() => setVisible(true)}
        value={options.multiple ? value : (value ? [value] : [])}
        maxTagCount={options.multiple ? 300 : 1}
        renderTagItem={renderTagItem}
        onChange={changeWithTagInput}
        style={{ width: '100%' }}
      />
    </Popover>
  )
}

export default withField(AppFileSelectEdit)
