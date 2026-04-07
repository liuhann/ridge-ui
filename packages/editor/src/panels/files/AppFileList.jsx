import React, { useState, useEffect, useRef } from 'react'

import { Button, Tree, Dropdown, Typography, Toast, Upload, Modal, Input } from '@douyinfe/semi-ui'
import { mapTree } from './buildFileTree.js'
import DialogCreate from './DialogCreate.jsx'
import './file-list.less'

import appStore from '../../store/app.store.js'
import editorStore from '../../store/editor.store.js'
const { Text } = Typography

const ACCEPT_FILES = '.svg,.png,.jpg,.json,.css,.js,.md,.webp,.zip,.gif'

const AppFileList = () => {
  const [dialgeCreateFileType, setDialogCreateFileType] = useState('')
  const [dialogCreateShow, setDialogCreateShow] = useState(false)

  const [currentSelected, setCurrentSelected] = useState(null)
  const [currentDir, setCurrentDir] = useState('/')
  const [currentDirId, setCurrentDirId] = useState(-1)
  const [currentRename, setCurrentRename] = useState(null)
  const [treeData, setTreeData] = useState([])

  const currentAppName = appStore((state) => state.currentAppName)
  const currentAppFilesTree = appStore((state) => state.currentAppFilesTree)
  const exitToAppList = appStore((state) => state.exitToAppList)
  const renameFile = appStore((state) => state.renameFile)
  const uploadFile = appStore((state) => state.uploadFile)
  const moveFile = appStore((state) => state.moveFile)
  const deleteFile = appStore((state) => state.deleteFile)

  const openFile = editorStore(state => state.openFile)
  const openedPages = editorStore(state => state.openedPages)
  const closeAllPages = editorStore(state => state.closeAllPages)

  useEffect(() => {
    setTreeData(getAppTreeData(currentAppFilesTree))
  }, [currentAppFilesTree])

  const getAppTreeData = (treeData) => {
  // SVG 图标集合 —— 专业、简洁、统一
    const ICONS = {
      folder: <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='#6B7280' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M3 7h18l-2 14H5L3 7z' /><path d='M3 7h18l-2 14H5L3 7z' /><path d='M3 7h18l-2 14H5L3 7z' /><path d='M3 7L5 3h6l4 4h6' /></svg>,
      page: <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='#3B82F6' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z' /><polyline points='14,2 14,8 20,8' /></svg>,
      js: <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='#F59E0B' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M16.5 10.5B4.5 4.5 4.5 19.5 16.5 19.5' /><path d='M10 7.5L7.5 10 10 12.5M14 11.5L16.5 14 14 16.5' /></svg>,
      json: <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='#8B5CF6' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M10 7L8 12L10 17M14 7L16 12L14 17' /></svg>,
      image: <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='#EC4899' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><rect x='3' y='3' width='18' height='18' rx='2' ry='2' /><circle cx='8.5' cy='8.5' r='1.5' /><path d='M21 15l-5-5L5 21' /></svg>,
      font: <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='#10B981' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M4 3l4 18h8l4-18' /><path d='M12 3v18' /></svg>,
      audio: <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='#06B6D4' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M9 18V5l12-2v13' /><circle cx='6' cy='18' r='3' /><circle cx='18' cy='16' r='3' /></svg>,
      file: <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='#64748B' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z' /><polyline points='13,2 13,9 20,9' /></svg>,
      md: <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='#64748B' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M13 13l-3-3-3 3' /><path d='M13 11l3 3 3-3' /><rect x='2' y='4' width='20' height='16' rx='2' ry='2' /></svg>
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
      icon: ICONS.folder,
      raw: { path: '/', id: -1 },
      children: fileTree
    }]
  }

  const showCreateDialog = (fileType) => {
    setDialogCreateFileType(fileType)
    setDialogCreateShow(true)
  }

  const onFileUpload = async (files) => {
    for (const file of files) {
      const result = await uploadFile(currentDirId, file)
      if (result) {
        Toast.success('文件上传完成')
      } else {
        Toast.warning({
          content: '文件添加错误：存在相同名称文件',
          duration: 3
        })
      }
    }
  }

  const onRemoveClicked = async (data) => {
    Modal.confirm({
      zIndex: 10001,
      title: '删除后文件无法找回,是否确认',
      content: '推荐您可先通过导出先进行备份',
      onOk: async () => {
        await deleteFile(data.key)
        Toast.success('已经成功删除 ' + data.label)
      }
    })
  }

  const onCopyClicked = async (node) => {
    Toast.success('文件复制完成')
  }

  const onOpenClicked = (node) => {
    if (currentRename && currentRename.key === node.key) return
    if (node.type !== 'directory') {
      openFile(node.key)
    }
  }

  const move = async (node, dragNode, dropToGap) => {
    let parentId = -1

    if (dropToGap === false) { // 放置于node内
      if (node.children) {
        parentId = node.key
      } else {
        parentId = node.raw.parent
      }
    } else {
      parentId = node.raw.parent
    }

    const movedResult = await moveFile(dragNode.key, parentId)

    if (!movedResult) {
      Toast.warning({
        content: '目录移动错误：存在同名的文件',
        duration: 3
      })
    }
  }

  // 根据 key 查找树节点
  const findTreeNodeByKey = (treeData, key) => {
    for (const node of treeData) {
      if (node.key === key) return node
      if (node.children) {
        const res = findTreeNodeByKey(node.children, key)
        if (res) return res
      }
    }
    return null
  }

  const confirmFileRename = async () => {
    let finalName = currentRename.value

    // 找到当前正在重命名的节点
    const node = findTreeNodeByKey(treeData, currentRename.key)

    // 如果是 page 类型，自动补上 .json
    if (node && node.raw?.type === 'page' && !finalName.endsWith('.json')) {
      finalName += '.json'
    }

    const result = await renameFile(currentRename.key, finalName)
    if (result === -1) {
      Toast.error('文件名称冲突')
    } else {
      setCurrentRename(null)
    }
  }

  // const confirmFileRename = async () => {
  //   const result = await renameFile(currentRename.key, currentRename.value)
  //   if (result === -1) {
  //     Toast.error('文件名称冲突')
  //   } else {
  //     setCurrentRename(null)
  //   }
  // }

  const CREATE_MENUS = [
    <Dropdown.Item key='page' icon={<i className='bi bi-file-earmark-plus' />} onClick={() => showCreateDialog('page')}>创建页面</Dropdown.Item>,
    <Dropdown.Item key='folder' icon={<i className='bi bi-folder-plus' />} onClick={() => showCreateDialog('folder')}>创建目录</Dropdown.Item>,
    <Dropdown.Item key='js' icon={<i className='bi bi-clipboard-plus' />} onClick={() => showCreateDialog('js')}>创建脚本库</Dropdown.Item>,
    <Dropdown.Item key='upload' icon={<i class='bi bi-upload' />}>
      <Upload
        action='none'
        multiple showUploadList={false} uploadTrigger='custom' onChange={files => {
          onFileUpload(files)
        }} accept={ACCEPT_FILES}
      >
        上传文件
      </Upload>
    </Dropdown.Item>]

  const renderFullLabel = (label, data) => {
    const MORE_MENUS = []

    if (data.children) { // 位于根
      MORE_MENUS.push(...CREATE_MENUS)
    } else {
      MORE_MENUS.push(
        <Dropdown.Item
          key='open'
          icon={<i className='bi bi-pencil-square' />} onClick={() => {
            onOpenClicked(data)
          }}
        >打开
        </Dropdown.Item>
      )
    }
    MORE_MENUS.push(
      <Dropdown.Item
        key='copy'
        icon={<i className='bi bi-copy' />} onClick={() => {
          onCopyClicked(data)
        }}
      >复制
      </Dropdown.Item>
    )
    MORE_MENUS.push(
      <Dropdown.Item
        key='rename'
        icon={<i className='bi bi-input-cursor-text' />}
        onClick={() => {
          setCurrentRename({
            key: data.key,
            value: label
          })
        }}
      >重命名
      </Dropdown.Item>
    )
    MORE_MENUS.push(
      <Dropdown.Item
        key='export'
        icon={<i style={{ fontSize: '16px' }} className='bi bi-file-zip' />} onClick={() => {
          onFileExportClick(data)
        }}
      >导出
      </Dropdown.Item>
    )
    MORE_MENUS.push(<Dropdown.Divider key='div' />)
    MORE_MENUS.push(
      <Dropdown.Item
        key='delete'
        type='danger'
        icon={<i className='bi bi-trash3' />}
        onClick={() => {
          onRemoveClicked(data)
        }}
      >删除
      </Dropdown.Item>
    )
    return (
      <div className={'tree-label' + ((currentSelected && currentSelected.key === data.key) ? ' opened' : '')}>
        {(currentRename && currentRename.key === data.key)
          ? <Input
              size='small'
              suffix={<i onClick={confirmFileRename} className='bi bi-check2' />}
              onKeyPress={async ({ key }) => {
                if (key === 'Enter') {
                  confirmFileRename()
                }
              }}
              value={currentRename.value} onChange={val => {
                setCurrentRename({
                  ...currentRename,
                  value: val
                })
              }}
            />
          : <>
            <Text ellipsis>{label}</Text>
            <Dropdown
              className='app-files-dropdown'
              trigger='click'
              keepDOM
              position='bottomRight'
              clickToHide
              render={<Dropdown.Menu>{MORE_MENUS}</Dropdown.Menu>}
            >
              <i className='more-button bi bi-three-dots-vertical' />
            </Dropdown>
            </>}
        {/* <Text
          onClick={() => {
            const now = new Date().getTime()
            if (currentSelected && currentSelected.key === data.key && currentSelectedTime && now - currentSelectedTime > 1000 && now - currentSelectedTime < 3000) {
              setCurrentRename({
                key: data.key,
                value: currentSelected.label
              })
            }
          }} ellipsis={{ showTooltip: true }} style={{ width: 'calc(100% - 48px)' }} className='label-content'
        >{label}
        </Text> */}
      </div>
    )
  }

  const RenderCreateDropDown = () => {
    return (
      <div className='panel-sub-title'>
        <Dropdown
          trigger='click'
          closeOnEsc
          clickToHide
          keepDOM
          position='bottomLeft'
          render={
            <Dropdown.Menu className='app-files-dropdown'>
              {CREATE_MENUS}
            </Dropdown.Menu>
          }
        >
          <Button
            style={{
              marginLeft: '12px',
              marginTop: '6px'
            }} colorful theme='outline' type='primary' icon={<i className='bi bi-plus-lg' />}
          >创建
          </Button>
        </Dropdown>
        <Upload
          action='none'
          multiple showUploadList={false} uploadTrigger='custom' onFileChange={files => {
            onFileUpload(files)
          }} accept={ACCEPT_FILES}
        >
          <Button
            style={{
              marginLeft: '12px',
              marginTop: '6px'
            }}
          >
            上传文件
          </Button>
        </Upload>
      </div>
    )
  }

  const onNodeSelect = async node => {
    if (currentSelected && node.id === currentSelected.id) {
      return
    }
    if (currentRename && currentRename.key !== node.key) {
      confirmFileRename()
    }
    if (Array.isArray(node.children)) {
      setCurrentDir(node.raw.path)
      setCurrentDirId(node.raw.id)
    } else {
      if (node.raw.parent) {
        setCurrentDir(node.raw.parentPath)
        setCurrentDirId(node.raw.parent)
      }
    }
    setCurrentSelected(node)
  }

  const confirmExitToAppList = async () => {
    if (openedPages.length) {
      Modal.confirm({
        title: '离开应用',
        content: '确认离开应用并且关闭当前所有打开的页面',
        onOk: async () => {
          await closeAllPages()
          exitToAppList()
        }
      })
    } else {
      exitToAppList()
    }
  }

  // 渲染逻辑
  return (
    <div className='left-panel'>
      <div className='panel-title'>
        <Text type='tertiary'>应用文件</Text>
        <Button type='tertiary' onClick={confirmExitToAppList} theme='borderless' icon={<i className='bi bi-box-arrow-right' />} />
        {/* {currentAppName && RenderShareDropDown()} */}
      </div>
      <DialogCreate
        show={dialogCreateShow}
        type={dialgeCreateFileType}
        parentPath={currentDir}
        parentId={currentDirId}
        close={() => {
          setDialogCreateShow(false)
        }}
      />
      {RenderCreateDropDown()}
      <Tree
        autoExpandParent
        className='file-tree'
        showFilteredOnly
        draggable
        renderLabel={renderFullLabel}
        treeData={treeData}
        onDrop={({ node, dragNode, dropPosition, dropToGap }) => {
          move(node, dragNode, dropToGap)
        }}
        onDoubleClick={(ev, node) => {
          onOpenClicked(node)
        }}
        onSelect={(key, selected, node) => {
          onNodeSelect(node)
        }}
      />
    </div>
  )
}

export default AppFileList
