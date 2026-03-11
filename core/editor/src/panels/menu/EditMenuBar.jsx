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
  const zoomChange = editorStore(state => state.zoomChange)
  const closePage = editorStore(state => state.closePage)

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
          disabled={!currentOpenPageId} style={{ width: '96px', background: 'transparent' }} value={zoom} suffix='%' onChange={val => {
            zoomChange(val)
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

        <Tooltip content='预览页面'>
          <Button
            disabled={!currentOpenPageId}
            type='tertiary'
            theme='borderless'
            icon={<i className='bi bi-play-fill' />} onClick={() => { context.toggleMode() }}
          >预览
          </Button>
        </Tooltip>
      </Space>
    </div>
  )
}

class MenuBar extends React.Component {
  constructor () {
    super()
    context.services.menuBar = this
    this.state = {
      pageChanged: false,
      theme: context.theme,
      currentPageName: '',
      showContainer: true,
      currentPageId: null,
      openedPageList: [],
      isLight: context.isLight,
      zoom: 100,
      treeLocked: false,
      containerMask: true
    }
  }

  setOpenPage (id, name) {
    this.setState({
      currentPageName: name,
      currentPageId: id
    })

    if (this.state.openedPageList.filter(p => p.value === id).length === 0) {
      this.setState({
        openedPageList: [...this.state.openedPageList, {
          modified: false,
          value: id,
          label: name
        }]
      })
    }
  }

  setPageChanged (changed) {
    const { openedPageList } = this.state
    this.setState({
      openedPageList: openedPageList.map(p => {
        if (p.value === this.state.currentPageId) {
          p.modified = changed
        }
        return p
      })
    })

    // this.setState({
    //   pageChanged: changed
    // })
  }

  setZoom (zoom) {
    this.setState({
      zoom: Math.floor(zoom * 100)
    })
  }

  zoomChange = zoom => {
    context.workspaceControl.setZoom(zoom / 100)
    this.setState({
      zoom
    })
  }

  toggleContainerMask = () => {
    const treeLock = !this.state.treeLocked
    context.workspaceControl.setDragActive(!treeLock)
    this.setState({
      treeLocked: treeLock
    })
  }

  toggoleRunMode = () => {
    context.toggleMode()
  }

  switchToPage = id => {
    if (this.state.currentPageId === id) return

    context.checkModification().then(() => {
      context.closeCurrentPage(true)
      context.loadPageInWorkspace(id)
    })
  }

  savePage = () => {
    context.saveCurrentPage()
  }

  closeCurrentPage = () => {
    context.closeCurrentPage()

    const remains = this.state.openedPageList.filter(p => p.value !== this.state.currentPageId)

    if (remains.length > 0) {
      context.loadPageInWorkspace(remains[remains.length - 1].value)
    } else {
      this.setState({
        currentPageId: null,
        currentPageName: ''
      })
      context.services.outlinePanel.updateOutline(true)
    }

    this.setState({
      openedPageList: remains
    })
  }

  renderPageList = () => {
    const { closeCurrentPage, switchToPage } = this
    const { openedPageList, currentPageName } = this.state
    return (
      <ButtonGroup
        type='tertiary'
        theme='borderless'
      >
        <Dropdown
          render={
            <Dropdown.Menu>{openedPageList.map(page =>
              <Dropdown.Item
                onClick={() => {
                  switchToPage(page.value)
                }} key={page.value}
              >{page.label}
              </Dropdown.Item>)}
            </Dropdown.Menu>
          }
        >
          <Button
            type='tertiary'
            theme='borderless'
          >{currentPageName}
          </Button>
        </Dropdown>
        <Button
          icon={<i className='bi bi-x-lg' />} onClick={() => {
            if (this.state.pageChanged) {
              Modal.confirm({
                zIndex: 10001,
                title: '注意',
                content: '页面未保存，是否继续关闭',
                onOk: async () => {
                  closeCurrentPage()
                }
              })
            } else {
              closeCurrentPage()
            }
          }}
        />
      </ButtonGroup>
    )
  }

  onTabClose = key => {
    const { closeCurrentPage } = this
    const tabFound = this.state.openedPageList.find(p => p.value === key)
    if (tabFound.modified) {
      Modal.confirm({
        zIndex: 10001,
        title: '注意',
        content: '页面未保存，是否继续关闭',
        onOk: async () => {
          closeCurrentPage()
        }
      })
    } else {
      closeCurrentPage()
    }
  }

  render () {
    const { zoomChange, savePage, state, switchToPage, onTabClose } = this
    const { zoom, pageChanged, currentPageName, currentPageId, showContainer, openedPageList } = state
    return null
  }
}

export default EditorMenuBar
