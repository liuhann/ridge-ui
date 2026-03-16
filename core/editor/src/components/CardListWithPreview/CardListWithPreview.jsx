import React, { useState } from 'react'
import './style.less'
// 文件列表组件
const CardList = ({
  onItemClick,
  list = []
}) => {
  const [currentKey, setCurrentKey] = useState(list[0].key)
  return (
    <div className='card-list-preview'>
      {list && list.map((item, index) => {
        return (
          <div
            onClick={() => {
              setCurrentKey(item.key)
              onItemClick(item.key)
            }}
            className={'card' + (currentKey === item.key ? ' selected' : '')} key={index}
          >
            <div className='top'>
              {item.cover}
            </div>
            <div className='bottom'>
              {item.label}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default CardList
