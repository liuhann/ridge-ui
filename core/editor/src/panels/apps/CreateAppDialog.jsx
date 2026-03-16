import React, { useState } from 'react'
import { Button, Modal, Input } from '@douyinfe/semi-ui'
import CardList from '../../components/CardList/CardList.jsx'

const CreateAppDialog = ({
  visible,
  onCancel,
  onConfirm
}) => {
  const handleCancel = () => {
    onCancel()
  }
  return (
    <Modal footer={false} className='new-app-dialog' title='新增应用' visible={visible} width={860} height='80%' onCancel={handleCancel}>
      <div className='section'>
        <CardList
          onItemClick={key => {
            onConfirm && onConfirm(key)
          }}
          list={[{
            cover: <i className='bi bi-plus-lg' />,
            key: 'empty',
            label: '空白应用'
          }, {
            cover: <i class='bi bi-box-arrow-in-up' />,
            key: 'import',
            label: '导入应用文件'
          }]}
        />
      </div>

      <div className='section'>
        <div>从模板新增</div>
      </div>
    </Modal>
  )
}

export default CreateAppDialog
