import React, { useEffect, useRef, useState } from 'react'
import { Tabs, TabPane } from '@douyinfe/semi-ui'
import ObjectForm from '../../form/ObjectForm.jsx'
import debug from 'debug'

import editorStore from '../../store/editor.store.js'
import { getCompositePropertiesDef, getCompositeEventsDef } from '../../workspace/editorUtils.js'
import { localRepoService } from '../../store/app.store.js'
const trace = debug('editor:config-panel')

const COMPONENT_BASIC_FIELDS = [{
  label: '名称',
  control: 'string',
  field: 'title'
}]

const COMPONENT_ROOT_FIELDS = [
  {
    label: '距左',
    control: 'number',
    width: '50%',
    readonly: (config) => {
      return config && (config.full || config.locked)
    },
    field: 'style.x',
    fieldEx: 'styleEx.x'
  }, {
    label: '距上',
    width: '50%',
    control: 'number',
    readonly: (config) => {
      return config && (config.full || config.locked)
    },
    field: 'style.y',
    fieldEx: 'styleEx.Y'
  },
  {
    label: '宽度',
    width: '50%',
    control: 'number',
    readonly: (config) => {
      return config && (config.full || config.locked)
    },
    field: 'style.width',
    fieldEx: 'styleEx.width'
  }, {
    label: '高度',
    width: '50%',
    control: 'number',
    field: 'style.height',
    readonly: (config) => {
      return config && (config.full || config.locked)
    },
    fieldEx: 'styleEx.height'
  }
]

const FIELD_VISIBLE = {
  label: '显示',
  type: 'boolean',
  control: 'checkbox',
  width: '50%',
  field: 'style.visible',
  fieldEx: 'styleEx.visible',
  connect: true
}

const FIELD_FULL_SCREEN = {
  label: '填满',
  width: '50%',
  type: 'boolean',
  field: 'full'
}

const PAGE_FIELDS = [
  {
    label: '页面名称',
    control: 'string',
    readonly: true,
    field: 'name'
  },
  {
    label: '宽度',
    control: 'number',
    width: '128px',
    field: 'style.width'
  }, {
    width: '24px',
    type: 'boolean',
    control: 'boolean',
    prompt: '固定宽度',
    icon: 'bi bi-bounding-box',
    field: 'style.widthFix'
  }, {
    label: '高度',
    width: '128px',
    control: 'number',
    field: 'style.height'
  }, {
    width: '24px',
    type: 'boolean',
    control: 'boolean',
    prompt: '固定高度',
    icon: 'bi bi-bounding-box',
    field: 'style.heightFix'
  }, {
    field: 'jsFiles',
    label: '脚本库',
    type: 'file',
    multiple: true,
    fileType: 'javascript',
    connect: false
  }, {
    label: '字体库',
    field: 'fontFiles',
    type: 'strings',
    connect: false
  }, {
    field: 'classList',
    label: '样式',
    type: 'style',
    connect: true,
    value: []
  }
]

const PAGE_EVNETS = [{
  label: '页面单击',
  control: 'event',
  field: 'events.onClick'
},
{
  label: '鼠标按下',
  control: 'event',
  field: 'events.onMouseDown'
},
{
  label: '鼠标移动',
  control: 'event',
  field: 'events.onMouseMove'
}
]

