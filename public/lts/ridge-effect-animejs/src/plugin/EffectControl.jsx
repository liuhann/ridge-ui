import { eases, animationOut, animationIn } from './buildInAnimations.js'
import { animate, queryToObject, animationsToSelectOptions, objectToQuery } from './utils.js'
import './style.css'
const { useRef, useState } = window.React
const { Form } = window.SemiUI

const {
  InputNumber,
  Select
} = Form

export default ({
  value,
  onChange
}) => {
  const formValue = queryToObject(value || '')

  formValue.name = formValue.name ?? 'rotateOutBack'
  formValue.d = formValue.d ?? 400
  formValue.l = formValue.l ?? 0
  formValue.e = formValue.e ?? 'inQuad'

  const ref = useRef(null)
  const [configValues, setConfigValues] = useState(formValue)

  const refreshAnimation = (values) => {
    if (ref.current) {
      const animateTarget = ref.current.querySelector('div.anime-animate-target')

      if (animateTarget) {
        ref.current.removeChild(animateTarget)
      }

      const animateEl = document.createElement('div')
      animateEl.classList.add('anime-animate-target')
      ref.current.appendChild(animateEl)
      animate(animateEl, values)
    }
  }
  return (
    <div style={{
      padding: '10px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}
    >
      <Form
        initValues={configValues}
        layout='horizontal' onValueChange={(values, changedValue) => {
          setConfigValues(values)
          onChange(objectToQuery(values))
          if (changedValue.name) {
            refreshAnimation(values)
          }
        }}
        getFormApi={api => {
          // api.setValues(formValue)
        }}
        render={({ formState, formApi, values }) => {
          return (
            <>
              <Select
                field='name' label='动画名称'
              >{
                animationsToSelectOptions(animationIn, animationOut).map((group, index) => (
                  <Select.OptGroup label={group.label} key={index}>
                    {group.children.map((option, index2) => (
                      <Select.Option value={option.value} key={index2}>
                        {option.label}
                      </Select.Option>
                    ))}
                  </Select.OptGroup>
                ))
          }

              </Select>
              <InputNumber field='d' label='持续' suffix='毫秒' style={{ width: 160 }} />
              <Select
                field='e' label='时序' optionList={eases.map(es => {
                  return {
                    label: es,
                    value: es
                  }
                })}
              />
              <InputNumber field='l' label='延迟' suffix='毫秒' style={{ width: 160 }} />
            </>
          )
        }}
      />

      <div
        className='anime-preview' style={{
          flex: 1,
          display: 'flex',
          alignItems: 'stretch',
          flexDirection: 'column'
        }}
      >
        <div onClick={() => {
          refreshAnimation(configValues)
        }}
        >刷新
        </div>
        <div
          ref={ref} style={{
            flex: 1,
            position: 'relative',
            width: '100%'
          }}
        >
          <div className='anime-animate-shadow' />
          <div className='anime-animate-target' />
        </div>
      </div>
    </div>
  )
}
