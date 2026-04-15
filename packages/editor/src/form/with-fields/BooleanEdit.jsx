import React from 'react'
import { Checkbox, Button, withField, Tooltip } from '@douyinfe/semi-ui'

const BooleanEdit = ({
  value,
  onChange,
  ...options
}) => {
  if (options.icon) {
    return (
      <Tooltip content={options.prompt}>
        <Button
          icon={options.icon}
          size='small'
          type={value ? 'primary' : 'tertiary'}
          theme={value ? 'solid' : 'borderless'}
          onClick={() => {
            onChange(!value)
          }}
        />
      </Tooltip>
    )
  } else if (options.toggle) {
    return <></>
  } else {
    return <Checkbox size='small' checked={value} onChange={() => onChange(!value)} />
  }
}

export default withField(BooleanEdit)
