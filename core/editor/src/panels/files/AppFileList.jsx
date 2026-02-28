import React, { useState, useEffect, useRef } from 'react'

import { Button, Tree, Dropdown, Typography, Toast, Upload, Spin, Modal, Space, Divider, Breadcrumb, Input } from '@douyinfe/semi-ui'
import context from '../../service/RidgeEditorContext.js'
import { mapTree } from './buildFileTree.js'
import DialogRename from './DialogRename.jsx'
import DialogCreate from './DialogCreate.jsx'
import { stringToBlob } from '../../utils/blob.js'
import IconFileCode from '../../icons/IconFileCode.jsx'
import { UilShare } from '../../icons/UilShare.jsx'
import { GravityUiAbbrZip } from '../../icons/GravityUiAbbrZip.jsx'
import { CarbonRun } from '../../icons/CarbonRun.jsx'
import IconFolderAdd from '../../icons/IconFolderAdd.jsx'
import IconPageAdd from '../../icons/IconPageAdd.jsx'
import { IxImport } from '../../icons/IxImport.jsx'
import PajamasClearAll from '../../icons/PajamasClearAll.svg'
import OuiExport from '../../icons/OuiExport.svg'
import IconUpload from '../../icons/IconUpload.jsx'
import ProiconsHome from '../../icons/ProiconsHome.svg'
import { FILE_COMPOSITE, FILE_FOLDER, FILE_IMAGE, FILE_JS, FILE_JSON, FILE_MARKDOWN } from '../../icons/icons.js'
import { STORE_TEMPLATE } from '../../utils/template.js'
import './file-list.less'

import appStore from '../../store/app.store.js'
import editorStore from '../../store/editor.store.js'
import AppListPanel from '../apps/AppListPanel.jsx'
import { filename } from 'ridgejs/src/utils/string.js'
import { basename, extname } from '../../utils/string.js'
const { Text, Paragraph } = Typography

const ACCEPT_FILES = '.svg,.png,.jpg,.json,.css,.js,.md,.webp,.zip,.gif'

