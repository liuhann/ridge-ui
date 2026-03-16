import React from 'react'
import NavBar from '../../components/NavBar/NavBar.jsx'


const LeftNav = () => {
  return (
    <NavBar
      navs={[{
        icon: <i className='bi bi-folder2' />
      }, {
        icon: <i className='bi bi-grid-1x2' />
      }]}
      bottoms={[{
        icon: <i className='bi bi-gear' />
      }]}
    />
  )
}

export default LeftNav
