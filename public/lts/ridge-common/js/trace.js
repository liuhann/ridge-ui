const style = `
  /* 消息容器样式 */
        #trace-messages-container {
            position: fixed;
            top: 10px;
            left: 10px;
            max-height: calc(100vh * 2 / 3);
            overflow-y: auto;
            z-index: 9999;
        }
        
        /* 消息项样式 */
        .trace-message {
            padding: 2px;
            border-bottom: 1px solid #eee;
            animation: fadeIn 0.3s ease forwards;
            opacity: 0;
            transform: translateY(-10px);
            background: #00000045;
        }
        
        .trace-message:last-child { border-bottom: none; }
        
        /* 消息类型颜色 */
        .trace-message.info { color: #0066cc; }
        .trace-message.success { color: #008000; }
        .trace-message.warning { color: #ff9900; }
        .trace-message.error { color: #cc0000; }
        
        /* 消息标题样式 */
        .trace-message .title {
            font-weight: bold;
            margin-bottom: 5px;
            display: flex;
            align-items: center;
        }
        
        /* 消息图标 */
        .trace-message .title::before {
            content: '';
            display: inline-block;
            width: 16px;
            height: 16px;
            margin-right: 8px;
            background-size: 16px;
        }
        
`
const styleTag = document.createElement('style'); styleTag.textContent = style; document.head.appendChild(styleTag)
// 实现traceAppend函数
const traceAppend = (() => {
  // 创建消息容器
  let container = document.getElementById('trace-messages-container')
  if (!container) {
    container = document.createElement('div')
    container.id = 'trace-messages-container'
    document.body.appendChild(container)

    // 添加容器点击事件 - 点击关闭所有消息
    container.addEventListener('click', () => {
      clearAllMessages()
    })
  }

  // 消息计数器
  let messageCount = 0

  // 清空所有消息
  function clearAllMessages () {
    while (container.firstChild) {
      container.removeChild(container.firstChild)
    }
  }

  return (msg, type = 'info') => {
    messageCount++

    // 创建消息元素
    const messageElement = document.createElement('div')
    messageElement.className = `trace-message ${type}`
    messageElement.style.position = 'relative'

    // 设置消息内容
    messageElement.innerHTML = `
                    <div class="content">${msg}</div>
                `
    // 添加消息到容器
    container.appendChild(messageElement)

    // 触发动画
    setTimeout(() => {
      messageElement.style.opacity = '1'
      messageElement.style.transform = 'translateY(0)'
    }, 10)

    // 滚动到底部
    container.scrollTop = container.scrollHeight

    return messageCount
  }
})()

export {
  traceAppend
}
