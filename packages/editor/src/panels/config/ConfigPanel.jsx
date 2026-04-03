import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Tabs, TabPane } from '@douyinfe/semi-ui'
import ObjectForm from '../../form/ObjectForm.jsx'
import debug from 'debug'

import editorStore from '../../store/editor.store.js'
import componentRegistry from '../../service/ComponentRegistry.js'
import { getCompositePropertiesDef, getCompositeEventsDef } from '../../workspace/editorUtils.js'
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

  const [loadingDefinitions, setLoadingDefinitions] = useState(false) // 新增：加载状态

  const [pagePropsFields, setPagePropFields] = useState([]) // 页面属性
  const [pageEventFields, setPageEventFields] = useState([]) // 页面事件
  const [nodePropFields, setNodePropFields] = useState([]) // 当前节点属性
  const [nodeEventFields, setNodeEventFields] = useState([]) // 当前节点事件

  const editorComposite = editorStore(state => state.editorComposite)
  const currentEditNodeId = editorStore(state => state.currentEditNodeId)
  const updateElementConfig = editorStore(state => state.updateElementConfig)
  const updatePageConfig = editorStore(state => state.updatePageConfig)
  const currentEditNodeRect = editorStore(state => state.currentEditNodeRect)

  const updateElementFields = useCallback(async (nodeId) => {
    if (!nodeId || !editorComposite) return

    const element = editorComposite.getNode(nodeId)
    if (!element) return

    setLoadingDefinitions(true)

    try {
      const nodePropFields = []
      const nodeEventFields = []

      nodePropFields.push(...COMPONENT_BASIC_FIELDS)

      // 修改：只从element.config?.path加载，不考虑element.componentDefinition缓存
      let componentMeta = element.getComponentMeta()
      if (element.config?.path) {
        try {
          componentMeta = await componentRegistry.getLibComponent(`${element.config.path}`)
          if (componentMeta) {
            element.setComponentMeta(componentMeta)
          }
        } catch (error) {
          console.warn(`加载组件定义失败: ${element.config.path}`, error)
        }
      }

      const parent = element.getParent()
      if (parent && parent !== editorComposite) {
      // 修改：只从parent.config?.path加载父组件定义
        let parentComponentMeta = parent.getComponentMeta()
        if (parent.config?.path) {
          try {
            parentComponentMeta = await componentRegistry.getLibComponent(`${parent.config.path}`)
            parent.setComponentMeta(parentComponentMeta)
          // 注意：不保存到parent.componentDefinition
          } catch (error) {
            console.warn(`加载父组件定义失败: ${parent.config.path}`, error)
          }
        }

        if (parentComponentMeta) {
          nodePropFields.push({
            type: 'divider',
            label: '来自父-' + parentComponentMeta.title
          })
          if (parentComponentMeta.childStyles) {
            nodePropFields.push(...(parentComponentMeta.childStyles.map(childStyle => {
              return { ...childStyle, field: 'style.' + childStyle.name, fieldEx: 'styleEx.' + childStyle.name }
            })))
          }
          nodePropFields.push({
            type: 'divider'
          })
        }
      } else {
        nodePropFields.push(...COMPONENT_ROOT_FIELDS)
        if (componentMeta) {
          if (componentMeta.visualConfig?.hideable !== false) {
            nodePropFields.push(FIELD_VISIBLE)
          }
          if (componentMeta.visualConfig?.fullScreenable === true && parent === editorComposite) {
            nodePropFields.push(FIELD_FULL_SCREEN)
          }
        }
      }

      // 修改：使用加载到的组件定义
      if (componentMeta) {
        for (const prop of componentMeta.properties ?? []) {
          if (!prop.name) continue
          const field = {}
          Object.assign(field, prop, {
            field: 'props.' + prop.name,
            fieldEx: 'propEx.' + prop.name
          })

          nodePropFields.push(field)
        }

        for (const event of componentMeta.events ?? []) {
          const control = {
            label: event.label,
            type: 'function',
            control: 'event',
            field: 'events.' + event.name
          }
          nodeEventFields.push(control)
        }

        if (componentMeta.componentPath === 'ridge-container/composite' && element.el.composite && element.el.composite.config) {
          nodePropFields.push(...getCompositePropertiesDef(element.el.composite).map(p => {
            const [, name] = p.field.split('.')
            p.fieldEx = 'propEx.' + name
            p.field = 'props.' + name
            return p
          }))
          nodeEventFields.push(...getCompositeEventsDef(element.el.composite))
        }
      }

      componentPropFormApi.current?.reset()
      setNodePropFields(nodePropFields)
      setNodeEventFields(nodeEventFields)

      for (const key of ['title', 'props', 'propEx', 'style', 'styleEx', 'id', 'visible', 'full']) {
        componentPropFormApi.current?.setValue(key, element.config[key], {
          notNotify: true
        })
      }
      componentEventFormApi.current?.setValue('events', element.config.events, {
        notNotify: true
      })
    } finally {
      setLoadingDefinitions(false)
    }
  }, [editorComposite])
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
    console.log('currentEditNodeId', currentEditNodeId, values, field)
    if (currentEditNodeId === values.id) {
      updateElementConfig(values, field)
    }
    // if (values.id === this.componentView.config.id) {
    //   updateElementConfig(values)
    // }
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
