import BaseContainer from '../BaseContainer.js'
import './style.css'

const SLIDE_EFFECTS = {
  prevBack: {
    prev: {
      shadow: true,
      translate: [0, 0, -400]
    },
    next: {
      translate: ['100%', 0, 0]
    }
  },
  slideSpace: {
    prev: {
      shadow: true,
      translate: ['-120%', 0, -500]
    },
    next: {
      shadow: true,
      translate: ['120%', 0, -500]
    }
  },
  preStep: {
    prev: {
      shadow: true,
      translate: ['-20%', 0, -1]
    },
    next: {
      translate: ['100%', 0, 0]
    }
  },
  slideCurve: {
    prev: {
      shadow: true,
      origin: 'left center',
      translate: ['-5%', 0, -200],
      rotate: [0, 100, 0]
    },
    next: {
      origin: 'right center',
      translate: ['5%', 0, -200],
      rotate: [0, -100, 0]
    }
  }
}
/**
 * 内容切换显示容器
 */
export default class SwitchContainer extends BaseContainer {
  isSwiper () {
    const { swipeable, swipeEffect } = this.props

    return (swipeable || swipeEffect) && this.isRuntime
  }

  // 获取子元素容器， 在启用了swipper后， 需要按swipper结构创建swiperEl
  getChildWrapper () {
    if (this.isSwiper()) {
      if (!this.swiperEl) {
        this.swiperEl = document.createElement('div')
        this.containerEl.appendChild(this.swiperEl)
        this.swiperEl.classList.add('swiper-wrapper')
      }
      return this.swiperEl
    } else {
      return this.containerEl
    }
  }

  /**
   * 容器挂载
   * @param {*} el
   */
  async mounted () {
    const { __composite, onChange, swipeEffect, swipeable } = this.props
    this.containerEl.classList.add('switch-container')
    this.forceUpdateChildren = true
    if (this.isSwiper()) {
      this.containerEl.parentElement.style.overflow = 'hidden'
      await __composite.loadScript('/swiper@11/swiper-bundle.min.css')
      await __composite.loadScript('/swiper@11/swiper-bundle.min.js')

      const { Swiper } = window

      if (!Swiper) {
        console.error('swiper@11 not loaded')
      }
      const initialSlide = this.getCurrentSlideIndex()

      const effect = {}

      if (swipeable) {
        effect.allowTouchMove = true
      } else {
        effect.allowTouchMove = false
      }

      if (swipeEffect) {
        if (SLIDE_EFFECTS[swipeEffect]) {
          effect.effect = 'creative'
          effect.creativeEffect = SLIDE_EFFECTS[swipeEffect]
        } else {
          effect.effect = swipeEffect
        }
      }
      this.swiper = new Swiper(this.containerEl, {
        initialSlide,
        edgeSwipeDetection: true,
        ...effect
      })

      this.swiper.on('slideChange', swiper => {
        const idx = swiper.realIndex
        const key = this.getChildWrapper().children[idx].getAttribute('ridge-title')
        onChange && onChange(key)
      })
    }
    // await this.handleDynamicPages()
    await this.toggleState()
  }

  getCurrentSlideIndex (index) {
    const { current } = this.props
    const childElements = this.getChildWrapper().children
    let currentIndex = -1

    // 当前索引值：优先取方法参数（编辑需要），然后是属性
    const currentIndexValue = index == null ? current : index
    for (let i = 0; i < childElements.length; i++) {
      if (currentIndexValue === childElements[i].getAttribute('ridge-title') ||
      parseInt(currentIndexValue) === i ||
        (i === 0 && currentIndexValue === true) ||
        (i === 1 && currentIndexValue === false) ||
        (this.isEditor && i === 0 && currentIndexValue == null)) {
        currentIndex = i
        break
      }
    }

    if (currentIndex === -1) currentIndex = 0
    return currentIndex
  }

