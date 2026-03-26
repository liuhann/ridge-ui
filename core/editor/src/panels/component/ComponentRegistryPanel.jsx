import React, { useState, useEffect } from 'react'
import { Typography } from '@douyinfe/semi-ui'
import './ComponentRegistryPanel.less'

const { Text } = Typography

// 分类定义
const CATEGORIES = {
  container: {
    title: '容器组件',
    color: 'blue'
  },
  interaction: {
    title: '交互组件',
    color: 'green'
  },
  chart: {
    title: '图表组件',
    color: 'purple'
  }
}

// 获取版本号
const getVersion = (dist) => {
  if (!dist) return '未知版本'

  if (Array.isArray(dist)) {
    const firstDist = dist[0] || ''
    const match = firstDist.match(/@([\d.]+)/)
    return match ? `v${match[1]}` : '未知版本'
  } else {
    const match = dist.match(/@([\d.]+)/)
    return match ? `v${match[1]}` : '未知版本'
  }
}

// 获取显示名称
const getDisplayName = (module) => {
  if (!module) return '未知组件'

  return module.title
}

// 获取首字母
const getInitial = (name) => {
  if (!name) return '?'
  return name.charAt(0).toUpperCase()
}

// 更新getIconUrl函数
const getIconUrl = (item) => {
  // 优先使用registry中的icon字段
  if (item.icon) {
    return item.icon
  }

  // 如果没有提供图标，使用组件名称的首字母作为默认图标
  return null
}

// 组件卡片
const ComponentCard = ({ item }) => {
  const displayName = getDisplayName(item)
  const version = getVersion(item.dist)
  const iconUrl = getIconUrl(item)
  const dependencies = item.dependencies || []

  return (
    <div className='component-card'>
      {/* 卡片主内容 */}
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

      {/* 鼠标悬停提示信息 */}
      <div className='component-card-hover'>
        <Text className='component-card-hover-title'>
          {displayName}
        </Text>

        <Text className='component-card-hover-version'>
          {version}
        </Text>

        {item.description && (
          <Text className='component-card-hover-description'>
            {item.description}
          </Text>
        )}

        {dependencies.length > 0 && (
          <div className='component-card-hover-dependencies'>
            {dependencies.slice(0, 3).map((dep, index) => (
              <span key={index} className='component-card-dependency'>
                {dep}
              </span>
            ))}
            {dependencies.length > 3 && (
              <span className='component-card-dependency'>
                +{dependencies.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// 分类标题
const CategoryHeader = ({ title, count }) => (
  <div className='category-header'>
    <div className='category-header-title'>
      {title}
      <span className='category-header-count'>{count}个</span>
    </div>
  </div>
)

// 主组件
const ComponentGrid = ({ componentStore, onItemClick }) => {
  const [componentData, setComponentData] = useState([])

  // 从store获取数据
  const registry = componentStore(state => state.registry)
  const init = componentStore(state => state.init)

  // 初始化数据
  useEffect(() => {
    init()
  }, [init])

  // 处理数据变化
  useEffect(() => {
    if (Array.isArray(registry)) {
      // 过滤掉基础库，只展示UI组件
      const filteredRegistry = registry.filter(item => item.category !== 'base')
      setComponentData(filteredRegistry)
    }
  }, [registry])

  // 按分类分组
  const groupedData = componentData.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {})

  // 处理卡片点击
  const handleCardClick = (item) => {
    if (onItemClick) {
      onItemClick(item)
    }
  }

  return (
    <div className='component-grid'>
      {/* 头部信息 */}
      <div className='component-grid-header'>
        <h2 className='component-grid-title'>组件库</h2>
      </div>

      {/* 网格列表 */}
      <div className='component-grid-container'>
        <div className='component-grid-list'>
          {Object.entries(CATEGORIES).map(([categoryKey, categoryInfo]) => {
            const items = groupedData[categoryKey] || []
            if (items.length === 0) return null

            return (
              <React.Fragment key={categoryKey}>
                <CategoryHeader
                  title={categoryInfo.title}
                  count={items.length}
                />

                {items.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleCardClick(item)}
                  >
                    <ComponentCard item={item} />
                  </div>
                ))}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* 底部统计 */}
      <div className='component-grid-footer'>
        <Text className='component-grid-count'>
          已加载 {componentData.length} 个组件库
        </Text>
      </div>
    </div>
  )
}

export default ComponentGrid
