// components/OutlineTree.jsx
import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { Tree, Space, Typography, Button, Tag, Toast } from '@douyinfe/semi-ui'
import './outline.less'
import useEditorStore from '../../store/editor.store'
import { ICON_EYE, ICON_EYE_CLOSE, ICON_LOCK, ICON_UNLOCK } from '../../icons/icons'

const { Text } = Typography

const OutlineTree = () => {
  // 从 store 获取数据
  const componentTreeData = useEditorStore((state) => state.componentTreeData)
  const updateTreeData = useEditorStore((state) => state.updateTreeData)
  const workspaceControl = useEditorStore((state) => state.workspaceControl)
  const editorComposite = useEditorStore((state) => state.editorComposite)
  const currentEditNodeId = useEditorStore((state) => state.currentEditNodeId)

  useEffect(() => {
    setExpandedKeys([...expandedKeys, currentEditNodeId])
  }, [currentEditNodeId])
  // 本地状态
  const [expandedKeys, setExpandedKeys] = useState([])

  // 查找树节点
  const findNode = useCallback((treeData, key) => {
    for (const node of treeData) {
      if (node.key === key) {
        return node
      }
      if (node.children) {
        const c = findNode(node.children, key)
        if (c) {
          return c
        }
      }
    }
  }, [])

  // 对外提供方法，工作区选择节点调用
  const setCurrentNode = useCallback((node) => {
    if (node) {
      const keys = []
      let treeNode = findNode(componentTreeData, node.getId())

      while (treeNode) {
        keys.push(treeNode.key)
        if (treeNode.parentKey) {
          treeNode = findNode(componentTreeData, treeNode.parentKey)
        } else {
          treeNode = null
        }
      }
      setExpandedKeys(prev => Array.from(new Set([...keys, ...prev])))
    } else {

    }
  }, [componentTreeData, findNode])

  // 点击选择节点
  const onNodeSelected = (val, treeNode) => {
    const node = editorComposite.getNode(val)
    if (node && node.el) {
      workspaceControl.selectElements([node.el], true)
    }
    // const node = getNode(val)
    // if (node) {
    //   if (node.el && node.config.visible && !node.config.locked) {
    //     // 联动workspace选择节点
    //     node.selected?.()
    //     workspaceControl?.selectElements?.([node.el], true)
    //   } else {
    //     workspaceControl?.selectElements?.([])
    //     // 这里可能需要调用其他回调
    //     // context.onElementSelected(node)
    //   }
    // }
  }

  // 切换锁定
  const toggleLock = (data) => {
    const view = data.element
    if (view) {
      const locked = view.getLocked()
      view.setLocked(!locked)
      updateTreeData() // 更新大纲
      if (view.getLocked()) {
        workspaceControl?.selectElements?.([])
      } else {
        workspaceControl?.selectElements?.([view.el])
      }
    }
  }

  // 切换可见
  const toggleVisible = (data) => {
    const view = data.element
    if (view) {
      const hidden = view.getHidden()
      view.setHidden(!hidden)
      updateTreeData() // 更新大纲
      if (view.getHidden()) {
        workspaceControl?.selectElements?.([])
      } else {
        workspaceControl?.selectElements?.([view.el])
      }
    }
  }

  // 渲染标签
  const renderFullLabel = useCallback((label, data) => {
    const { slotLabel } = data
    const isLocked = data.element.getLocked()
    const isHidden = data.element.getHidden()

    return (
      <div className={`tree-label ${isHidden ? 'is-hidden' : 'is-visible'} ${isLocked ? 'is-locked' : ''}`}>
        <Space className='label-content'>
          <Text className='label-text'>{label ?? data.key}</Text>
          {data.tags?.map(tag => (
            <Tag size='small' color='amber' key={tag}> {tag} </Tag>
          ))}
        </Space>
        {!slotLabel
          ? (
            <Space spacing={2}>
              <Button
                className={isLocked ? '' : 'hover-show'}
                size='small'
                theme='borderless'
                type='tertiary'
                onClick={(e) => {
                  e.stopPropagation()
                  toggleLock(data)
                }}
                icon={isLocked ? ICON_LOCK : ICON_UNLOCK}
              />
              <Button
                className={isHidden ? '' : 'hover-show'}
                size='small'
                theme='borderless'
                type='tertiary'
                onClick={(e) => {
                  e.stopPropagation()
                  toggleVisible(data)
                }}
                icon={isHidden ? ICON_EYE_CLOSE : ICON_EYE}
              />
            </Space>
            )
          : (
            <Tag>{slotLabel}</Tag>
            )}
      </div>
    )
  })

  // 拖拽排序
  const ordering = useCallback((siblingNodes, dragNode, node, beforeOrAfter) => {
    const finals = []
    for (let i = 0; i < siblingNodes.length; i++) {
      if (siblingNodes[i].key === node.key) {
        if (beforeOrAfter === -1) {
          finals.push(dragNode.key)
          finals.push(node.key)
        } else if (beforeOrAfter === 1) {
          finals.push(node.key)
          finals.push(dragNode.key)
        }
      } else if (siblingNodes[i].key !== dragNode.key) {
        finals.push(siblingNodes[i].key)
      }
    }
    return finals
  }, [])

  // 树拖拽
  const onTreeDrop = useCallback(({ node, dragNode, dropPosition, dropToGap }) => {
    if (!editorComposite) return

    const dropPos = node.pos.split('-')
    const beforeOrAfter = dropPosition - Number(dropPos[dropPos.length - 1])

    // 查找父节点
    if (node.parentKey) {
      const parentNode = findNode(componentTreeData, node.parentKey)
      node.parent = parentNode
    }
    if (dragNode.parentKey) {
      const parentNode = findNode(componentTreeData, dragNode.parentKey)
      dragNode.parent = parentNode
    }

    const targetParent = node.parent?.element || editorComposite
    const dragParent = dragNode.parent?.element || editorComposite

    if (dropToGap === true) {
      const siblings = node.parent?.children || componentTreeData
      const orders = ordering(siblings, dragNode, node, beforeOrAfter)

      // 移除子节点
      if (targetParent !== dragParent) {
        dragParent.removeChild?.(dragNode.element)
      }

      // 添加子节点
      if (orders.length !== siblings.length) {
        targetParent.appendChild?.(dragNode.element)
      }

      targetParent.updateChildList?.(orders)
    } else {
      if (!node.element.children) {
        Toast.warning({
          content: '目标节点无法再放入子节点',
          duration: 3
        })
        return
      } else {
        dragParent.removeChild?.(dragNode.element)
        node.element.appendChild?.(dragNode.element)
      }
    }

    // 更新大纲
    updateTreeData()
    workspaceControl?.selectElements?.([dragNode.element.el], true)
  }, [editorComposite, componentTreeData, findNode, ordering, updateTreeData, workspaceControl])

  // 双击节点
  const onNodeDblClick = useCallback((node) => {
    if (node.element?.config?.path === 'ridge-container/composite') {
      const filePath = node.element?.config?.props?.pagePath
      if (filePath) {
        // 这里需要根据实际情况处理打开文件
        console.log('打开文件:', filePath)
        // 原有的 context.openFile 逻辑需要另外实现
      }
    }
  }, [])

  // 提供外部访问的方法
  useEffect(() => {
    // 如果需要将 setCurrentNode 暴露给外部，可以在这里处理
    // 例如：window.outlineTree = { setCurrentNode }
  }, [setCurrentNode])

  return (
    <Tree
      className='outline-tree'
      autoExpandWhenDragEnter
      autoExpandParent
      showFilteredOnly
      filterTreeNode
      draggable
      emptyContent='暂无打开的页面'
      renderLabel={renderFullLabel}
      onDrop={onTreeDrop}
      onChange={(value, node) => {
        onNodeSelected(value, node)
      }}
      onDoubleClick={(event, node) => {
        onNodeDblClick(node)
      }}
      onExpand={setExpandedKeys}
      expandedKeys={expandedKeys}
      value={currentEditNodeId}
      treeData={componentTreeData}
    />
  )
}

export default OutlineTree
