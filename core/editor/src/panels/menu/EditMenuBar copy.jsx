import React from 'react'
import { Button, Divider, Badge, Space, ButtonGroup, Modal, Dropdown, InputNumber, Tooltip, Tabs, TabPane, Popover } from '@douyinfe/semi-ui'
import context from '../../service/RidgeEditorContext.js'
import './style.less'

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
    return (
      <div
        className='menu-bar'
      >
        <Tabs
          className='page-tabs' type='card' activeKey={currentPageId} onTabClose={onTabClose} onTabClick={switchToPage}
        >
          {openedPageList.map(t => (
            <TabPane icon={t.modified ? <i class='bi bi-circle-fill' /> : null} closable tab={t.label} itemKey={t.value} key={t.value} />
          ))}
        </Tabs>
        <Space className='bar-content'>
          <Badge dot={pageChanged} type='danger'>
            <Button
              disabled={!currentPageName}
              type='tertiary' icon={<i className='bi bi-floppy' />} theme='borderless' onClick={savePage}
            />
          </Badge>
          <InputNumber
            disabled={!currentPageName} style={{ width: '96px', background: 'transparent' }} value={zoom} suffix='%' onChange={val => {
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
              disabled={!currentPageName}
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
}

export default MenuBar