const AppFileList = () => {
  const [state, setState] = useState({
    dialgeCreateFileType: '',
    dialogCreateShow: false,
    dialogCreateTitle: '',
    appJSONObject: null,
    createParentNodeId: -1,
    packageEditDialogVisible: false,
    packageSearchDialogVisible: false,
    publishing: false,
    exportToastId: null
  })
  const currentAppName = appStore((state) => state.currentAppName)

  const [currentSelected, setCurrentSelected] = useState(null)
  const [currentSelectedTime, setCurrentSelectedTime] = useState(0)
  const [currentRename, setCurrentRename] = useState(null)

  const currentAppFilesTree = appStore((state) => state.currentAppFilesTree)
  const setCurrentAppName = appStore((state) => state.setCurrentAppName)
  const initAppStore = appStore((state) => state.initAppStore)
  const createFolder = appStore((state) => state.createFolder)
  const fileRename = appStore((state) => state.fileRename)

  const openFile = editorStore(state => state.openFile)

  // 存储节点映射
  const nodeMap = useRef({})

  // 挂载时初始化
  useEffect(() => {
    initAppStore()
  }, [])

  const getAppTreeData = (treeData) => {
    const fileTree = mapTree(treeData, file => {
      if (file.mimeType) {
        if (file.mimeType === 'application/font-woff') {
          file.icon = (<i className='bi bi-fonts' />)
        } else if (file.mimeType.indexOf('audio') > -1) {
          file.icon = (<i className='bi bi-file-earmark-music' />)
        } else if (file.mimeType.indexOf('image') > -1) {
          file.icon = FILE_IMAGE
        } else {
          file.icon = <i className='bi bi-file-earmark' />
        }
      }
      file.label = file.name

      if (file.type === 'page') {
        file.label = basename(file.name, '.json')
      }

      if (file.label.endsWith('.svg')) {
        file.icon = FILE_IMAGE
      }
      if (file.label.endsWith('.md')) {
        file.icon = FILE_MARKDOWN
      }
      if (file.label.endsWith('.js')) {
        file.icon = FILE_JS
      }
      if (file.label.endsWith('.json')) {
        file.icon = FILE_JSON
      }
      if (file.type === 'page') {
        file.icon = FILE_COMPOSITE
      }
      if (file.type === 'directory') {
        file.icon = FILE_FOLDER
      }

      return {
        path: file.parentPath + '/' + file.name,
        icon: file.icon,
        label: file.label,
        id: file.id,
        key: file.id
      }
    })
    return fileTree
  }

  // computed 相关方法
  const getCurrentSiblingNames = () => {
    const { selectedNodeKey, treeData } = state
    let siblings = []
    if (selectedNodeKey) {
      const node = nodeMap.current[selectedNodeKey]
      siblings = node.parent === -1 ? treeData : node.parentNode.children
    } else {
      siblings = treeData
    }
    return siblings.map(node => node.label)
  }

  const getCurrentPath = () => {
    const { selectedNodeKey } = state
    if (selectedNodeKey) {
      const node = nodeMap.current[selectedNodeKey]
      if (node.type === 'directory') {
        return node.path
      } else if (node.parentNode) {
        return node.parentNode.path
      } else {
        return '/'
      }
    } else {
      return '/'
    }
  }

  const getCurrentParentId = () => {
    const { selectedNodeKey } = state
    if (selectedNodeKey) {
      const node = nodeMap.current[selectedNodeKey]
      if (node.type === 'directory') {
        return node.key
      } else {
        return node.parent
      }
    } else {
      return -1
    }
  }

  const openSearchPackageDialog = () => {
    setState(prev => ({
      ...prev,
      packageSearchDialogVisible: true
    }))
  }

  const showCreateDialog = (fileType) => {
    const titles = {
      js: '创建程序文件',
      page: '创建页面',
      text: '创建文本文件',
      folder: '创建目录'
    }
    setState(prev => ({
      ...prev,
      dialgeCreateFileType: fileType,
      dialogCreateShow: true,
      dialogCreateTitle: titles[fileType]
    }))
  }

  const onCreateConfirm = async (name) => {
    const { dialgeCreateFileType, createParentNodeId } = state
    const { appService } = context.services
    try {
      if (dialgeCreateFileType === 'page') {
        await appService.createComposite(getCurrentParentId(), name)
      } else if (dialgeCreateFileType === 'folder') {
        await createFolder(createParentNodeId, name)
        // appService.createDirectory(getCurrentParentId(), name)
      } else if (dialgeCreateFileType === 'js') {
        await appService.createFile(getCurrentParentId(), name, stringToBlob(STORE_TEMPLATE, 'text/javascript'))
      } else if (dialgeCreateFileType === 'text') {
        await appService.createFile(getCurrentParentId(), name, stringToBlob('', 'text/plain'))
      }
      setState(prev => ({ ...prev, dialogCreateShow: false }))
      Toast.success('已经成功创建 ' + name)
      await loadAndUpdateFileTree()
    } catch (e) {
      Toast.success('创建文件失败 ' + e)
    }
  }

  const onFileUpload = async (files) => {
    const { appService } = context.services
    const errors = []
    for (const file of files) {
      try {
        if (file.name.endsWith('.zip')) {
          await appService.backUpService.importFolderArchive(file, getCurrentPath())
        } else {
          const result = await appService.createFile(getCurrentParentId(), file.name, file)
        }
      } catch (e) {
        errors.push(file)
      }
    }
    await loadAndUpdateFileTree()
    if (errors.length) {
      Toast.warning({
        content: '文件添加错误：存在相同名称文件',
        duration: 3
      })
    } else {
      Toast.success('文件上传完成')
    }
  }

  const onRemoveClicked = async (data) => {
    const openedFileMap = context.getOpenedFileMap()

    if (openedFileMap.has(data.id)) {
      Toast.warning('此页面在工作区已经打开，请先关闭再删除页面')
      return
    }

    Modal.confirm({
      zIndex: 10001,
      title: '确认删除',
      content: '删除后文件无法找回，推荐您可先通过导出进行备份',
      onOk: async () => {
        const { appService } = context.services
        await appService.deleteFile(data.key)
        setState(prev => ({ ...prev, selectedNodeKey: null }))
        loadAndUpdateFileTree()
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
      if (node.type === 'directory') {
        parentId = node.key
      } else {
        parentId = node.parent
      }
    } else {
      parentId = node.parent
    }
    const { appService } = context.services
    const moveResult = await appService.move(dragNode.key, parentId)
    if (moveResult) {
      await loadAndUpdateFileTree()
    } else {
      Toast.warning({
        content: '目录移动错误：存在同名的文件',
        duration: 3
      })
    }
  }

  const onUploadAppArchive = async (file) => {
    const { appService } = context.services
    await appService.importAppArchive(file)
  }

  const onFileExportClick = (data) => {
    const { appService } = context.services
    appService.exportFileArchive(data.key)
  }

  const exportApp = async (isArchive) => {
    if (state.exportToastId) {
      return
    }
    const id = Toast.info({
      content: '正在导出应用，请稍侯...',
      duration: 0,
      onClose: () => {
        setState(prev => ({ ...prev, exportToastId: null }))
      }
    })
    setState(prev => ({ ...prev, exportToastId: id }))
    const { appService } = context.services
    if (isArchive) {
      await appService.exportAppArchive()
    } else {
      await context.services.distributeService.distributeApp()
    }
    Toast.close(id)
    setState(prev => ({ ...prev, exportToastId: null }))
  }

  const newEmptyApp = () => {
    Modal.confirm({
      title: '新增应用',
      content: '确认新增应用？ 现有工作区间内容将会被清除。如果需要内容，您可以先整体导出应用内容',
      onOk: () => {
        const { appService } = context.services
        appService.reset()
      }
    })
  }

  const renderFullLabel = (label, data) => {
    const { currentOpenId } = state
    const MORE_MENUS = []

    MORE_MENUS.push(
      <Dropdown.Item
        key='open'
        icon={<i className='bi bi-pencil-square' />} onClick={() => {
          onOpenClicked(data)
        }}
      >打开
      </Dropdown.Item>
    )
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
      <div className={'tree-label' + (currentOpenId === data.key ? ' opened' : '')}>
        {currentRename && currentRename.key === data.key && <Input
          onKeyPress={async ({ key }) => {
            if (key === 'Enter') {
              const result = await fileRename(currentRename.key, currentRename.value)
              if (result === -1) {
                Toast.error('文件名称冲突')
              } else {
                setCurrentRename(null)
              }
            }
          }}
          value={currentRename.value} onChange={val => {
            setCurrentRename({
              ...currentRename,
              value: val
            })
          }}
                                                            />}
        <Text
          onClick={() => {
            if (currentSelected && currentSelected.key === data.key && currentSelectedTime && new Date().getTime() - currentSelectedTime > 1000) {
              setCurrentRename({
                key: data.key,
                value: currentSelected.label
              })
            }
          }} ellipsis={{ showTooltip: true }} style={{ width: 'calc(100% - 48px)' }} className='label-content'
        >{label}
        </Text>
        <Dropdown
          className='app-files-dropdown'
          trigger='click'
          clickToHide
          render={<Dropdown.Menu>{MORE_MENUS}</Dropdown.Menu>}
        >
          <Button className='more-button' size='small' theme='borderless' type='tertiary' icon={<i className='bi bi-three-dots-vertical' />} />
        </Dropdown>
      </div>
    )
  }

  const RenderAppImportDialog = () => {
    const { dialogImportShow } = state
    return (
      <Modal
        width={560}
        title='导入/导出项目'
        visible={dialogImportShow}
        okText='关闭'
        hasCancel={false}
        onCancel={() => {
          setState(prev => ({ ...prev, dialogImportShow: false }))
        }}
        onOk={() => {
          setState(prev => ({ ...prev, dialogImportShow: false }))
        }}
      >
        <Paragraph>项目整体导入</Paragraph>
        <Text type='danger'>选择导入后，现有工作目录会被替换，建议先通过导出方式提前备份</Text>
        <Space style={{
          padding: '10px 0'
        }}
        >
          <Upload
            action='none' showUploadList={false} uploadTrigger='custom' accept='.zip' onFileChange={async files => {
              await onUploadAppArchive(files[0])
              window.location.reload()
            }}
          >
            <Button theme='light'>
              选择项目文件(zip)
            </Button>
          </Upload>
        </Space>

        <Paragraph>导出为压缩文件</Paragraph>
        <Space style={{
          padding: '10px 0'
        }}
        >
          <Button
            theme='light' onClick={() => {
              exportApp()
            }}
          >
            导出
          </Button>
        </Space>
      </Modal>
    )
  }

  const RenderCreateDropDown = () => {
    return (
      <Dropdown
        trigger='click'
        closeOnEsc
        clickToHide
        keepDOM
        position='bottomLeft'
        render={
          <Dropdown.Menu className='app-files-dropdown'>
            <Dropdown.Item icon={<IconPageAdd />} onClick={() => showCreateDialog('page')}>创建页面</Dropdown.Item>
            <Dropdown.Item icon={<IconFolderAdd />} onClick={() => showCreateDialog('folder')}>创建目录</Dropdown.Item>
            <Dropdown.Item icon={<IconFileCode />} onClick={() => showCreateDialog('js')}>创建脚本库</Dropdown.Item>
            <Dropdown.Item icon={<IconUpload />}>
              <Upload
                action='none'
                multiple showUploadList={false} uploadTrigger='custom' onFileChange={files => {
                  onFileUpload(files)
                }} accept={ACCEPT_FILES}
              >
                上传文件
              </Upload>
            </Dropdown.Item>
          </Dropdown.Menu>
        }
      >
        <Button theme='borderless' type='tertiary' icon={<i className='bi bi-plus-lg' style={{ color: 'var(--semi-color-text-0)' }} />} />
      </Dropdown>
    )
  }

  const RenderShareDropDown = () => {
    return (
      <Dropdown
        trigger='hover'
        closeOnEsc
        clickToHide
        keepDOM
        position='bottomLeft'
        render={
          <Dropdown.Menu className='app-files-dropdown'>
            <Dropdown.Item
              icon={<CarbonRun />} onClick={() => {
                exportApp(false)
              }}
            >导出运行包
            </Dropdown.Item>
            <Dropdown.Divider title='项目导入/导出' />
            <Dropdown.Item
              icon={<GravityUiAbbrZip />} onClick={() => {
                exportApp(true)
              }}
            >导出为压缩包
            </Dropdown.Item>
            <Dropdown.Item icon={<IxImport />}>
              <Upload
                action='none' showUploadList={false} uploadTrigger='custom' accept='.zip' onFileChange={async files => {
                  await onUploadAppArchive(files[0])
                  window.location.reload()
                }}
              >
                导入压缩包
              </Upload>
            </Dropdown.Item>
          </Dropdown.Menu>
        }
      >
        <Button theme='borderless' type='tertiary' icon={<UilShare />} />
      </Dropdown>
    )
  }

  const onRootListClick = () => {
    setCurrentAppName('')
  }

  const onNodeSelect = async node => {
    if (currentSelected && node.id === currentSelected.id) {
      return
    }
    if (currentRename && currentRename.key !== node.key) {
      const result = await fileRename(currentRename.key, currentRename.value)
      if (result === -1) {
        Toast.error('文件名称冲突')
      }
      setCurrentRename(null)
    }
    setCurrentSelected(node)
    setCurrentSelectedTime(new Date().getTime())
  }

  // 渲染逻辑
  const { dialogCreateShow, dialogCreateTitle, dialogRenameShow, valueRename } = state
  return (
    <>
      <div className='file-actions panel-actions'>
        <Breadcrumb
          style={{ flex: 1 }} showTooltip={{
            width: 80
          }}
        >
          <Breadcrumb.Item onClick={onRootListClick} icon={<ProiconsHome />}>全部应用</Breadcrumb.Item>
          {currentAppName && <Breadcrumb.Item>{currentAppName}</Breadcrumb.Item>}
        </Breadcrumb>
        {currentAppName && RenderCreateDropDown()}
        {currentAppName && RenderShareDropDown()}
      </div>
      <DialogCreate
        show={dialogCreateShow}
        title={dialogCreateTitle}
        confirm={val => {
          onCreateConfirm(val)
        }}
        cancel={() => {
          setState(prev => ({ ...prev, dialogCreateShow: false }))
        }}
      />
      {currentAppName &&
        <Tree
          className='file-tree'
          showFilteredOnly
          filterTreeNode
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
          onChangeWithObject
          onSelect={(key, selected, node) => {
            onNodeSelect(node)
          }}
          onClick={() => {
            console.log('clicked')
          }}
          onChange={(node) => {
            // setState(prev => ({ ...prev, selectedNodeKey: key }))
          }}
        />}
      {!currentAppName && <AppListPanel />}
      {RenderAppImportDialog()}
    </>
  )
}

export default AppFileList