const ConfigPanel = () => {
  const componentPropFormApi = useRef(null)
  const componentEventFormApi = useRef(null)
  const pagePropFormApi = useRef(null)
  const pageEventFormApi = useRef(null)

  const [pagePropsFields, setPagePropFields] = useState([]) // 页面属性
  const [pageEventFields, setPageEventFields] = useState([]) // 页面事件
  const [nodePropFields, setNodePropFields] = useState([]) // 当前节点属性
  const [nodeEventFields, setNodeEventFields] = useState([]) // 当前节点事件

  const editorComposite = editorStore(state => state.editorComposite)
  const currentEditNodeId = editorStore(state => state.currentEditNodeId)
  const updateElementConfig = editorStore(state => state.updateElementConfig)
  const updatePageConfig = editorStore(state => state.updatePageConfig)
  const currentEditNodeRect = editorStore(state => state.currentEditNodeRect)

  const updateElementFields = currentEditNodeId => {
    // 节点基本样式 （title/visible)
    const nodePropFields = []
    const nodeEventFields = []

    nodePropFields.push(...COMPONENT_BASIC_FIELDS)

    const element = editorComposite.getNode(currentEditNodeId)

    if (element) {
      if (element.getParent() && element.getParent() !== editorComposite && element.getParent().componentDefinition) {
        nodePropFields.push({
          type: 'divider',
          label: '来自父-' + element.getParent().componentDefinition.title
        })
        nodePropFields.push(...(element.getParent().componentDefinition?.childProps || []))
        nodePropFields.push({
          type: 'divider'
        })
      } else {
        nodePropFields.push(...COMPONENT_ROOT_FIELDS)
        if (element.componentDefinition) {
          if (element.componentDefinition.hideable !== false) { // 定义 hideable = false时，不显示隐藏选项
            nodePropFields.push(FIELD_VISIBLE)
          }
          if (element.componentDefinition.fullScreenable === true && element.getParent() === element.editorComposite) { // 定义 fullScreenable = true 时，组件可以全屏， 用于一些容器
            nodePropFields.push(FIELD_FULL_SCREEN)
          }
        }
      }

      // 能加载到节点定义
      if (element.componentDefinition) {
        for (const prop of element.componentDefinition.props ?? []) {
          if (!prop.name) continue
          const field = {
            componentName: element.componentDefinition.name,
            packageName: element.componentDefinition.packageName
          }
          if (prop.connect) {
            Object.assign(field, prop, {
              field: 'props.' + prop.name,
              fieldEx: 'propEx.' + prop.name
            })
          } else {
            Object.assign(field, prop, {
              field: 'props.' + prop.name
            })
          }
          nodePropFields.push(field)
        }

        for (const event of element.componentDefinition.events ?? []) {
          const control = {
            label: event.label,
            type: 'function',
            control: 'event',
            field: 'events.' + event.name
          }
          nodeEventFields.push(control)
        }

        if (element.componentDefinition.componentPath === 'ridge-container/composite' && element.el.composite && element.el.composite.config) {
          // 获取Compsite定义属性，同时如果原为connect，这里也增加connect
          nodePropFields.push(...getCompositePropertiesDef(element.el.composite).map(p => {
            const [, name] = p.field.split('.')
            // if (p.connect) {
            // }
            p.fieldEx = 'propEx.' + name
            p.field = 'props.' + name
            return p
          }))
          nodeEventFields.push(...getCompositeEventsDef(element.el.composite))
        }
      }
      componentPropFormApi.current.reset()
      setNodePropFields(nodePropFields)
      setNodeEventFields(nodePropFields)

      for (const key of ['title', 'props', 'propEx', 'style', 'styleEx', 'id', 'visible', 'full']) {
        componentPropFormApi.current.setValue(key, element.config[key], {
          notNotify: true
        })
      }
      componentEventFormApi.current.setValue('events', element.config.events, {
        notNotify: true
      })
    }
  }

  const updatePageFields = () => {
    setPagePropFields([...PAGE_FIELDS, ...getCompositePropertiesDef(editorComposite)])
    setPageEventFields([...PAGE_EVNETS, ...getCompositeEventsDef(editorComposite)])

    for (const key of ['classList', 'style', 'properties', 'fontFiles', 'jsFiles', 'name', 'events']) {
      pagePropFormApi.current.setValue(key, editorComposite.config[key], {
        notNotify: true
      })
    }
    pageEventFormApi.current.setValue('events', editorComposite.config.events, {
      notNotify: true
    })
  }

  useEffect(() => {
    if (!editorComposite) return
    if (currentEditNodeId) { // 选中节点
      updateElementFields(currentEditNodeId)
    } else {
      updatePageFields()
    }
  }, [currentEditNodeId, editorComposite])

  useEffect(() => {
    if (currentEditNodeId) {
      console.log('update Rect', currentEditNodeRect)
      componentPropFormApi.current.setValue('style', currentEditNodeRect, {
        notNotify: true
      })
    }
  }, [currentEditNodeRect])

  const basicPropsAPI = (formApi) => {
    componentPropFormApi.current = formApi
  }

  const eventPropsAPI = (formApi) => {
    componentEventFormApi.current = formApi
  }
  // 回写styleApi句柄以便直接操作基础form
  const cbPagePropFormApi = (formApi) => {
    pagePropFormApi.current = formApi
  }

  const pageEventPropsAPI = formApi => {
    pageEventFormApi.current = formApi
  }

  // 组件属性表单项修改  组件样式和属性变动
  const componentPropValueChange = (values, field) => {
    if (values.id === this.componentView.config.id) {
      updateElementConfig(values)
    }
  }

  const componentEventValueChange = (values, field) => {
    updateElementConfig(values)
  }
  const pageEventValueChange = (values, field) => {
    updatePageConfig(values)
  }

  const pagePropValueChange = (values, field) => {
    updatePageConfig(values)
  }

  return (
    <div className='config-panel'>
      <Tabs
        className='on-title'
        type='card'
        style={{
          display: currentEditNodeId ? 'block' : 'none'
        }}
      >
        {/* 组件属性配置 */}
        <TabPane tab='属性' itemKey='props'>
          <ObjectForm
            fields={nodePropFields}
            getFormApi={basicPropsAPI} onValueChange={componentPropValueChange}
          />
        </TabPane>
        <TabPane tab='交互' itemKey='interact'>
          <ObjectForm
            fields={nodeEventFields}
            getFormApi={eventPropsAPI} onValueChange={componentEventValueChange}
          />
        </TabPane>
      </Tabs>

      <Tabs
        type='card'
        className='on-title'
        style={{
          display: currentEditNodeId ? 'none' : 'block'
        }}
      >
        {/* 页面属性配置 */}
        <TabPane tab='基础' itemKey='style'>
          <ObjectForm
            fields={pagePropsFields}
            getFormApi={cbPagePropFormApi} onValueChange={pagePropValueChange}
          />
        </TabPane>
        <TabPane tab='交互' itemKey='interact'>
          <ObjectForm
            fields={pageEventFields}
            getFormApi={pageEventPropsAPI} onValueChange={pageEventValueChange}
          />
        </TabPane>
      </Tabs>
    </div>
  )
}

export default ConfigPanel
