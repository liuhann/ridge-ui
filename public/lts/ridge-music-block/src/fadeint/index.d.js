import FadeInt from './FadeInt'
import { boolean, color, number, onClick } from 'ridge-build/src/props'
export default {
  name: 'FadeInt',
  title: '循环播放',
  component: FadeInt,
  icon: 'bi bi-pie-chart',
  type: 'react',
  props: [
    boolean('active', '播放', false),
    number('level', '音高', 5, true),
    number('speed', '循环时间', 6, true),
    number('delay', '循环延迟', 20, true),
    color('colorfrom', '起始颜色', '#FCD7D6'),
    color('colorto', '结束颜色', '#F36E6B')
  ],
  events: [onClick],
  width: 100,
  height: 100
}
