const memoize = func => {
  const cache = new Map()
  const inProgress = new Map()

  const memoized = async function (...args) {
    const key = JSON.stringify(args)
    if (cache.has(key)) {
      return cache.get(key)
    }

    if (inProgress.has(key)) {
      return inProgress.get(key)
    }

    const promise = func.apply(this, args)
    inProgress.set(key, promise)

    try {
      const result = await promise
      cache.set(key, result)
      return result
    } finally {
      inProgress.delete(key)
    }
  }

  memoized.clearCache = function () {
    cache.clear()
    inProgress.clear()
  }

  return memoized
}

async function selectFile () {
  return new Promise((resolve, reject) => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.style.display = 'none'

    fileInput.addEventListener('change', async function (e) {
      try {
        const files = e.target.files
        if (files.length > 0) {
          const selectedFile = files[0]
          console.log('用户选择的文件是：', selectedFile)
          resolve(selectedFile)
        } else {
          resolve(null)
        }
      } catch (error) {
        console.error('文件处理过程中出现错误：', error)
        resolve(null)
      } finally {
        if (fileInput.parentNode) {
          fileInput.parentNode.removeChild(fileInput)
        }
      }
    })

    document.body.appendChild(fileInput)

    fileInput.click()
  })
}

const showNotification = (m, t = 5000, bg, txt) => {
  const n = document.createElement('div'); n.textContent = m
  Object.assign(n.style, { position: 'fixed', top: '-50px', left: '50%', transform: 'translateX(-50%)', color: txt, border: `2px solid ${bg}`, borderRadius: '8px', background: '#fff', padding: '5px 10px', zIndex: 9999, opacity: 0, transition: 'top 0.3s ease, opacity 0.3s ease' })
  document.body.appendChild(n)
  setTimeout(() => (n.style.top = '10px', n.style.opacity = 1), 50)
  setTimeout(() => { n.style.top = '-50px'; n.style.opacity = 0; setTimeout(() => document.body.removeChild(n), 500) }, t)
}
const showError = (m, t = 5000) => showNotification(m, t, '#f8d7da', '#721c24')
const showMessage = (m, t = 5000) => showNotification(m, t, '#B2E1CB', '#03a65a')
const showWarning = (m, t = 5000) => showNotification(m, t, '#FAD2B5', '#E1781E')

const commonStyle = '@keyframes sandra-open{0%{opacity:0;transform:scale3d(1.1,1.1,1)}100%{opacity:1;transform:scale3d(1,1,1)}}@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes fade-in{0%{opacity:0}100%{opacity:1}}@keyframes sandra-close{0%{opacity:1}100%{opacity:0;transform:scale3d(0.9,0.9,1)}}.sandra-open{animation:sandra-open.3s}.fade-in{animation:fade-in.3s linear}.loading-spinner{border:4px solid rgba(255,255,255,.3);border-top:4px solid #fff;border-radius:50%;width:40px;height:40px;animation:spin 1s linear infinite}.ridge-overlay{position:fixed;z-index:9999999;top:0;left:0;width:100%;transition:opacity.3s;height:100%;background:rgba(55,58,71,.9);display:flex;justify-content:center;align-items:center}.ridge-dialog{background:#fff;border-radius:8px;box-shadow:0 0 10px rgba(0,0,0,.2);width:300px;max-width:90%;padding:30px}.dialog-content{margin-bottom:20px}.dialog-buttons{display:flex;justify-content:flex-end}.dialog-button{padding:8px 16px;margin-left:10px;border:none;border-radius:4px;cursor:pointer}.dialog-button.confirm{background:#007BFF;color:#fff}.dialog-button.cancel{background:#6C757D;color:#fff}'
const styleTag = document.createElement('style'); styleTag.textContent = commonStyle; document.head.appendChild(styleTag)

const showAlert = (m) => {
  const o = document.createElement('div'); o.className = 'ridge-overlay fade-in'
  o.innerHTML = `<div class="ridge-dialog sandra-open"><div class="dialog-content">${m}</div><div class="dialog-buttons"><button class="dialog-button confirm">确定</button></div></div>`
  o.querySelector('.dialog-button.confirm').addEventListener('click', () => document.body.removeChild(o))
  document.body.appendChild(o)
}

