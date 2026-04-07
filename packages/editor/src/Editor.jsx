import React, { useEffect, useRef, useState } from 'react'

import { ImagePreview, Tabs, TabPane, Spin } from '@douyinfe/semi-ui'

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
import LeftNav from './panels/left-nav/LeftNav.jsx'
import PreviewPanel from './panels/preview/PreviewPanel.jsx'
import ComponentRegistryPanel from './panels/component/ComponentRegistryPanel.jsx'
import componentRegistry from './service/ComponentRegistry.js'

const Editor = () => {
  const workspaceRef = useRef(null)
  const codeEditorRef = useRef(null)
  const viewPortContainerRef = useRef(null)

  const [leftResizing, setLeftResizing] = useState(false)
  const [leftReisizeWidth, setLeftReisizeWidth] = useState(340)
  const [collapseLeft, setCollapseLeft] = useState(false)

  const [currentPanel, setCurrentPanel] = useState('app')

  const openedPages = editorStore((state) => state.openedPages)
  const imagePreviewVisible = editorStore((state) => state.imagePreviewVisible)
  const imagePreviewSrc = editorStore((state) => state.imagePreviewSrc)
  const setWorkspaceControl = editorStore((state) => state.setWorkspaceControl)
  const closeImagePreview = editorStore((state) => state.closeImagePreview)
  const handleWheel = editorStore((state) => state.handleWheel)
  const initStore = editorStore((state) => state.initStore)

  // 🔥 这里加入 isReady
  const currentAppName = appStore((state) => state.currentAppName)
  const isReady = appStore((state) => state.isReady) // 👈 新增
  const initAppStore = appStore((state) => state.initAppStore)

  const appTab = isReady ? (currentAppName ? 'file-list' : 'app-list') : 'loading'
  const pageOpened = openedPages.length > 0

  // 🔥 修复 async 直接写在 useEffect 里（错误写法）
  useEffect(async () => {
    await componentRegistry.init()
    await initAppStore()
    initStore({
      workspaceRef,
      viewPortContainerRef,
      codeEditorRef
    })
    const workspaceControl = new WorkSpaceControl()
    workspaceControl.init({
      workspaceEl: workspaceRef.current,
      viewPortEl: viewPortContainerRef.current,
      editorStore
    })
    setWorkspaceControl(workspaceControl)
  }, [])

  const leftResizingRef = useRef(leftResizing)
  useEffect(() => {
    leftResizingRef.current = leftResizing
  }, [leftResizing])

  useEffect(() => {
    const onMouseMove = (ev) => {
      if (leftResizingRef.current) {
        if (ev.clientX > 250) {
          setLeftReisizeWidth(ev.clientX - 50)
        }
      }
    }
    const onMouseUp = () => setLeftResizing(false)

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('wheel', handleWheel)
    }
  }, [])

  return (
    <div
      className='editor-root'
    >
      <LeftNav onChange={val => setCurrentPanel(val)} />

      <div className='left-content' style={{ width: leftReisizeWidth + 'px' }}>
        <Tabs
          renderTabBar={null}
          activeKey={currentPanel}
          onChange={setCurrentPanel}
          tabPosition='none' // 纵向标签
          style={{ height: '100%' }}
        >
          {/* 应用 → 文件列表 / 应用列表 自动切换 */}
          <TabPane tab='应用' itemKey='app'>
            <Tabs
              activeKey={appTab}
              style={{ height: '100%' }}
            >
              <TabPane tab='组件' itemKey='loading'>
                <Spin spinning size='middle' tip='应用读取中' style={{ minHeight: '600px', height: '100%', width: '100%' }} />
              </TabPane>
              <TabPane tab='组件' itemKey='file-list'>
                <AppFileList />
              </TabPane>
              <TabPane tab='应用' itemKey='app-list'>
                <AppListPanel />
              </TabPane>
            </Tabs>
          </TabPane>

          {/* 组件库 */}
          <TabPane tab='组件' itemKey='component'>
            <ComponentRegistryPanel />
          </TabPane>

          {/* 预览 */}
          <TabPane tab='预览' itemKey='preview'>
            <PreviewPanel />
          </TabPane>
        </Tabs>
      </div>

      <div
        className='left-resizer'
        style={{ width: collapseLeft ? '0' : '4px' }}
        onMouseDown={e => {
          e.preventDefault()
          setLeftResizing(true)
        }}
      />

      <div className='editor-content'>
        <EditMenuBar />
        <div className='workspace-panel'>
          <div ref={workspaceRef} className='workspace'>
            <div className='view-port' isViewPort ref={viewPortContainerRef} />
            {!pageOpened && <div className='no-open-file'><ReactComposite app='ridge-editor-app' path='Welcome' /></div>}
          </div>
          {pageOpened && <ConfigPanel />}
        </div>
      </div>

      <ImagePreview
        src={imagePreviewSrc}
        visible={imagePreviewVisible}
        onVisibleChange={visible => !visible && closeImagePreview()}
      />
      <DialogCodeEdit ref={codeEditorRef} />
    </div>
  )
}

export default Editor
