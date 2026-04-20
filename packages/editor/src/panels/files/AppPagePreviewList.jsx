import React, { useState, useEffect, useMemo } from 'react'
import { Tree, Typography, Button } from '@douyinfe/semi-ui'
import './file-list.less'

import appStore from '../../store/app.store.js'
import { getAppTreeData } from './utils.js'
import { ICON_COMMON_START } from '../../icons/icons'
const { Text } = Typography

const AppPagePreviewList = ({ onRunPage }) => {
  const [pageTreeData, setPageTreeData] = useState([])
  const [currentSelected, setCurrentSelected] = useState(null)
  const [hoveredNode, setHoveredNode] = useState(null)

  const currentAppName = appStore((state) => state.currentAppName)
  const currentAppFilesTree = appStore((state) => state.currentAppFilesTree)
  const previewPage = appStore((state) => state.previewPage)

  // 转换树数据，只保留目录和页面节点
  const transformToPageTree = useMemo(() => {
    const transformNode = (node) => {
      // 如果是页面节点，直接返回
      if (node.raw?.type === 'page') {
        return {
          ...node,
          // 移除原始的子节点，因为我们只展示页面
          children: undefined
        }
      }

      // 如果是目录节点，处理子节点
      if (node.children && node.children.length > 0) {
        const processedChildren = node.children
          .map(transformNode)
          .filter(child => child !== null) // 过滤掉没有有效子节点的目录

        // 如果处理后没有子节点，则过滤掉这个空目录
        if (processedChildren.length === 0) {
          return null
        }

        return {
          ...node,
          children: processedChildren
        }
      }

      // 其他类型的节点过滤掉
      return null
    }

    return (treeData) => {
      const result = treeData.map(transformNode).filter(node => node !== null)
      return result
    }
  }, [])

  useEffect(() => {
    if (currentAppFilesTree) {
      const fullTreeData = getAppTreeData(currentAppFilesTree, currentAppName)
      const filteredTree = transformToPageTree(fullTreeData)
      setPageTreeData(filteredTree)
    }
  }, [currentAppFilesTree, currentAppName, transformToPageTree])

  const renderPageLabel = (label, data) => {
    const isPageNode = data.raw?.type === 'page'
    const isHovered = hoveredNode === data.key
    const showRunButton = isPageNode && (isHovered || data.key === currentSelected?.key)

    return (
      <div
        className='tree-label'
        onMouseEnter={() => setHoveredNode(data.key)}
        onMouseLeave={() => setHoveredNode(null)}
      >
        <Text
          ellipsis
          style={{
            flex: 1,
            paddingRight: isPageNode ? '40px' : '8px',
            fontSize: '13px',
            lineHeight: '20px'
          }}
        >
          {isPageNode ? label.replace('.json', '') : label}
        </Text>

        {isPageNode && (
          <div
            className={`page-run-button ${showRunButton ? 'visible' : 'hidden'}`}
          >
            <Button
              icon={ICON_COMMON_START}
              onClick={(e) => {
                e.stopPropagation()
                previewPage(data)
              }}
              className='run-btn'
            >
              运行
            </Button>
          </div>
        )}
      </div>
    )
  }

  const handleNodeSelect = (key, selected, node) => {
    setCurrentSelected(node)
  }

  return (
    <div className='page-preview-panel'>
      <div className='panel-title'>
        <Text
          style={{
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--semi-color-text-0)'
          }}
        >
          页面预览
        </Text>
        <div className='page-count'>
          <Text size='small' type='tertiary'>
            {countPages(pageTreeData)} 个页面
          </Text>
        </div>
      </div>

      <div className='page-tree-container'>
        {pageTreeData.length > 0
          ? (
            <Tree
              className='file-tree page-preview-tree'
              treeData={pageTreeData}
              renderLabel={renderPageLabel}
              onSelect={handleNodeSelect}
              selectedKey={currentSelected?.key}
              defaultExpandAll
              searchRender={false}
              showFilteredOnly={false}
              filterTreeNode={false}
            />
            )
          : (
            <div className='empty-pages'>
              <Text type='tertiary' style={{ fontSize: '13px' }}>
                暂无页面
              </Text>
            </div>
            )}
      </div>
    </div>
  )
}

// 辅助函数：计算页面总数
const countPages = (treeData) => {
  let count = 0

  const traverse = (nodes) => {
    nodes.forEach(node => {
      if (node.raw?.type === 'page') {
        count++
      }
      if (node.children) {
        traverse(node.children)
      }
    })
  }

  if (treeData && treeData.length > 0) {
    traverse(treeData)
  }

  return count
}

export default AppPagePreviewList
