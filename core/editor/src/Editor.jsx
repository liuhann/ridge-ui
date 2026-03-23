import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'

import { ImagePreview } from '@douyinfe/semi-ui'

import ConfigPanel from './panels/config/ConfigPanel.jsx'
import DialogCodeEdit from './panels/files/DialogCodeEdit.jsx'
import EditMenuBar from './panels/menu/EditMenuBar.jsx'
import WorkSpaceControl from './workspace/WorkspaceControl'

import editorStore from './store/editor.store.js'
import appStore from './store/app.store.js'
import { ReactComposite } from 'ridgejs'

import './editor.less'
import './panels/common.less'
import AppFileList from './panels/files/AppFileList.jsx'
import AppListPanel from './panels/apps/AppListPanel.jsx'
import ridgeEditorContext from './service/RidgeEditorContext.js'
import LeftNav from './panels/left-nav/LeftNav.jsx'
import PreviewPanel from './panels/preview/PreviewPanel.jsx'

const Editor = () => {
  const workspaceRef = useRef(null)
  const codeEditorRef = useRef(null)
  const viewPortContainerRef = useRef(null)

  const [leftResizing, setLeftResizing] = useState(false)
  const [leftReisizeWidth, setLeftReisizeWidth] = useState(300)
  const [collapseLeft, setCollapseLeft] = useState(false)

  const [currentPanel, setCurrentPanel] = useState('app')

  const isPreview = editorStore((state) => state.isPreview)
  const openedPages = editorStore((state) => state.openedPages)
  const imagePreviewVisible = editorStore((state) => state.imagePreviewVisible)
  const imagePreviewSrc = editorStore((state) => state.imagePreviewSrc)
  const setWorkspaceControl = editorStore((state) => state.setWorkspaceControl)
  const closeImagePreview = editorStore((state) => state.closeImagePreview)
  const initStore = editorStore((state) => state.initStore)

  const currentAppName = appStore((state) => state.currentAppName)
  const loadingAppFiles = appStore((state) => state.loadingAppFiles)
  const initAppStore = appStore((state) => state.initAppStore)

  const pageOpened = openedPages.length > 0

  useEffect(() => {
    // 挂载时初始化
    initAppStore()

    initStore({
      workspaceRef,
      viewPortContainerRef,
      codeEditorRef
    })
    const workspaceControl = new WorkSpaceControl()
    workspaceControl.init({
      workspaceEl: workspaceRef.current,
      viewPortEl: viewPortContainerRef.current,
      context: ridgeEditorContext,
      editorStore
    })
    setWorkspaceControl(workspaceControl)
    // editorStore().setState({})
  }, [])

  const leftResizingRef = useRef(leftResizing)
  // 2. 同步 state 到 ref（每次 leftResizing 变化时更新 ref）
  useEffect(() => {
    leftResizingRef.current = leftResizing
  }, [leftResizing])

  useEffect(() => {
    // 执行事件绑定
    document.addEventListener('mousemove', ev => {
      if (leftResizingRef.current) {
        if (ev.clientX > 250) {
          setLeftReisizeWidth(ev.clientX - 50)
        }
      }
    })
    document.addEventListener('mouseup', ev => {
      setLeftResizing(false)
    })
  }, [])

  const LeftPanel = useMemo(() => {
    return () => {
      if (currentPanel === 'app') {
        return currentAppName ? <AppFileList /> : <AppListPanel />
      } else if (currentPanel === 'preview') {
        return <PreviewPanel />
      } else if (currentPanel === 'component') {
        return null
      }
      return null
    }
  }, [currentPanel, currentAppName]) // 仅依赖变化时重新创建

  return (
    <>
      <div
        className='editor-root' style={{
          display: isPreview ? 'none' : ''
        }}
      >
        <LeftNav onChange={val => {
          setCurrentPanel(val)
        }}
        />
        <div
          style={{
            width: leftReisizeWidth + 'px'
          }}
        >
          <LeftPanel />
        </div>
        <div
          className='left-resizer'
          style={{
            width: collapseLeft ? '0' : '4px'
          }}
          onMouseDown={e => {
            e.preventDefault()
            setLeftResizing(true)
          }}
        />
        <div className='editor-content'>
          <EditMenuBar />
          <div className='workspace-panel'>
            <div ref={workspaceRef} className='workspace'>
              <div className='view-port' ref={viewPortContainerRef} />
              {
                !pageOpened && <div className='no-open-file'><ReactComposite app='ridge-editor-app' path='Welcome' /></div>
              }
            </div>
            {pageOpened && <ConfigPanel />}
          </div>
        </div>
        <ImagePreview
          src={imagePreviewSrc} visible={imagePreviewVisible} onVisibleChange={visible => {
            if (!visible) {
              closeImagePreview()
            }
          }}
        />
        <DialogCodeEdit
          ref={codeEditorRef}
        />
      </div>

      <div
        className='preview-root' style={{
          display: isPreview ? '' : 'none'
        }}
      >
        <div className='preview-container'>
          <div className='preview-view-port' />
        </div>
      </div>
    </>
  )
}

export default Editor
