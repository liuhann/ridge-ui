import React, { useState } from 'react'
import { Tooltip, Typography, Popover } from '@douyinfe/semi-ui'
import { getDisplayName, getInitial, getIconUrl } from './componentUtils'
import DragStore from '../../workspace/DragStore'

const { Text } = Typography

const ComponentItemCard = ({ packageName, item, onItemClick }) => {
  const displayName = getDisplayName(item)
  const description = item.description || '无描述'
  const iconUrl = getIconUrl(item)
  const tags = item.tags || []
  const [isHovered, setIsHovered] = useState(false)

  const handleCardClick = () => {
    if (onItemClick) {
      onItemClick(item)
    }
  }

  const handleDragStart = () => {
    DragStore.setDragData({
      type: 'component',
      packageName,
      componentName: item.name,
      item
    })
  }

  return (
    <Popover
      trigger='click'
      content={
        <div className='component-item-tooltip'>
          <div className='tooltip-header'>
            {iconUrl && (
              <img src={iconUrl} alt={displayName} className='tooltip-thumbnail' />
            )}
            <div>
              <h3 className='tooltip-title'>{displayName}</h3>
            </div>
          </div>
          {description && (
            <Text className='tooltip-description'>{description}</Text>
          )}
          {tags.length > 0 && (
            <div className='tooltip-tags'>
              {tags.slice(0, 3).map((tag, idx) => (
                <span key={idx} className='tooltip-tag'>{tag}</span>
              ))}
            </div>
          )}
        </div>
      }
      position='top'
      showArrow
      mouseEnterDelay={300}
      className='component-item-tooltip-wrapper'
    >
      <div
        className='component-item-card'
        draggable
        onDragStart={handleDragStart}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className='component-item-image'>
          {iconUrl
            ? (
              <img
                src={iconUrl}
                alt={displayName}
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.parentElement.innerHTML = `<div class="default-item-icon">${getInitial(displayName)}</div>`
                }}
              />
              )
            : (
              <div className='default-item-icon'>
                {getInitial(displayName)}
              </div>
              )}
        </div>

        <div className='component-item-content'>
          <Text strong className='component-item-name'>
            {displayName}
          </Text>
        </div>
      </div>
    </Popover>
  )
}

export default ComponentItemCard
