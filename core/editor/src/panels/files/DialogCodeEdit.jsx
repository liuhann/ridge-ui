import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react'
import { SideSheet, Spin, Tabs, TabPane, Modal, Toast, Typography, Button } from '@douyinfe/semi-ui'
import editorStore from '../../store/editor.store.js'
// import context from '../../service/RidgeEditorContext.js'
import CodeMirror from '@uiw/react-codemirror'

const { Text } = Typography

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

/**
 * 从剪贴板获取文本
 * @returns {Promise<string>} 剪贴板中的文本内容
 * @throws {Error} 获取失败时抛出错误（如用户拒绝权限、浏览器不支持）
 */
async function getTextFromClipboard () {
  try {
    // 方式1：使用现代剪贴板 API（推荐）
    if (navigator.clipboard && window.isSecureContext) {
      const text = await navigator.clipboard.readText()
      return text
    }
  } catch (err) {
    return false
  }
}

/**
 * 将文本复制到剪贴板
 * @param {string} text 要复制的文本内容
 * @returns {Promise<boolean>} 复制成功返回 true，失败返回 false
 */
async function copyTextToClipboard (text) {
  if (typeof text !== 'string') {
    console.error('复制失败：传入的内容不是字符串')
    return false
  }

  try {
    // 方式1：现代剪贴板 API（推荐）
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
    return true
  } catch (err) {
    console.error(`复制到剪贴板失败：${err.message}`)
    return false
  }
}

/**
 * 下载文本为 .txt 文件
 * @param {string} text 要下载的文本内容
 * @param {string} filename 自定义文件名（默认：download.txt）
 * @param {string} charset 文件编码（默认：utf-8）
 */
