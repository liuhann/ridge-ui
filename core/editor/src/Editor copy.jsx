import React from 'react'

import { Dropdown, ImagePreview, Modal, Toast, Tabs, TabPane, Icon, Button, Tooltip, Space } from '@douyinfe/semi-ui'

import ConfigPanel from './panels/config/ConfigPanel.jsx'
import DialogCodeEdit from './panels/files/DialogCodeEdit.jsx'
import EditMenuBar from './panels/menu/EditMenuBar.jsx'
import context from './service/RidgeEditorContext.js'

import editorStore from './store/editor.store.js'

import { ReactComposite } from 'ridgejs'

import './editor.less'
import PreviewMenuBar from './panels/menu/PreviewMenuBar.jsx'
import AppFileList from './panels/files/AppFileList.jsx'

// 公用错误提示方法
globalThis.msgerror = msg => {
  Toast.error(msg)
}
globalThis.success = Toast.success
class Editor extends React.Component {
  constructor (props) {
    super(props)

    this.workspaceRef = React.createRef()
    this.viewPortContainerRef = React.createRef()
    this.codeEditorRef = React.createRef()

    this.state = {
      isLight: window.localStorage.getItem('ridge-is-light') !== 'false',
      pageOpened: false,
      collapseLeft: false,
      leftResizing: false,
      isPreview: false,
      editPreview: false,
      leftReisizeWidth: 340,

      imagePreviewSrc: null,
      imagePreviewVisible: false,

      // code preview/edit
      codeEditTitle: '',
      codeEditText: '',
      codeEditVisible: false,
      codeEditType: ''
    }
    context.setLight(this.state.isLight)
  }

  componentDidMount () {
    context.editorDidMount(this, this.workspaceRef.current, this.viewPortContainerRef.current)
  }

  handleLeftResize () {
    document.addEventListener('mousemove', ev => {
      if (this.state.leftResizing) {
        if (ev.clientX > 250) {
          this.setState({
            leftReisizeWidth: ev.clientX
          })
        }
      }
    })
    document.addEventListener('mouseup', ev => {
      this.setState({
        leftResizing: false
      })
    })
  }

  setPageOpened (opened) {
    this.setState({
      pageOpened: opened
    })
  }

  toggleLeftCollapse () {
    this.setState({
      collapseLeft: !this.state.collapseLeft
    })
  }

  setPreview (preview) {
    this.setState({
      isPreview: preview
    })
  }

  async confirm (mssage) {
    return new Promise((resolve, reject) => {
      Modal.confirm({
        zIndex: 10001,
        title: '确认',
        content: mssage,
        onOk: async () => {
          resolve()
        },
        onCancel: () => {
          reject(new Error())
        }
      })
    })
  }

  async message (msg) {
    Modal.message(msg)
  }

  setEditorLoaded () {
    this.setState({
      editorLoading: false
    }, () => {
      this.handleLeftResize()
    })
  }

  openInCodeEditor (file) {
    this.currentEditFile = file

    this.codeEditorRef.current?.openFile(file)
    // this.setState({
    //   codeEditTitle: file.name,
    //   codeEditText: file.textContent,
    //   codeEditVisible: true,
    //   codeEditType: file.mimeType
    // })
  }

  completeCodeEdit (code) {
    context.onCodeEditComplete(this.currentEditFile.id, code)
  }

  openImage (url) {
    this.setState({
      imagePreviewSrc: url,
      imagePreviewVisible: true
    })
  }

  setIsLight (isLight) {
    this.setState({
      isLight
    })
    context.setLight(isLight)
  }

  render () {
    const {
      state,
      workspaceRef,
      codeEditorRef,
      viewPortContainerRef
    } = this

    const {
      isPreview,
      collapseLeft,
      pageOpened,
      imagePreviewVisible,
      imagePreviewSrc,
      leftReisizeWidth,
      codeEditTitle
    } = state
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
          {!collapseLeft &&
            <div
              className='left-resizer' onMouseDown={e => {
                e.preventDefault()
                this.setState({
                  leftResizing: true
                })
              }}
            />}
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
            this.setState({
              imagePreviewVisible: false
            })
          }}
        />
        <DialogCodeEdit
          ref={codeEditorRef}
          title={codeEditTitle}
          onClose={() => {
            this.setState({
              codeEditVisible: false
            })
          }}
        />
      </>
    )
  }
}

export default Editor
