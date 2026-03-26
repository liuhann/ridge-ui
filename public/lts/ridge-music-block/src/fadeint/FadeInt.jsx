import React, { useEffect, useState } from 'react'
import './style.css'
import tone0 from './tone/0.mp3'
import tone1 from './tone/1.mp3'
import tone2 from './tone/2.mp3'
import tone3 from './tone/3.mp3'
import tone4 from './tone/4.mp3'
import tone5 from './tone/5.mp3'
import tone6 from './tone/6.mp3'
import tone7 from './tone/7.mp3'
import tone8 from './tone/8.mp3'
import tone9 from './tone/9.mp3'
import tone10 from './tone/10.mp3'
import tone11 from './tone/11.mp3'
import tone12 from './tone/12.mp3'
import tone13 from './tone/13.mp3'
import tone14 from './tone/14.mp3'

const TONES = {
  tone1,
  tone2,
  tone3,
  tone4,
  tone5,
  tone6,
  tone7,
  tone8,
  tone9,
  tone10,
  tone11,
  tone12,
  tone13,
  tone14
}

export default ({
  active,
  level,
  speed,
  colorfrom,
  colorto,
  delay,
  onClick
}) => {
  const ref = React.createRef(null)
  const [huzzar, setHuzzar] = useState(false)

  const onAnimationIteration = () => {
    if (active) {
      const howl = new Howl({
        src: [TONES['tone' + level]]
      })
      try {
        howl.play()
      } catch (e) {}

      setHuzzar(true)

      setTimeout(() => {
        setHuzzar(false)
      }, 500)
    }
  }

  useEffect(() => {
    const holderEl = ref.current

    if (holderEl) {
      holderEl.addEventListener('animationiteration', onAnimationIteration)
    }
    return () => {
      if (holderEl) {
        holderEl.removeEventListener('animationiteration', onAnimationIteration)
      }
    }
  })

  const rootStyle = {
    '--color-0': colorfrom,
    '--color-1': colorto,
    backgroundColor: colorto,
    // animation: `line ${speed}s linear infinite`,
    'animation-delay': delay + 'ms'
  }

  if (speed) {
    rootStyle.animation = `line ${speed}s linear infinite`
    rootStyle.animationDelay = delay + 'ms'
  }

  return (
    <span
      onClick={onClick}
      className='tone-holder' ref={ref} style={rootStyle}
    >
      <div className={'note ' + (active ? 'active' : '')}>
        <div className={'ripple' + ' ' + (huzzar ? 'huzzar' : '')} />
      </div>
    </span>
  )
}
