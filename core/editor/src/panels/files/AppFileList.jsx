import React, { useState, useEffect, useRef } from 'react'

import { Button, Tree, Dropdown, Typography, Toast, Upload, Spin, Modal, Space, Divider, Breadcrumb, Input } from '@douyinfe/semi-ui'
import context from '../../service/RidgeEditorContext.js'
import { mapTree } from './buildFileTree.js'
import DialogCreate from './DialogCreate.jsx'
import { stringToBlob } from '../../utils/blob.js'
import './file-list.less'

import appStore from '../../store/app.store.js'
import editorStore from '../../store/editor.store.js'
const { Text, Paragraph } = Typography

const ACCEPT_FILES = '.svg,.png,.jpg,.json,.css,.js,.md,.webp,.zip,.gif'

const AppFileList = () => {
  const [dialgeCreateFileType, setDialogCreateFileType] = useState('')
  const [dialogCreateShow, setDialogCreateShow] = useState(false)

  const [currentSelected, setCurrentSelected] = useState(null)
  const [currentDir, setCurrentDir] = useState('/')
  const [currentDirId, setCurrentDirId] = useState(-1)
  const [currentRename, setCurrentRename] = useState(null)

  const currentAppName = appStore((state) => state.currentAppName)

  const currentAppFilesTree = appStore((state) => state.currentAppFilesTree)
  const exitToAppList = appStore((state) => state.exitToAppList)
  const renameFile = appStore((state) => state.renameFile)
  const uploadFile = appStore((state) => state.uploadFile)
  const moveFile = appStore((state) => state.moveFile)
  const openFile = editorStore(state => state.openFile)
  const deleteFile = appStore((state) => state.deleteFile)

  const currentOpenPageId = editorStore(state => state.currentOpenPageId)
  const openedPages = editorStore(state => state.openedPages)
  const closeAllPages = editorStore(state => state.closeAllPages)

  // 存储节点映射
  const nodeMap = useRef({})

  const getAppTreeData = (treeData) => {
    const fileTree = mapTree(treeData, file => {
      if (file.mimeType) {
        if (file.mimeType === 'application/font-woff') {
          file.icon = (<i className='bi bi-fonts' />)
        } else if (file.mimeType.indexOf('audio') > -1) {
          file.icon = (<i className='bi bi-file-earmark-music' />)
        } else if (file.mimeType.indexOf('image') > -1) {
          file.icon = <i class='bi bi-image' />
        } else {
          file.icon = <i className='bi bi-file-earmark' />
        }
      }
      file.label = file.name

      if (file.label.endsWith('.md')) {
        file.icon = <i className='bi bi-file-earmark-arrow-down' />
      }
      if (file.label.endsWith('.js')) {
        file.icon = <i class='bi bi-code-slash' />
      }
      if (file.label.endsWith('.json')) {
        file.icon = <i class='bi bi-braces' />
      }
      if (file.type === 'page') {
        file.icon = <i className='bi bi-file-earmark-richtext' />
      }
      if (file.type === 'page') {
        file.icon = <i class='bi bi-box-seam' />
      }
      if (file.type === 'directory') {
        file.icon = <i className='bi bi-folder2' />
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
      raw: {
        path: '/',
        id: -1
      },
      children: fileTree
    }]
  }

  const showCreateDialog = (fileType) => {
    setDialogCreateFileType(fileType)
    setDialogCreateShow(true)
  }

  const onFileUpload = async (files) => {
    for (const file of files) {
      const result = await uploadFile(currentSelected, file)
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
    const { appService } = context.services
    await appService.copy(node.key)
    loadAndUpdateFileTree()
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

  const onFileExportClick = (data) => {
    const { appService } = context.services
    appService.exportFileArchive(data.key)
  }

  const confirmFileRename = async () => {
    const result = await renameFile(currentRename.key, currentRename.value)
    if (result === -1) {
      Toast.error('文件名称冲突')
    } else {
      setCurrentRename(null)
    }
  }

  const CREATE_MENUS = [
    <Dropdown.Item key='page' icon={<i className='bi bi-file-earmark-plus' />} onClick={() => showCreateDialog('page')}>创建页面</Dropdown.Item>,
    <Dropdown.Item key='folder' icon={<i className='bi bi-folder-plus' />} onClick={() => showCreateDialog('folder')}>创建目录</Dropdown.Item>,
    <Dropdown.Item key='js' icon={<i className='bi bi-clipboard-plus' />} onClick={() => showCreateDialog('js')}>创建脚本库</Dropdown.Item>,
    <Dropdown.Item key='upload' icon={<i class='bi bi-upload' />}>
      <Upload
        action='none'
        multiple showUploadList={false} uploadTrigger='custom' onFileChange={files => {
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
          : <Dropdown
              className='app-files-dropdown'
              trigger='contextMenu'
              position='bottomRight'
              clickToHide
              render={<Dropdown.Menu>{MORE_MENUS}</Dropdown.Menu>}
            > <Text>{label}</Text>
          </Dropdown>}
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
    // return (
    //   <div className='file-btns'>
    //     <Button size='small' theme='borderless' type='tertiary' icon={<i class='bi bi-file-earmark-plus' />} onClick={() => showCreateDialog('page')} />
    //     <Button size='small' theme='borderless' type='tertiary' icon={<i className='bi bi-folder-plus' />} onClick={() => showCreateDialog('folder')} />
    //     <Button size='small' theme='borderless' type='tertiary' icon={<i class='bi bi-clipboard-plus' />} onClick={() => showCreateDialog('js')} />
    //     <Upload
    //       action='none'
    //       multiple showUploadList={false} uploadTrigger='custom' onFileChange={files => {
    //         onFileUpload(files)
    //       }} accept={ACCEPT_FILES}
    //     >
    //       <Button size='small' theme='borderless' type='tertiary' icon={<i class='bi bi-upload' />} />
    //     </Upload>

    //   </div>
    // )
    return (
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
        <Button theme='outline' type='primary' icon={<i className='bi bi-plus-lg' style={{ color: 'var(--semi-color-text-0)' }} />} >创建</Button>
      </Dropdown>
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
    <>
      <div className='file-actions'>
        <div className='app-name-exit'>
          <Text>应用文件</Text>
          <Button type='danger' onClick={confirmExitToAppList} theme='borderless' icon={<i className='bi bi-box-arrow-right' />} />
        </div>
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
        className='file-tree'
        showFilteredOnly
        draggable
        renderLabel={renderFullLabel}
        treeData={getAppTreeData(currentAppFilesTree)}
        onDragStart={(target) => {
          if (target.node && target.node.type === 'page') {
            context.draggingComposite = target.node
          } else {
            context.draggingComposite = null
          }
        }}
        onDrop={({ node, dragNode, dropPosition, dropToGap }) => {
          move(node, dragNode, dropToGap)
        }}
        onDoubleClick={(ev, node) => {
          onOpenClicked(node)
        }}
        onContextMenu={(e, node) => {
          onNodeSelect(node)
        }}
        onSelect={(key, selected, node) => {
          onNodeSelect(node)
        }}
        onClick={() => {
          console.log('clicked')
        }}
      />
    </>
  )
}

export default AppFileList
