import React from 'react'
import { Button, Divider, confirm, Space, ButtonGroup, Modal, Dropdown, InputNumber, Tooltip, Tabs, TabPane, Popover } from '@douyinfe/semi-ui'
import context from '../../service/RidgeEditorContext.js'
import './style.less'

import editorStore from '../../store/editor.store.js'

const EditorMenuBar = () => {
  const currentOpenPageId = editorStore(state => state.currentOpenPageId)
  const openedPages = editorStore(state => state.openedPages)
  const unsavedPages = editorStore(state => state.unsavedPages)
  const saveCurrentPage = editorStore(state => state.saveCurrentPage)

  const zoom = editorStore(state => state.zoom)
  const setZoom = editorStore(state => state.setZoom)
  const closePage = editorStore(state => state.closePage)
  const switchPage = editorStore(state => state.switchPage)

  const onTabClose = async tabKey => {
    if (unsavedPages.indexOf(tabKey) > -1) {
      await Modal.confirm({
        title: '确认',
        content: '当前页面尚未保存，关闭将丢失所有改动，是否确认',
        onOk: () => {
          closePage(tabKey)
        }
      })
    } else {
      closePage(tabKey)
    }
  }

  const switchToPage = tabKey => {
    switchPage(tabKey)
  }

  const savePage = () => {
    saveCurrentPage()
  }

  return (
    <div
      className='menu-bar'
    >
      <Tabs
        className='page-tabs' type='card' activeKey={currentOpenPageId} onTabClose={onTabClose} onTabClick={switchToPage}
      >
        {openedPages.map(t => (
          <TabPane icon={unsavedPages.indexOf(t.id) > -1 ? <i class='bi bi-circle-fill' /> : null} closable tab={t.name} itemKey={t.id} key={t.id} />
        ))}
      </Tabs>
      <Space className='bar-content'>
        <Button
          disabled={!currentOpenPageId}
          type='tertiary' icon={<i className='bi bi-floppy' />} theme='borderless' onClick={savePage}
        />
        <InputNumber
          disabled={!currentOpenPageId} style={{ width: '96px', background: 'transparent' }} value={Math.floor(zoom * 100)} suffix='%' onChange={val => {
            setZoom(val / 100)
          }}
        />
        <Divider layout='vertical' />
        {/* <Tooltip content='切换显示容器轮廓'>
            <Button
              type={showContainer ? 'primary' : 'tertiary'}
              theme={showContainer ? 'solid' : 'borderless'}
              icon={<i className='bi bi-intersect' />}
              onClick={() => {
                this.setState({
                  showContainer: !showContainer
                })
                context.setShowContainer(!showContainer)
              }}
            />
          </Tooltip> */}
        <Divider layout='vertical' />
        {/* <ReactComposite app='ridge-editor-app' path='/user/UserPanel' /> */}
        {/* <Popover trigger='click' position='topRight' showArrow content={<ReactComposite app='ridge-editor-app' path='/AppShare' />}>
            <Button icon={<HumbleiconsShare />}>导出</Button>
          </Popover> */}

        {/* <Tooltip content='预览页面'>
          <Button
            disabled={!currentOpenPageId}
            type='tertiary'
            theme='borderless'
            icon={<i className='bi bi-play-fill' />} onClick={() => { context.toggleMode() }}
          >预览
          </Button>
        </Tooltip> */}
      </Space>
    </div>
  )
}

export default EditorMenuBar