const fullscreenLoading = () => {
  const o = document.createElement('div'); o.classList.add('ridge-overlay')
  const s = document.createElement('div'); s.classList.add('loading-spinner')
  o.appendChild(s); document.body.appendChild(o)
  return () => o.parentNode && o.parentNode.removeChild(o)
}

const showConfirm = (m) => new Promise((r) => {
  const o = document.createElement('div'); o.className = 'ridge-overlay fade-in'
  o.innerHTML = `<div class="ridge-dialog sandra-open"><div class="dialog-content">${m}</div><div class="dialog-buttons"><button class="dialog-button confirm">确定</button><button class="dialog-button cancel">取消</button></div></div>`
  const c = o.querySelector('.dialog-button.confirm'); const ca = o.querySelector('.dialog-button.cancel')
  c.addEventListener('click', () => (document.body.removeChild(o), r(true)))
  ca.addEventListener('click', () => (document.body.removeChild(o), r(false)))
  document.body.appendChild(o)
})

const fetchRidgeCloudAPI = async (url, {
  method = 'GET',
  download = false,
  body = {}
} = {}) => {
  try {
    const options = {
      method,
      mode: 'cors',
      credentials: 'include',
      headers: {
        'x-ridge-cloud-sess': window.localStorage.getItem('sess_token')
      }
    }
    if (method === 'POST') {
      if (body instanceof FormData) {
        options.body = body
      } else {
        options.headers['Content-Type'] = 'application/json'
        options.body = JSON.stringify(body)
      }
    }
    const requestUrl = `${globalThis.RIDGE_HOST ?? globalThis.ridgeCloudUrl ?? 'https://ridgeui.com'}${url.startsWith('/') ? url : ('/' + url)}`
    const fetchResult = await fetch(requestUrl, options)

    if (download) {
      return await fetchResult.blob()
    } else {
      return await fetchResult.json()
    }
  } catch (e) {
    console.error('fetchRidgeCloudAPI Error:', e)
    // showError('请求服务失败，地址：' + url)
    return null
  }
}

const getCapchaUrl = async () => {
  const { data } = await fetchRidgeCloudAPI(`/api/captcha?${Math.random().toString(36).substring(7)}`)

  // 创建 Blob 对象
  const blob = new Blob([data.svg], { type: 'image/svg+xml' })

  // 创建 Blob URL
  const svgUrl = URL.createObjectURL(blob)

  window.localStorage.setItem('captcha_token', data.token)
  return svgUrl
}

// 返回3种状态： 'disconnected': 无网络（社区版）  'unlogon': 未登录  user对象：已登录用户
const getUserStatus = memoize(async () => {
  try {
    const sess = window.localStorage.getItem('sess_token')
    if (!sess) {
      return 'unlogon'
    }
    const result = await fetchRidgeCloudAPI('/api/user/current?sess=' + sess)
    if (result.code === '100404') {
      return 'disconnected'
    } else {
      if (result.data && result.data.user) {
        const statusObject = result.data.user
        statusObject.typeLabel = {
          free: '免费账号',
          pay: '付费账号',
          advanced: '高级用户',
          admin: '管理员'
        }[statusObject.type]
        if (statusObject.type === 'free') {
          statusObject.showPromote = true
        } else {
          statusObject.showPromote = false
        }
        return statusObject
      } else {
        return 'unlogon'
      }
    }
  } catch (e) {
    return 'disconnected'
  }
})

/**
 * 用户登录
 * @returns null  服务异常  result 登录返回信息
 */
