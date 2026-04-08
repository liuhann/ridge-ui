import React from 'react'
import ReactDOM from 'react-dom/client'
import Editor from './Editor.jsx'

export function init () {
  const root = ReactDOM.createRoot(document.getElementById('root'))
  root.render(
    <React.StrictMode>
      <Editor />
    </React.StrictMode>
  )
}

// 开发环境如果被热加载，也可以自动执行
if (process.env.NODE_ENV === 'development' && module.hot) {
  // init()
}