function downloadTextAsFile (text, filename = 'download.txt', charset = 'utf-8') {
  try {
    // 创建 Blob 对象（二进制数据）
    const blob = new Blob([text], {
      type: `text/plain; charset=${charset}`
    })

    // 创建下载链接
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    // 处理文件名特殊字符（避免乱码）
    link.download = encodeURIComponent(filename).replace(/%20/g, ' ')

    // 模拟点击下载
    document.body.appendChild(link)
    link.click()

    // 清理资源
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (err) {
    console.error(`文件下载失败：${err.message}`)
  }
}

// 使用示例
// downloadTextAsFile('这是要下载的文本内容', '我的文本文件.txt');

export default forwardRef((props, pref) => {
  const [tabs, setTabs] = useState([])
  const [currentTab, setCurrentTab] = useState('')

  const [currentEditText, setCurrentEditText] = useState('')
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)

  const [contents, setContents] = useState({}) // 保存打开的多个Tabs内编辑的代码文本内容，用于切换时保存、切换回来时恢复
  const [changes, setChanges] = useState({}) // 每个文档改动标记，用于标识当前文档是否有改动

  const saveCode = editorStore(state => state.saveCode)

  const extensionsRef = useRef([])

  // 根据当前打开文件id初始化文件内容
  const loadExtensions = async () => {
    const { tooltips, keymap } = await import(/* webpackChunkName: "codemirror-common" */ '@codemirror/view')
    const { indentWithTab } = await import(/* webpackChunkName: "codemirror-common" */ '@codemirror/commands')

    const extensions = [keymap.of([{
      key: 'Mod-s',
      run: () => handleSave(),
      preventDefault: true
    }, indentWithTab]), tooltips({
      position: 'absolute'
    })]

    const { Linter } = await import(/* webpackChunkName: "codemirror-linter" */ 'eslint-linter-browserify')
    const { javascript, esLint } = await import(/* webpackChunkName: "codemirror-js" */ '@codemirror/lang-javascript')
    const { linter, lintGutter } = await import(/* webpackChunkName: "codemirror-js" */ '@codemirror/lint')
    extensions.push(javascript())
    extensions.push(lintGutter())
    extensions.push(linter(esLint(new Linter(), config)))

    const { json } = await import(/* webpackChunkName: "codemirror-json" */ '@codemirror/lang-json')
    extensions.push(json())
    const { markdown } = await import(/* webpackChunkName: "codemirror-json" */ '@codemirror/lang-markdown')
    extensions.push(markdown())
    extensionsRef.current = extensions
  }

  // 点击保存事件
  const handleSave = async () => {
    await saveCode(currentTab, currentEditText)

    // 保存成功后，清除修改标记
    setChanges(Object.assign({}, changes, {
      [currentTab]: null
    }))
    Toast.success('保存成功')
  }

  // 外部方法：打开文件
  const openFile = async file => {
    setVisible(true)
    const existed = tabs.find(tab => tab.id === file.id)
    if (!existed) {
      setTabs([...tabs, {
        id: file.id,
        name: file.name,
        file
      }])
    }
    setCurrentTab(file.id)
    if (loading) {
      await loadExtensions()
    }
    setLoading(false)
    if (contents[file.id]) {
      setCurrentEditText(contents[file.id])
    } else {
      setContents({
        ...contents,
        [file.id]: file.textContent
      })
      setCurrentEditText(file.textContent)
    }
  }

  // 打开侧边栏时： 动效结束后初始化编辑
  const visibleChange = async () => {
    if (visible) {
      const tab = tabs.find(tab => tab.id === currentTab)
      if (tab) {
        // await initEditor(tab.file)
        setLoading(false)
      }
    }
  }
  useImperativeHandle(pref, () => {
    return {
      openFile
    }
  })

  // 关闭Tab事件
  const doOnTabClose = key => {
    const leftTabs = tabs.filter(tab => tab.id !== key)
    setTabs(leftTabs)
    setContents(Object.assign({ }, contents, { [key]: null }))
    setChanges(Object.assign({ }, changes, { [key]: null }))
    if (key === currentTab) {
      if (leftTabs.length === 0) {
        setCurrentEditText(null)
      } else {
        const current = leftTabs[leftTabs.length - 1]
        setCurrentTab(current.id)
        setCurrentEditText(contents[current.id])
      }
    }
  }
  // 页签关闭
  const onTabClose = key => {
    if (changes[key]) {
      Modal.confirm(
        {
          title: '当前代码有修改，关闭将丢失保存，是否继续？',
          content: '',
          onOk: () => {
            doOnTabClose(key)
          }
        }
      )
    } else {
      doOnTabClose(key)
    }
  }

  const onTabChange = key => {
    setCurrentTab(key)
    setCurrentEditText(contents[key])
  }

  const renderTab = tab => {
    if (changes[tab.id]) {
      return tab.name + '!'
    } else {
      return tab.name
    }
  }

  const hasOpenFile = tabs.length > 0

  const onCodeChange = (val, viewUpdate) => {
    console.log('val:', val)

    setChanges(Object.assign({ ...changes, [currentTab]: true }))
    setContents(Object.assign({}, contents, {
      [currentTab]: val
    }))
  }

  const RenderTitle = () => {
    return (
      <div className='code-edit-title'>
        <Text className='flex-1'>代码编辑</Text>
        <Button
          disabled={!hasOpenFile}
          icon={<i className='bi bi-copy' />} onClick={async () => {
            const result = await copyTextToClipboard(currentEditText)
            if (result) {
              Toast.success('已经将代码复制到剪切板')
            }
          }}
        >复制
        </Button>
        <Button
          disabled={!hasOpenFile}
          type='tertiary' icon={<i className='bi bi-clipboard-check' />} onClick={async () => {
            const text = await getTextFromClipboard()
            if (text) {
              setCurrentEditText(text)
            }
          }}
        >粘贴
        </Button>
        <Button
          disabled={!hasOpenFile} type='tertiary' icon={<i
            class='bi bi-download' onClick={async () => {
              downloadTextAsFile(currentEditText, tabs.find(tab => tab.id === currentTab).name)
            }}
        />}
        />
        <Button
          type='tertiary' icon={<i className='bi bi-x-lg' />} onClick={() => {
            setVisible(false)
          }}
        />
      </div>
    )
  }

  return (
    <SideSheet
      className='code-edit-sheet'
      keepDOM
      width={1200}
      closeOnEsc={false}
      size='large'
      mask={false}
      closable={false}
      maskClosable={false}
      title={<RenderTitle />}
      onClose={() => {
        setVisible(false)
      }}
      visible={visible}
      footer={<div />}
      bodyStyle={{
        zIndex: 1001,
        overflow: 'hidden'
      }}
      // afterVisibleChange={visibleChange}
    >
      <Spin
        tip='正在下载代码编辑模块, 请稍候..' spinning={loading} style={{
          height: '100%',
          width: '100%'
        }}
      >
        <Tabs type='card' collapsible activeKey={currentTab} onTabClose={onTabClose} onChange={onTabChange}>
          {tabs.map(tab => (
            <TabPane closable tab={renderTab(tab)} itemKey={tab.id} key={tab.id} />
          ))}
        </Tabs>
        {!loading && currentEditText != null && <CodeMirror value={currentEditText} basicSetup extensions={extensionsRef.current} onChange={onCodeChange} />}
        <div
          style={{
            visibility: hasOpenFile ? 'hidden' : 'visible'
          }} className='no-open-script-file'
        >暂无打开的脚本文件
        </div>
      </Spin>
    </SideSheet>
  )
})