const login = async (id, password, captcha) => {
  const token = window.localStorage.getItem('captcha_token')
  const requestObject = {
    token,
    id,
    password,
    captcha
  }
  try {
    getUserStatus.clearCache()
    const loginResult = await fetchRidgeCloudAPI('/api/user/login', {
      method: 'POST',
      body: requestObject
    })

    if (loginResult.code === '0' && loginResult.data.sess) {
      window.localStorage.setItem('sess_token', loginResult.data.sess)
      return true
    } else {
      window.localStorage.removeItem('captcha_token')
      return loginResult.msg
    }
  } catch (e) {
    // 登录接口调用异常
    return '未知异常'
  }
}

const register = async (id, password, captcha) => {
  const token = window.localStorage.getItem('captcha_token')
  const requestObject = {
    token,
    id,
    password,
    captcha
  }
  try {
    const result = await fetchRidgeCloudAPI('/api/user/register', {
      method: 'POST',
      body: requestObject
    })
    if (result.code === '0') {
      if (result.data.sess) {
        window.localStorage.setItem('sess_token', result.data.sess)
      }
      return true
    } else if (result.msg) {
      return result.msg
    } else {
      return '未知异常'
    }
  } catch (e) {
    return '未知异常'
  }
}

// 用户退出
const logout = async () => {
  if (await showConfirm('确认退出当前用户?')) {
    await fetchRidgeCloudAPI('/api/user/logout', {
      method: 'POST'
    })

    window.localStorage.removeItem('sess_token')
    getUserStatus.clearCache()
    return true
  }
}

const getStoreStatus = async () => {
  const resultData = await fetchRidgeCloudAPI('/api/app/storage/status')

  if (resultData && resultData.code === '0') {
    const { user, rule, storeList } = resultData.data

    const usedLength = storeList.length
    const statusObject = {
      id: user.id,
      type: user.type,
      allowPublish: rule.npm,
      quotaText: usedLength + '/' + resultData.data.rule.appCount,
      quotaPercentL: usedLength / resultData.data.rule.appCount * 100,
      rule,
      user,
      userApps: storeList
    }

    if (statusObject.userApps.length) {
      statusObject.showAppList = true
    }
    statusObject.userAppTree = storeList.map(item => {
      return {
        value: item.name,
        key: item.name,
        label: item.name,
        item
      }
    })

    return statusObject
  } else {
    return null
  }
}

const deleteApp = async appName => {
  const result = await fetchRidgeCloudAPI('/api/app/storage/delete', {
    method: 'POST',
    body: {
      app: appName
    }
  })
  return result.data
}

const setAvatar = async blob => {
  const formData = new FormData()
  formData.append('avatar', blob)
  const result = await fetchRidgeCloudAPI('/api/user/avatar/set', {
    method: 'POST',
    body: formData
  })
  return result
}

const uploadAppPackage = async (packageJSON, blob, publish, collect) => {
  const formData = new FormData()
  formData.append('file', blob)
  formData.append('npmPackage', JSON.stringify(packageJSON))
  formData.append('publish', publish)
  formData.append('collect', collect)

  const fetchResult = await fetchRidgeCloudAPI('/api/app/storage/put', {
    method: 'POST',
    body: formData
  })

  if (fetchResult.code === '100401') {
    return '请登录后再保存'
  } else {
    if (fetchResult.data.error) {
      return fetchResult.data.error
    }
    if (publish && fetchResult.data.publishQueue) {
      if (fetchResult.data.publishQueue.onwerShip === false) {
        return '同名应用已经发布，请更改应用名'
      }
    }
  }
  return '1'
}

const removeApp = async appName => {
  return fetchRidgeCloudAPI('/api/app/storage/delete', {
    method: 'POST',
    body: {
      app: appName
    }
  })
}

const downloadAppPackage = async appName => {
  return fetchRidgeCloudAPI('/api/app/storage/download/' + appName, {
    download: true
  })
}

export {
  selectFile,
  showError,
  showMessage,
  showWarning,
  showAlert,
  showConfirm,
  fullscreenLoading,
  fetchRidgeCloudAPI,
  getUserStatus,
  getStoreStatus,
  getCapchaUrl,
  logout,
  login,
  register,
  deleteApp,
  setAvatar,
  uploadAppPackage,
  removeApp,
  downloadAppPackage
}
