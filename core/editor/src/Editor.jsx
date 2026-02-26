import React, { useEffect, useRef, useState, useCallback } from 'react'

import { ImagePreview } from '@douyinfe/semi-ui'

import ConfigPanel from './panels/config/ConfigPanel.jsx'
import DialogCodeEdit from './panels/files/DialogCodeEdit.jsx'
import EditMenuBar from './panels/menu/EditMenuBar.jsx'
import WorkSpaceControl from './workspace/WorkspaceControl'

import editorStore from './store/editor.store.js'
import { ReactComposite } from 'ridgejs'

import './editor.less'
import PreviewMenuBar from './panels/menu/PreviewMenuBar.jsx'
import AppFileList from './panels/files/AppFileList.jsx'
import ridgeEditorContext from './service/RidgeEditorContext.js'

const Editor = () => {
  const workspaceRef = useRef(null)
  const codeEditorRef = useRef(null)
  const viewPortContainerRef = useRef(null)

  const [leftResizing, setLeftResizing] = useState(false)
  const [leftReisizeWidth, setLeftReisizeWidth] = useState(360)
  const [collapseLeft, setCollapseLeft] = useState(false)

  const isPreview = editorStore((state) => state.isPreview)
  const pageOpened = editorStore((state) => state.pageOpened)
  const imagePreviewVisible = editorStore((state) => state.imagePreviewVisible)
  const imagePreviewSrc = editorStore((state) => state.imagePreviewSrc)
  const setWorkspaceControl = editorStore((state) => state.setWorkspaceControl)

  useEffect(() => {
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
          setLeftReisizeWidth(ev.clientX)
        }
      }
    })
    document.addEventListener('mouseup', ev => {
      setLeftResizing(false)
    })
  }, [])

  return (
    <>
      <div
        className='editor-root' style={{
          display: isPreview ? 'none' : ''
        }}
      >
        <div
          style={{
            width: leftReisizeWidth + 'px'
          }}
        >
          <AppFileList />
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
        <div />
      </div>

      <div
        className='preview-root' style={{
          display: isPreview ? '' : 'none'
        }}
      >
        <PreviewMenuBar />
        <div className='preview-container'>
          <div className='preview-view-port' />
        </div>
      </div>

      <ImagePreview
        src={imagePreviewSrc} visible={imagePreviewVisible} onVisibleChange={() => {

        }}
      />
      <DialogCodeEdit
        ref={codeEditorRef}
      />
    </>
  )
}

export default Editor
