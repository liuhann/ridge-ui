import React, { useState, useEffect } from 'react'

import { withField, TreeSelect, Tree, TagInput, Popover, Icon, Tag } from '@douyinfe/semi-ui'

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

  useEffect(() => {
    const filtered = filterTree(currentAppFilesTree, file => {
      return file.mimeType && file.mimeType.indexOf(options.fileType) > -1
    })
    setTreeData(getAppTreeData(filtered, currentAppName))
  }, [currentAppFilesTree])
  console.log('treeData', treeData)

  // 选择文件后，将 composite:// 开头的路径返回给上层
  const changeWithComposite = val => {
    if (options.multiple) {
      onChange && onChange([...val.map(it => 'composite://' + it), ...value.filter(it => !it.startsWith('composite://'))]) // 保留非composite的值
    } else {
      onChange && onChange('composite://' + val)
    }
  }

  // 自行输入的修改
  const changeWithTagInput = val => {
    if (options.multiple) {
      onChange && onChange(val)
    } else {
      onChange && onChange(val[0])
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
        if (value.startsWith('composite://')) {
          return value.substring(12)
        } else {
          return ''
        }
      } else {
        return ''
      }
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
      >
        {item && item.startsWith('composite://') ? item.substring(item.lastIndexOf('/') + 1) : item}
      </Tag>
    )
  }
  return (
    <Popover
      trigger='custom'
      visible={visible}
      onClickOutSide={() => setVisible(false)}
      position='leftTop'
      content={
        <Tree
          searchAutoFocus
          multiple={options.multiple}
          style={{ width: 320, height: 400 }}
          value={getRemovePrefixValue()}
          onChange={changeWithComposite}
          treeData={treeData}
        />
    }
    >
      <TagInput
        onFocus={() => setVisible(true)}
        value={options.multiple ? value : (value ? [value] : [])}
        maxTagCount={options.multiple ? 300 : 1}
        renderTagItem={renderTagItem}
        onChange={changeWithTagInput}
      />
    </Popover>
  )
}

export default withField(AppFileSelectEdit)
