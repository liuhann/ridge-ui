import React from 'react'
import { Button, Modal } from '@douyinfe/semi-ui'
import CardList from '../../components/CardList/CardList.jsx'
import EmptyFile from '../../icons/EmptyFile.svg?'

const CreateAppDialog = ({
  visible,
  onConfirm,
  onCancel
}) => {
  const handleOk = () => {

  }

  const handleCancel = () => {
    onCancel()
  }
  return (
    <Modal footer={false} className='new-app-dialog' title='新增应用' visible={visible} width={860} height='80%' onOk={handleOk} onCancel={handleCancel}>
      <div>
        <CardList
          list={[{
            cover: <i className='bi bi-plus-lg' />,
            key: 'empty',
            label: '空白应用'
          }, {
            cover: <i class='bi bi-upload' />,
            key: 'import',
            label: '导入应用文件'
          }]}
        />
      </div>
    </Modal>
  )
}

export default CreateAppDialog
