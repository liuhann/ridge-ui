import React, { useEffect, useRef, useState } from 'react'
import {
  ImagePreview,
  Tabs,
  TabPane,
  Spin,
  ResizeGroup,
  ResizeItem,
  ResizeHandler
} from '@douyinfe/semi-ui'
import { IconSidebar } from '@douyinfe/semi-icons'

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

  const [collapseLeft, setCollapseLeft] = useState(false)
  const [currentPanel, setCurrentPanel] = useState('app')
  const [leftContentWidth, setLeftContentWidth] = useState(340) // 存储左侧宽度

  const openedPages = editorStore((state) => state.openedPages)
  const imagePreviewVisible = editorStore((state) => state.imagePreviewVisible)
  const imagePreviewSrc = editorStore((state) => state.imagePreviewSrc)
  const setWorkspaceControl = editorStore((state) => state.setWorkspaceControl)
  const closeImagePreview = editorStore((state) => state.closeImagePreview)
  const handleWheel = editorStore((state) => state.handleWheel)
  const initStore = editorStore((state) => state.initStore)

  const currentAppName = appStore((state) => state.currentAppName)
  const isReady = appStore((state) => state.isReady)
  const initAppStore = appStore((state) => state.initAppStore)

  const appTab = isReady ? (currentAppName ? 'file-list' : 'app-list') : 'loading'
  const pageOpened = openedPages.length > 0

  useEffect(() => {
    const initialize = async () => {
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
    }
    initialize()
  }, [])

  // 监听wheel事件
  useEffect(() => {
    document.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      document.removeEventListener('wheel', handleWheel)
    }
  }, [])

  return (
    <div className='editor-root'>
      <LeftNav onChange={val => setCurrentPanel(val)} />

      {/* 使用 ResizeGroup 替换手动拖拽实现 */}
      <ResizeGroup direction='horizontal' className='editor-resize-group'>
        {/* 左侧内容区域 */}
        <ResizeItem
          defaultSize={leftContentWidth + 'px'}
          min='280px'
          max='600px'
          onResize={(size) => {
            setLeftContentWidth(parseInt(size))
          }}
          style={{
            display: collapseLeft ? 'none' : 'block',
            height: '100%',
            overflow: 'hidden'
          }}
        >
          <div className='left-content'>
            <Tabs
              renderTabBar={null}
              activeKey={currentPanel}
              onChange={setCurrentPanel}
              tabPosition='none'
              style={{ height: '100%' }}
            >
              {/* 应用 → 文件列表 / 应用列表 自动切换 */}
              <TabPane tab='应用' itemKey='app'>
                <Tabs
                  activeKey={appTab}
                  style={{ height: '100%' }}
                >
                  <TabPane tab='组件' itemKey='loading'>
                    <Spin
                      spinning
                      size='middle'
                      tip='应用读取中'
                      style={{
                        minHeight: '600px',
                        height: '100%',
                        width: '100%'
                      }}
                    />
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
        </ResizeItem>

        {/* 拖拽手柄 */}
        <ResizeHandler style={{
          width: 4,
          background: 'var(--semi-color-bg-0)',
          borderRight: '1px solid var(--semi-color-border)',
          zIndex: 99
        }}
        >
          <div />
        </ResizeHandler>

        {/* 右侧编辑区域 */}
        <ResizeItem
          min='400px'
          style={{
            height: '100%',
            overflow: 'hidden',
            flex: 1
          }}
        >
          <div className='editor-content'>
            <EditMenuBar />
            <div className='workspace-panel'>
              <div ref={workspaceRef} className='workspace'>
                <div className='view-port' isViewPort ref={viewPortContainerRef} />
                {!pageOpened && (
                  <div className='no-open-file'>
                    <ReactComposite app='ridge-editor-app' path='Welcome' />
                  </div>
                )}
              </div>
              {pageOpened && <ConfigPanel />}
            </div>
          </div>
        </ResizeItem>
      </ResizeGroup>

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
