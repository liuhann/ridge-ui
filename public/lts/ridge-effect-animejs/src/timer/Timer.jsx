import { useEffect } from 'react'
import './style.css'

export default ({
  bgColor,
  color
}) => {
  useEffect(() => {

  })

  const style = {
    color,
    backgroundColor: bgColor
  }
  return <span className='digital-lcd' style={style}>0</span>
}
