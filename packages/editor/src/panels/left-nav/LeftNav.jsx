import React, { useState } from 'react'
import NavBar from '../../components/NavBar/NavBar.jsx'
import { ICON_NAV_COMPONENTS, ICON_NAV_FOLDERS, ICON_NAV_RUN, ICON_COMMON_GEAR } from '../../icons/icons.js'
const LeftNav = ({
  onChange
}) => {
  const [active, setActive] = useState(0)
  return (
    <NavBar
      onChange={(item, index) => {
        setActive(index)
        onChange(item.name)
      }}
      active={active}
      navs={[{
        name: 'app',
        icon: ICON_NAV_FOLDERS
      }, {
        name: 'component',
        icon: ICON_NAV_COMPONENTS
      }, {
        name: 'preview',
        icon: ICON_NAV_RUN
      }]}
      bottoms={[{
        icon: ICON_COMMON_GEAR
      }]}
    />
  )
}

export default LeftNav
