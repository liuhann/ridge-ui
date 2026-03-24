import SwitchContainer from './SwitchContainer.js'
import { boolean, children, classList, select } from 'ridge-build/src/props'
export default {
  name: 'switch-container',
  component: SwitchContainer,
  title: '切换容器',
  type: 'vanilla',
  icon: 'icons/switch.svg',
  props: [{
    name: 'current',
    label: '当前内容',
    connect: true,
    input: true,
    type: 'string',
    value: ''
  },
  boolean('preload', '预加载', true),
  boolean('swipeable', '滑动切换', false),
  select('swipeEffect', '切换效果', [{
    label: '平移',
    value: 'slide'
  }, {
    label: '淡入',
    value: 'fade'
  }, {
    label: '卡片',
    value: 'cards'
  }, {
    label: '翻转',
    value: 'flip'
  }, {
    label: '原地缩小',
    value: 'prevBack'
  }, {
    label: '间距',
    value: 'slideSpace'
  }, {
    label: '缓退',
    value: 'preStep'
  }, {
    label: '折叠',
    value: 'slideCurve'
  }]),
  classList(),
  children],
  events: [{
    label: '切换',
    name: 'onChange'
  }],
  fullScreenable: true,
  width: 540,
  height: 360
}
