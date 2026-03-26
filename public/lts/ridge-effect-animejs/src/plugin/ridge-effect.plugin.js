import { animate, queryToObject } from './utils.js'

export default {
  name: 'animations',
  description: 'AnimeJS动画',
  control: () => import('./EffectControl.jsx'),
  apply: (value, el, complete) => {
    const config = queryToObject(value)
    animate(el, config, complete)
  }
}
