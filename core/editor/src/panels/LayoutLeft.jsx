import React, { useEffect, useState } from 'react'

import { Breadcrumb } from '@douyinfe/semi-ui'

import ProiconsHome from './icons/ProiconsHome.svg'

import AppListPanel from './apps/AppListPanel.jsx'
import AppFileList from './files/AppFileList.jsx'
import appStore from '../store/app.store.js'

const THEMES = [{
  label: '默认',
  value: '@douyinfe/semi-ui/dist/css/semi.min.css'
}, {
  label: '抖音',
  value: '@semi-bot/semi-theme-doucreator/semi.min.css'
}, {
  label: '飞书',
  value: '@semi-bot/semi-theme-universedesign/semi.min.css'
}, {
  label: 'Strapi',
  value: '@semi-bot/semi-theme-strapi/semi.min.css'
}, {
  label: '深蓝',
  value: '@semi-bot/semi-theme-ultim-dark-blue/semi.min.css'
}, {
  label: '剪映',
  value: '@semi-bot/semi-theme-jianying/semi.min.css'
}]

export default ({
  risizeWidth
}) => {
  const currentAppName = appStore((state) => state.currentAppName)
  const backToAppList = appStore((state) => state.backToAppList)

  const onRootListClick = () => {
    backToAppList()
  }

  return (
    <div
      className='root-nav' style={{
        width: risizeWidth + 'px'
      }}
    >
      <Breadcrumb
        style={{ flex: 1 }} showTooltip={{
          width: 80
        }}
      >
        <Breadcrumb.Item onClick={onRootListClick} icon={<ProiconsHome />}>全部应用</Breadcrumb.Item>
        {currentAppName && <Breadcrumb.Item>{currentAppName}</Breadcrumb.Item>}
      </Breadcrumb>
      {currentAppName === '' && <AppListPanel />}
      {currentAppName && <AppFileList />}
    </div>
  )
}
