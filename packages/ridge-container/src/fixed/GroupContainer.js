import React from 'react'

import { createPortal } from 'react-dom'
export default ({
  left,
  right,
  top,
  bottom,
  align,
  width,
  height,
  visible,
  content,
  __isEdit
}) => {
  const style = {
    position: 'fixed',
    zIndex: 99999
  }

  if (align.indexOf('left') > -1) {
    style.left = left + 'px'
  }
  if (align.indexOf('right') > -1) {
    style.right = right + 'px'
  }
  if (align.indexOf('top') > -1) {
    style.top = top + 'px'
  }
  if (align.indexOf('bottom') > -1) {
    style.bottom = bottom + 'px'
  }

  if (align.indexOf('left') === -1 || align.indexOf('right') === -1) {
    style.width = width + 'px'
  }

  if (align.indexOf('bottom') === -1 || align.indexOf('top') === -1) {
    style.height = height + 'px'
  }

  if (!visible) {
    style.display = 'none'
  }

  return (
    <>
      {__isEdit
        ? (<div style={{ width: '100%', height: '100%' }}>
          {content && content()}
           </div>)
        : createPortal(
          <div style={style}>{content && content()}</div>,
          document.body
        )}
    </>

  )
}
