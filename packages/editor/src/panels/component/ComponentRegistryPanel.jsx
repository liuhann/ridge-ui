// ComponentRegistryPanel.jsx
import React, { useState, useEffect, useCallback } from 'react'
import { Button, Empty, Spin, Typography } from '@douyinfe/semi-ui'
import { IconArrowLeft, IconRefresh, IconSearch } from '@douyinfe/semi-icons'
import { CATEGORIES, getDisplayName } from './componentUtils'
import componentRegistry from '../../service/ComponentRegistry'
import ComponentLibCard from './ComponentLibCard.jsx'
import ComponentItemCard from './ComponentItemCard.jsx'
import CategoryHeader from './CategoryHeader.jsx'
import './ComponentRegistryPanel.less'

const { Text } = Typography

const ComponentRegistryPanel = () => {
  const [currentView, setCurrentView] = useState('libs')
  const [currentLib, setCurrentLib] = useState(null)
  const [libComponents, setLibComponents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [componentData, setComponentData] = useState([])
  const [componentLibMeta, setComponentLibMeta] = useState({})

  // 移除原来的 zustand 状态
  const [registry, setRegistry] = useState([])

  useEffect(() => {
    // 初始化组件注册表
    const initRegistry = async () => {
      try {
        await componentRegistry.init()
        const reg = componentRegistry.getRegistry()
        const filteredRegistry = reg.filter(item => item.category !== 'base')
        setRegistry(reg)
        setComponentData(filteredRegistry)
      } catch (err) {
        console.error('初始化组件注册表失败:', err)
      }
    }

    initRegistry()
  }, [])

  const groupedData = componentData.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {})

  const loadLibComponents = useCallback(async (libItem) => {
    if (!libItem.meta) {
      setError('该组件库没有定义元数据文件')
      return
    }

    setLoading(true)
    setError(null)
    setCurrentLib(libItem)

    try {
      // 使用单例服务加载库
      const componentLibMeta = await componentRegistry.loadLibMeta(libItem.module)

      const mockComponents = componentLibMeta.components

      setComponentLibMeta(componentLibMeta)
      setLibComponents(mockComponents)
      setCurrentView('components')
    } catch (err) {
      setError(`加载组件库失败: ${err.message}`)
      console.error('加载组件库失败:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleBackToLibs = () => {
    setCurrentView('libs')
    setCurrentLib(null)
    setLibComponents([])
  }

  const handleLibClick = (libItem) => {
    loadLibComponents(libItem)
  }

  const renderLibsView = () => (
    <>
      <div className='component-grid-header'>
        <h2 className='component-grid-title'>组件库</h2>
        <Text className='component-grid-subtitle'>
          将鼠标悬停在组件库上查看详细信息
        </Text>
      </div>

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
                  <ComponentLibCard
                    key={index}
                    item={item}
                    onItemClick={handleLibClick}
                  />
                ))}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      <div className='component-grid-footer'>
        <Text className='component-grid-count'>
          已加载 {componentData.length} 个组件库 | 悬停查看详情
        </Text>
      </div>
    </>
  )

  const renderComponentsView = () => (
    <>
      <div className='component-view-header'>
        <div className='header-left'>
          <Button
            icon={<IconArrowLeft />}
            theme='borderless'
            onClick={handleBackToLibs}
            className='back-button'
          />
          <div className='lib-info'>
            <h2 className='lib-name'>{getDisplayName(currentLib)}</h2>
            {currentLib.version && (
              <span className='lib-version'>v{currentLib.version}</span>
            )}
          </div>
        </div>
        {currentLib.description && (
          <Text className='lib-description'>{currentLib.description}</Text>
        )}
      </div>

      {loading
        ? (
          <div className='loading-container'>
            <Spin size='large' />
            <Text className='loading-text'>正在加载组件...</Text>
          </div>
          )
        : error
          ? (
            <div className='error-container'>
              <Empty
                title='加载失败'
                description={error}
                image={<IconRefresh style={{ fontSize: '60px', color: 'var(--semi-color-disabled-text)' }} />}
              />
              <Button
                icon={<IconRefresh />}
                onClick={() => loadLibComponents(currentLib)}
                className='retry-button'
              >
                重试
              </Button>
            </div>
            )
          : (
            <>
              <div className='components-view-container'>
                {libComponents.length === 0
                  ? (
                    <div className='empty-container'>
                      <Empty
                        title='暂无组件'
                        description='该组件库中没有找到组件定义'
                        image={<IconSearch style={{ fontSize: '60px', color: 'var(--semi-color-disabled-text)' }} />}
                      />
                    </div>
                    )
                  : (
                    <div className='components-grid'>
                      {libComponents.map((component, index) => (
                        <div key={index} className='component-grid-item'>
                          <ComponentItemCard
                            packageName={componentLibMeta.name}
                            item={component}
                            onItemClick={() => {}}
                          />
                        </div>
                      ))}
                    </div>
                    )}
              </div>

              <div className='components-view-footer'>
                <Text className='components-count'>
                  共 {libComponents.length} 个组件
                </Text>
                <Text className='components-tip'>
                  点击组件以使用
                </Text>
              </div>
            </>
            )}
    </>
  )

  return (
    <div className='component-grid'>
      {currentView === 'libs' ? renderLibsView() : renderComponentsView()}
    </div>
  )
}

export default ComponentRegistryPanel
