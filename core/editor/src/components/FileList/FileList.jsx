import React, { useState } from 'react'
import { List, Button, Dropdown, Menu, Typography, Space } from '@douyinfe/semi-ui'
import { IconFolderStroked, IconMore, IconMoreStroked } from '@douyinfe/semi-icons'
import './style.less'

// 按文件类型匹配图标
const getFileIcon = (fileType) => {
  const iconMap = {
    folder: <i class='bi bi-folder2' />
  }
  return iconMap[fileType] || iconMap.folder
}

// 文件列表组件
const FileList = ({
  onItemClick,
  fileData = [],
  menu = [
    { node: 'item', name: '打开' },
    { node: 'item', name: '导出可执行包', type: 'tertiary' },
    { node: 'item', name: '导出归档', type: 'tertiary' },
    { node: 'divider' },
    { node: 'item', name: '删除', type: 'danger' }
  ]
}) => {
  return (
    <div className='app-file-list'>
      {fileData && fileData.map((file, index) => {
        return (
          <div key={index} className='file'>
            <div
              className='more-button' style={{ position: 'absolute', top: 4, right: 4 }} onDoubleClick={() => {
                onItemClick && onItemClick(file)
              }}
            >
              <Dropdown
                position='bottomLeft'
                trigger='click'
                menu={menu.map(m => {
                  return {
                    ...m,
                    onClick: () => {
                      m.onClick && m.onClick(file)
                    }
                  }
                })}
              >
                <Button size='small' theme='borderless' type='tertiary' icon={<i class='bi bi-three-dots-vertical' />} />
              </Dropdown>
            </div>

            {/* 文件图标和名称 */}
            <Space className='content-box' vertical align='center'>
              {getFileIcon(file.type)}
              <Typography.Text ellipsis style={{ width: '100%', textAlign: 'center', marginTop: 0 }}>
                {file.name}
              </Typography.Text>
            </Space>
          </div>
        )
      })}
    </div>
  )
}

// 示例使用
const App = () => {
  // 模拟文件数据
  const mockFileData = [
    { id: 1, name: '项目需求文档.txt', type: 'txt' },
    { id: 2, name: '首页设计稿.png', type: 'png' },
    { id: 3, name: '产品演示视频.mp4', type: 'mp4' },
    { id: 4, name: '技术方案.pdf', type: 'pdf' },
    { id: 5, name: '组件封装.jsx', type: 'jsx' },
    { id: 6, name: '用户头像.jpg', type: 'jpg' },
    { id: 7, name: '接口代码.js', type: 'js' }
  ]

  return <FileList fileData={mockFileData} />
}

export { FileList }

export default App
