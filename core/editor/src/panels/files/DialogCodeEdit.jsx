import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react'
import { SideSheet, Spin, Tabs, TabPane, Modal, Toast } from '@douyinfe/semi-ui'
import editorStore from '../../store/editor.store.js'
// import context from '../../service/RidgeEditorContext.js'

const config = {
  // eslint configuration
  languageOptions: {
    globals: {
    },
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'module'
    }
  },
  rules: {
    semi: ['error', 'never']
  }
}
//
export default forwardRef((props, pref) => {
  const ref = useRef(null)
  const [tabs, setTabs] = useState([])
  const [currentTab, setCurrentTab] = useState('')
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)

  const [contents, setContents] = useState({}) // 保存打开的多个Tabs内编辑的代码文本内容，用于切换时保存、切换回来时恢复
  const [changes, setChanges] = useState({}) // 每个文档改动标记，用于标识当前文档是否有改动

  // 根据当前打开文件id初始化文件内容
  const initEditor = async (file) => {
    const div = ref.current
    if (!div) return

    if (div.editorComposite) {
      div.editorComposite.destroy()
    }

    const type = file.mimeType
    const text = contents[file.id] || file.textContent

    const { EditorView, basicSetup } = await import(/* webpackChunkName: "codemirror-common" */ 'codemirror')
    const { tooltips, keymap } = await import(/* webpackChunkName: "codemirror-common" */ '@codemirror/view')
    const { indentWithTab } = await import(/* webpackChunkName: "codemirror-common" */ '@codemirror/commands')

    const extensions = [basicSetup, keymap.of([{
      key: 'Mod-s',
      run: () => handleSave(file),
      preventDefault: true
    }, indentWithTab]), tooltips({
      position: 'absolute'
    })]

    if (type === 'css') {
      const { css } = await import(/* webpackChunkName: "codemirror-css" */ '@codemirror/lang-css')
      extensions.push(css())
    }
    if (type === 'text/javascript') {
      const { Linter } = await import(/* webpackChunkName: "codemirror-linter" */ 'eslint-linter-browserify')
      const { javascript, esLint } = await import(/* webpackChunkName: "codemirror-js" */ '@codemirror/lang-javascript')
      const { linter, lintGutter } = await import(/* webpackChunkName: "codemirror-js" */ '@codemirror/lint')
      extensions.push(javascript())
      extensions.push(lintGutter())
      extensions.push(linter(esLint(new Linter(), config)))
    }
    if (type === 'text/json') {
      const { json } = await import(/* webpackChunkName: "codemirror-json" */ '@codemirror/lang-json')
      extensions.push(json())
    }
    if (type === 'text/markdown') {
      const { markdown } = await import(/* webpackChunkName: "codemirror-json" */ '@codemirror/lang-markdown')
      extensions.push(markdown())
    }

    extensions.push(EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        setChanges(Object.assign({}, changes, {
          [file.id]: true
        }))
      }
    }))

    div.editorComposite = new EditorView({
      doc: text,
      extensions,
      parent: div
    })

    div.fileid = file.id
  }

  // 点击保存事件
  const handleSave = async (file) => {
    const id = file.id
    const code = ref.current.editorComposite.state.doc.toString()
    const result = await context.onCodeEditComplete(id, code)

    if (result) {
      // 保存成功后，清除修改标记
      setContents(Object.assign({}, contents, {
        [id]: null
      }))
      // 保存成功后，清除修改标记
      setChanges(Object.assign({}, changes, {
        [id]: null
      }))
      Toast.success('保存成功')
    } else {
      Toast.error('保存失败，请检查保存内容格式是否正确、文件是否已经被删除')
    }
  }

  // 外部方法：打开文件
  const openFile = async file => {
    const existed = tabs.find(tab => tab.id === file.id)
    if (!existed) {
      setTabs([...tabs, {
        id: file.id,
        name: file.name,
        file
      }])
    }
    // 保存当前编辑内容（如果有）
    cacheEditedContent()
    if (visible) {
      await initEditor(file)
      setLoading(false)
    } else {
      setVisible(true)
    }
    setCurrentTab(file.id)
  }

  // 缓存当前编辑内容
  const cacheEditedContent = () => {
    if (currentTab && ref.current && ref.current.editorComposite) {
      const editContent = ref.current.editorComposite.state.doc.toString()
      if (editContent) {
        setContents(Object.assign({}, contents, {
          [currentTab]: editContent
        }))
      }
    }
  }

  // 打开侧边栏时： 动效结束后初始化编辑
  const visibleChange = async () => {
    if (visible) {
      const tab = tabs.find(tab => tab.id === currentTab)
      if (tab) {
        await initEditor(tab.file)
        setLoading(false)
      }
    }
  }
  useImperativeHandle(pref, () => {
    return {
      openFile
    }
  })

  const onClose = () => {
    setVisible(false)
  }

  // 关闭Tab事件
  const doOnTabClose = key => {
    const leftTabs = tabs.filter(tab => tab.id !== key)
    setTabs(leftTabs)
    setContents(Object.assign({ }, contents, { [key]: null }))
    setChanges(Object.assign({ }, changes, { [key]: null }))
    if (key === currentTab) {
      if (leftTabs.length === 0) {
        ref.current.editorComposite.destroy()
        // setVisible(false)
      } else {
        const current = leftTabs[leftTabs.length - 1]
        setCurrentTab(current.id)
        initEditor(current.file)
      }
    }
  }
  // 页签关闭
  const onTabClose = key => {
    if (changes[key]) {
      Modal.confirm(
        {
          title: 'Are you sure ?',
          content: 'bla bla bla...',
          onOk: () => {
            doOnTabClose(key)
          }
        }
      )
    } else {
      doOnTabClose(key)
    }
  }

  // Tab页签切换
  const onChange = key => {
    cacheEditedContent()
    setCurrentTab(key)

    initEditor(tabs.find(tab => tab.id === key).file)
  }

  const renderTab = tab => {
    if (changes[tab.id]) {
      return tab.name + '!'
    } else {
      return tab.name
    }
  }

  const hasOpenFile = tabs.length > 0

  return (
    <SideSheet
      className='code-edit-sheet'
      keepDOM
      width={1200}
      closeOnEsc={false}
      size='large'
      mask={false}
      maskClosable={false}
      title='页面脚本编辑器'
      visible={visible}
      footer={<div />}
      bodyStyle={{
        zIndex: 1001,
        overflow: 'hidden'
      }}
      afterVisibleChange={visibleChange}
      onOk={() => {
        const result = ref.current.editorComposite.state.doc.toString()
        onChange(result)
      }}
      onCancel={onClose}
    >
      {hasOpenFile &&
        <Spin
          tip='正在下载代码编辑模块, 请稍候..' spinning={loading} style={{
            height: '100%',
            width: '100%'
          }}
        >
          <Tabs type='card' collapsible activeKey={currentTab} onTabClose={onTabClose} onChange={onChange}>
            {tabs.map(tab => (
              <TabPane closable tab={renderTab(tab)} itemKey={tab.id} key={tab.id} />
            ))}
          </Tabs>
          <div
            className='code-editor-container' ref={ref}
          />
        </Spin>}
      {!hasOpenFile && <div className='no-open-script-file'>暂无打开的脚本文件</div>}
    </SideSheet>
  )
})
