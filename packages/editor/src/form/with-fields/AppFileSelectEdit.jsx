import React, { useState, useEffect } from 'react'

import { withField, TreeSelect, Tree, TagInput, Popover, Icon, Tag, Typography } from '@douyinfe/semi-ui'
import { getAppTreeData } from '../../panels/files/utils.js'
import appStore from '../../store/app.store.js'
import editorStore from '../../store/editor.store'
import { filterTree } from '../../panels/files/buildFileTree.js'

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
    const filtered = filterTree(currentAppFilesTree, file => {
      return file.mimeType && file.mimeType.indexOf(options.fileType) > -1
    })
    setTreeData(getAppTreeData(filtered, currentAppName))
  }, [currentAppFilesTree, options.fileType])

  // 选择文件后，将 composite:// 开头的路径返回给上层
  const changeWithComposite = (val, selectedNodes) => {
    // 🔥 关键：只保留叶子节点（文件），过滤掉父节点
    const fileKeys = selectedNodes?.filter(node => node.isLeaf).map(node => node.key) || []

    if (options.multiple) {
      onChange && onChange([...fileKeys.map(it => 'composite://' + it), ...value.filter(it => !it.startsWith('composite://'))])
    } else {
      const fileKey = fileKeys[0] || ''
      if (fileKey) {
        onChange && onChange('composite://' + fileKey)
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
        return value.filter(it => it.startsWith('composite://')).map(it => it.substring(12))
      } else {
        return []
      }
    } else {
      if (typeof value === 'string') {
        return value.startsWith('composite://') ? value.substring(12) : ''
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
          if (item.startsWith('composite://')) {
            openFile(item.substring(12))
          }
        }}
        onClose={onClose}
        style={{ margin: '2px 4px 2px 0' }}
      >
        {item && item.startsWith('composite://') ? item.substring(item.lastIndexOf('/') + 1) : item}
      </Tag>
    )
  }

  // 🔥 自定义树节点渲染：控制图标大小、间距、禁用父节点选择
  const renderTreeNode = (nodeData) => {
    const { isLeaf, label } = nodeData

    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        height: '28px', // 行高统一
        fontSize: '14px'
      }}
      >
        {/* 图标：放大 + 间距 */}
        <Icon
          icon={isLeaf ? 'file' : 'folder'}
          style={{
            fontSize: '16px', // 图标变大
            marginRight: '8px', // 图标文字间距
            color: isLeaf ? '#1890ff' : '#FF9800'
          }}
        />
        {/* 文本 */}
        <span>{label}</span>
      </div>
    )
  }

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
            onChangeWithObject
            searchAutoFocus
            checkRelation='unRelated'
            multiple={options.multiple}
            style={{ width: 320, height: 400 }}
            value={getRemovePrefixValue()}
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
