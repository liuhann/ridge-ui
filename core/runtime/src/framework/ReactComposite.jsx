import React, { useRef, useEffect } from 'react'
import Composite from '../node/Composite'
/**
 * 给出应用的页面（app+page）将其作为React组件进行显示
 */
export default ({
  app,
  path,
  loader,
  ...args
}) => {
  const ref = useRef(null)

  let ridgeLoader = loader
  if (!loader) {
    if (window.RidgeUI) {
      ridgeLoader = window.RidgeUI.loader
    }
  }

  if (!ridgeLoader) {
    console.error('请在页面引入ridgejs库')
    return <>请在页面引入RidgeUI库</>
  }

  useEffect(() => {
    // 只针对 app + path的修改才重新mount，大部分情况应该仅mount一次
    const composite = new Composite({
      appName: app,
      path,
      loader: ridgeLoader
    })
    composite.mount(ref.current)
  }, [app, path])

  useEffect(() => {
    if (ref.current.ridgeComposite) {
      ref.current.ridgeComposite.setProperties(args)
    }
  }, args)

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        height: '100%'
      }}
    />
  )
}
