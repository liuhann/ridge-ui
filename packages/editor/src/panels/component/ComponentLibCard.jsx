// components/ComponentLibCard.jsx
import React, { useState } from 'react'
import { Popover, Tooltip, Typography } from '@douyinfe/semi-ui'
import { getDisplayName, getInitial, getIconUrl } from './componentUtils'
import PopoverDetailContent from './PopoverDetailContent.jsx'

const { Text } = Typography

const ComponentLibCard = ({ item, onItemClick }) => {
  const displayName = getDisplayName(item)
  const version = item.version || '未知'
  const iconUrl = getIconUrl(item)
  const [popoverVisible, setPopoverVisible] = useState(false)

  const handleCardClick = () => {
    if (onItemClick) {
      onItemClick(item)
    }
  }

  return (
    <Popover
      visible={popoverVisible}
      onVisibleChange={setPopoverVisible}
      content={<PopoverDetailContent item={item} />}
      position='right'
      trigger='hover'
      className='component-popover'
      showArrow
      autoAdjustOverflow
      spacing={12}
    >
      <div
        className='component-card'
        onClick={handleCardClick}
        onMouseEnter={() => setPopoverVisible(true)}
        onMouseLeave={() => setPopoverVisible(false)}
      >
        <div className='component-card-image'>
          {iconUrl
            ? (
  <img src={iconUrl} alt={displayName} />
              )
            : (
  <div className='default-icon'>
              {getInitial(displayName)}
            </div>
              )}
        </div>

        <Text className='component-card-name'>
          {displayName}
        </Text>

        <Tooltip content={`${displayName} - ${version}`}>
          <div style={{ position: 'absolute', inset: 0 }} />
        </Tooltip>
      </div>
    </Popover>
  )
}

export default ComponentLibCard