  /**
   * 切换到显示某个内容元素, 当未加载时,执行加载和初始化动作
   */
  async toggleState (index) {
    const childElements = this.getChildWrapper().children
    const currentIndex = this.getCurrentSlideIndex(index)

    if (currentIndex > -1) {
      if (this.isSwiper()) {
        this.swiper.slideTo(currentIndex)
      } else {
        for (let i = 0; i < childElements.length; i++) {
          if (i === currentIndex) {
            childElements[i].setAttribute('toggle-on', true)
            childElements[i].style.display = ''
            if (childElements[i].getAttribute('ridge-mount') !== 'mounted') {
              childElements[i].ridgeNode.mount(childElements[i])
            }
          } else {
            childElements[i].removeAttribute('toggle-on')
            childElements[i].style.display = 'none'
          }
        }
      }
    }
  }

  // 挂载子节点：  但是像Tab容器这样，可以延迟挂载
  async mountChildNode (childNode, div) {
    const { preload } = this.props

    if (this.isSwiper()) {
      div.classList.add('swiper-slide')
    }
    if (preload || this.isEditor) {
      await childNode.mount(div)
    } else {
      div.setAttribute('ridge-title', childNode.config.title)
      div.ridgeNode = childNode
    }
  }

  // Editor Only
  childSelected (childEl) {
    // const childElements = this.getChildElements()

    this.toggleState(childEl.getConfig().title)
  }

  onChildRemoved () {
    this.toggleState()
  }

  onChildAppended (childNode) {
    const childElements = this.getChildElements()
    this.toggleState(childElements.indexOf(childNode.el))
  }

  // 处理动态增加标签页的场景，谨慎，目前只用于首页分页调用
  handleDynamicPages () {
    const { dynamicPages, __composite } = this.props

    if (Array.isArray(dynamicPages)) {
      const validPages = dynamicPages.filter(page => {
        return page.key != null && page.packageName != null
      })

      const wrapper = this.getChildWrapper()

      const lostIndexes = []
      Array.from(wrapper.children).forEach((el, i) => {
        if (el.getAttribute('slide-key') && validPages.find(pageConfig => pageConfig.key === el.getAttribute('slide-key')) == null) {
          lostIndexes.push(i)
        }
      })
      if (this.isSwiper()) {
        this.swiper.removeSlide(lostIndexes)
      }

      for (let i = 0; i < validPages.length; i++) {
        const childIdx = this.children.length + i
        const pageConfig = validPages[i]
        // TODO Check Page config
        let doInsert = false
        if (!wrapper.children[childIdx] || wrapper.children[childIdx].getAttribute('slide-key') !== pageConfig.key) {
          doInsert = true
        }

        if (doInsert) {
          const div = document.createElement('div')
          div.setAttribute('slide-key', pageConfig.key)
          if (this.isSwiper()) {
            div.classList.add('swiper-slide')
            div.style.overflow = 'hidden'
            this.swiper.addSlide(childIdx, [div])
          } else {
            if (wrapper.children[childIdx]) {
              wrapper.insertBefore(div, wrapper.children[childIdx])
            } else {
              wrapper.appendChild(div)
            }
          }
          const element = __composite.createElement({
            id: 'dp-' + Math.random(),
            path: 'ridge-container/composite',
            props: pageConfig,
            title: pageConfig.title
          })
          this.mountChildNode(element, div)
        }
      }

      while (wrapper.children.length > validPages.length + this.children.length) {
        this.swiper.removeSlide(wrapper.children.length - 1)
        // wrapper.removeChild(wrapper.children[wrapper.children.length - 1])
      }
    }
  }

  async updated () {
    // this.handleDynamicPages()
    this.toggleState()
    this.containerEl.classList.add('switch-container')
  }

  getChildStyle (view) {
    const style = this.getResetStyle()
    if (!this.isSwiper()) {
      style.width = '100%'
      style.height = '100%'
      style.position = 'absolute'
      style.left = 0
      style.top = 0
      return style
    }
  }

  onStyleUpdated () {
    this.containerEl.style.position = 'relative'
  }
}
