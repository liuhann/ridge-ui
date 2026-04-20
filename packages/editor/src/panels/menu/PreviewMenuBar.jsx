import React from 'react'
import { Button, Divider, Space } from '@douyinfe/semi-ui'
import './style.less'

const PreviewMenuBar = () => {
  return (
    <div
      className='menu-bar'
    >
      <Space className='bar-content'>
        <Button
          type='tertiary' icon={<i className='bi bi-floppy' />} theme='borderless'
        />
        <Divider layout='vertical' />
      </Space>
    </div>
  )
}

export default PreviewMenuBar
