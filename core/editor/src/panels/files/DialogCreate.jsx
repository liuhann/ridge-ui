import React, { useState } from 'react'
import { Modal, Input, Form } from '@douyinfe/semi-ui'
import appStore from '../../store/app.store.js'

import { PAGE_JSON_TEMPLATE, STORE_TEMPLATE } from '../../utils/template.js'

const TITLES = {
  js: '创建程序文件',
  page: '创建页面',
  text: '创建文本文件',
  folder: '创建目录'
}

export default ({
  show,
  type,
  parentPath,
  parentId,
  close
}) => {
  const checkCreateNameValid = appStore(state => state.checkCreateNameValid)
  const createFolder = appStore(state => state.createFolder)
  const createFile = appStore(state => state.createFile)

  const [nameValid, setNameValid] = useState(true)
  const [value, setValue] = useState('')

  const onCreateConfirm = async () => {
    try {
      if (type === 'page') {
        await createFile(parentId, value + suffix(), JSON.stringify(PAGE_JSON_TEMPLATE))
      } else if (type === 'folder') {
        await createFolder(parentId, value)
      } else if (type === 'js') {
        await createFile(parentId, value + suffix(), STORE_TEMPLATE)
      } else if (type === 'text') {
        await createFile(parentId, value, '')
      }
    } catch (e) {

    }
  }

  const suffix = () => {
    if (type === 'js') {
      return '.js'
    } else if (type === 'page') {
      return '.json'
    }
    return ''
  }

  return (
    <Modal
      title={TITLES[type]}
      visible={show}
      onOk={() => {
        onCreateConfirm()
        setValue('')
        close && close()
      }}
      okButtonProps={{
        disabled: !nameValid
      }}
      onCancel={() => {
        setValue('')
        close && close()
      }}
    >
      <Form
        labelPosition='left'
        labelAlign='right'
        labelWidth={80}
      >
        <Form.Input initValue={parentPath} disabled label='所在目录' value={parentPath} />
        <Form.Input
          suffix={suffix()}
          value={value}
          validateStatus={nameValid ? '' : 'error'}
          label='名称' onChange={val => {
            setValue(val)
            setNameValid(checkCreateNameValid(parentId, val))
          }}
        />
      </Form>
    </Modal>
  )
}
