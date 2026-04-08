import FixedContainer from './GroupContainer.js'
import { classList, number, slot } from 'ridge-build/src/props.js'
export default {
  name: 'fixed-container',
  component: FixedContainer,
  title: '固定容器',
  type: 'react',
  icon: 'icons/fixed.svg',
  props: [
    slot('content', '内容'),
    {
      label: '位置',
      name: 'align',
      type: 'array',
      control: 'select',
      multiple: true,
      options: [{
        label: '靠左',
        value: 'left'
      }, {
        label: '靠右',
        value: 'right'
      }, {
        label: '靠上',
        value: 'top'
      }, {
        label: '靠下',
        value: 'bottom'
      }],
      value: ['left', 'top']
    },
    {
      name: 'left',
      label: '距左',
      type: 'number',
      hidden: values => values.props?.align?.indexOf('left') === -1
    },
    {
      name: 'top',
      label: '距上',
      type: 'number',
      hidden: values => values.props?.align?.indexOf('top') === -1
    },
    {
      name: 'right',
      label: '距右',
      type: 'number',
      hidden: values => values.props?.align?.indexOf('right') === -1
    },
    {
      name: 'bottom',
      label: '距下',
      type: 'number',
      hidden: values => values.props?.align?.indexOf('bottom') === -1
    },
    classList()
  ],
  portalled: true,
  width: 240,
  height: 240
}
