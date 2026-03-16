import React from 'react'
import { Tabs, TabPane } from '@douyinfe/semi-ui'
import ObjectForm from '../../form/ObjectForm.jsx'
import { ThemeContext } from '../movable/MoveablePanel.jsx'
import debug from 'debug'

import context from '../../service/RidgeEditorContext.js'
import { getCompositePropertiesDef, getCompositeEventsDef } from '../../workspace/editorUtils.js'
const trace = debug('editor:config-panel')

const COMPONENT_BASIC_FIELDS = [{
  label: '名称',
  control: 'string',
  field: 'title'
}
]

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
export default class ComponentPanel extends React.Component {
  constructor (props) {
    super(props)
    this.ref = React.createRef()
    this.componentPropFormApi = null
    this.componentEventFormApi = null
    this.pagePropFormApi = null

    context.services.configPanel = this

    this.state = {
      configPage: true,
      pagePropsFields: [], // 页面属性
      pageEventFields: [], // 页面事件
      nodePropFields: [], // 当前节点属性
      nodeEventFields: [] // 当前节点事件
    }
  }

  static contextType = ThemeContext

  componentDidMount () {
    // this.initEvents()
  }

  /**
   * 组件选择后、更新为组件配置面板
   **/
  componentSelected (componentView) {
    let view = componentView
    if (componentView instanceof Node) {
      view = componentView.view
    }
    this.componentView = view
    trace('updatePanelConfig', view)

    // 节点基本样式 （title/visible)
    const nodePropFields = []

    nodePropFields.push(...COMPONENT_BASIC_FIELDS)

    if (view.getParent() !== context.editorComposite && view.getParent().componentDefinition) {
      // 放置到容器中，有容器赋予的样式配置的
      if (view.getParent()) {
        nodePropFields.push({
          type: 'divider',
          label: '来自父-' + view.getParent().componentDefinition.title
        })
        nodePropFields.push(...(view.getParent().componentDefinition?.childProps || []))
        nodePropFields.push({
          type: 'divider'
        })
      }
    } else {
      nodePropFields.push(...COMPONENT_ROOT_FIELDS)

      if (view.componentDefinition) {
        if (view.componentDefinition.hideable !== false) { // 定义 hideable = false时，不显示隐藏选项
          nodePropFields.push(FIELD_VISIBLE)
        }
        if (view.componentDefinition.fullScreenable === true && view.getParent() === context.editorComposite) { // 定义 fullScreenable = true 时，组件可以全屏， 用于一些容器
          nodePropFields.push(FIELD_FULL_SCREEN)
        }
      }
    }

    const nodeEventFields = []
    // 能加载到节点定义
    if (view.componentDefinition) {
      for (const prop of view.componentDefinition.props ?? []) {
        if (!prop.name) continue
        const field = {
          componentName: view.componentDefinition.name,
          packageName: view.componentDefinition.packageName
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

      for (const event of view.componentDefinition.events ?? []) {
        const control = {
          label: event.label,
          type: 'function',
          control: 'event',
          field: 'events.' + event.name
        }
        nodeEventFields.push(control)
      }

      if (view.componentDefinition.componentPath === 'ridge-container/composite' && view.el.composite && view.el.composite.config) {
        // 获取Compsite定义属性，同时如果原为connect，这里也增加connect
        nodePropFields.push(...getCompositePropertiesDef(view.el.composite).map(p => {
          const [, name] = p.field.split('.')
          // if (p.connect) {
          // }
          p.fieldEx = 'propEx.' + name
          p.field = 'props.' + name
          return p
        }))
        nodeEventFields.push(...getCompositeEventsDef(view.el.composite))
      }
    }
    this.componentPropFormApi.reset()
    this.setState({
      configPage: false,
      nodePropFields,
      nodeEventFields
    }, () => {
      this.updateComponentConfig(view)
      this.componentEventFormApi.setValue('events', view.config.events, {
        notNotify: true
      })
    })
  }

  updateComponentConfig (view) {
    if (view === this.componentView) {
      for (const key of ['title', 'props', 'propEx', 'style', 'styleEx', 'id', 'visible', 'full']) {
        this.componentPropFormApi.setValue(key, view.config[key], {
          notNotify: true
        })
      }
    }
  }

  updatePageConfigFields () {
    const { editorComposite } = context
    const { appService } = context.services
    this.setState({
      configPage: true,
      pagePropsFields: [...PAGE_FIELDS,
        /*
        {
          field: 'jsFiles',
          label: '脚本库',
          control: 'select',
          placeholder: '请选择脚本文件',
          optionList: appService.filterFiles(node => node.mimeType === 'text/javascript').map(file => {
            return {
              value: 'composite://' + file.path,
              label: file.path
            }
          }),
          required: false,
          allowCreate: true,
          filter: true,
          multiple: true
        },
        */
        /* {        field: 'style.classNames',
        label: '样式库',
        control: 'select',
        placeholder: '请选择样式',
        optionList: editorComposite.classNames.map(c => {
          return {
            label: c.label,
            value: c.className
          }
        }),
        required: false,
        multiple: true
      } */
        // 附加内部store的属性暴露
        ...getCompositePropertiesDef(context.editorComposite)],
      pageEventFields: [...PAGE_EVNETS, ...getCompositeEventsDef(context.editorComposite)]
    }, () => {
      const { classList, style, jsFiles, fontFiles, name, properties, events } = editorComposite.config

      this.pagePropFormApi.setValue('classList', classList, {
        notNotify: true
      })
      this.pagePropFormApi.setValue('style', style, {
        notNotify: true
      })
      this.pagePropFormApi.setValue('properties', properties, {
        notNotify: true
      })
      this.pagePropFormApi.setValue('fontFiles', fontFiles, {
        notNotify: true
      })
      this.pagePropFormApi.setValue('jsFiles', jsFiles, {
        notNotify: true
      })
      this.pagePropFormApi.setValue('name', name, {
        notNotify: true
      })
      this.pageEventFormApi.setValue('events', events, {
        notNotify: true
      })
    })
  }

  nodeRectChange (el) {
    this.styleChange(el)
  }

  render () {
    const {
      nodePropFields,
      nodeEventFields,
      pagePropsFields,
      pageEventFields,
      configPage
    } = this.state
    const basicStylesAPI = formApi => {
      this.componentStyleFormApi = formApi
    }

    // 回写styleApi句柄以便直接操作基础form
    const basicPropsAPI = (formApi) => {
      this.componentPropFormApi = formApi
    }

    const eventPropsAPI = (formApi) => {
      this.componentEventFormApi = formApi
    }
    // 回写styleApi句柄以便直接操作基础form
    const cbPagePropFormApi = (formApi) => {
      this.pagePropFormApi = formApi
    }

    const pageEventPropsAPI = formApi => {
      this.pageEventFormApi = formApi
    }

    // 组件属性表单项修改  组件样式和属性变动
    const componentPropValueChange = (values, field) => {
      if (values.id === this.componentView.config.id) {
        context.updateComponentConfig(this.componentView, values, field)
      }
    }

    const componentEventValueChange = (values, field) => {
      context.updateComponentConfig(this.componentView, values)
    }
    const pageEventValueChange = (values, field) => {
      context.editorComposite.updatePageConfig(values)
      // context.updateComponentConfig(this.componentView, values)
    }

    const pagePropValueChange = (values, field) => {
      context.editorComposite.updatePageConfig(values)
    }

    return (
      <div className='config-panel'>
        <Tabs
          className='on-title'
          type='card'
          style={{
            display: configPage ? 'none' : 'block'
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
            display: configPage ? 'block' : 'none'
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
}
