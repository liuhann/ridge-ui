import Timer from './Timer.jsx'
import { boolean, string, icon, classList } from 'ridge-build/src/props.js'
export default {
  name: 'Timer',
  component: Timer,
  title: '标签',
  icon: 'bi bi-patch-exclamation-fill',
  type: 'react',
  props: [
    string('text', '文本', '标签'),
    boolean('pill', '圆形', false),
    boolean('showClose', '可关闭', false),
    icon(),
    classList()
  ],
  events: [{
    label: '点击',
    name: 'onClick'
  }, {
    label: '关闭',
    name: 'onClose'
  }],
  width: 44,
  height: 20
}
