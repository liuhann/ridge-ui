const ridgeHostUrl = window.RIDGE_HOST ?? ''
// 根据名称获取符合条件的地区列表
const searchAndFindParent = (data, searchTerm) => {
  const result = []
  // 先找出符合搜索条件的项目
  const matchedItems = data.filter(item => item.fullname.includes(searchTerm)).splice(0, 6)
  for (const item of matchedItems) {
    const currentResult = {
      ...item,
      parents: []
    }
    // 递归查找所有父级节点
    findAllParents(data, item.pid, currentResult.parents)
    result.push(currentResult)
  }
  return result
}

const findAllParents = (data, pid, parents) => {
  const parent = data.find(parentItem => parentItem.code === pid)
  if (parent) {
    parents.unshift(parent)
    // 继续递归查找父级的父级
    findAllParents(data, parent.pid, parents)
  }
}


// 根据经纬度获取天气信息
const getWeather = async (latitude, longitude) => {
  // 修正后的 API 请求地址，去除了错误的参数
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,precipitation,weathercode,windspeed_10m,winddirection_10m&daily=temperature_2m_max,temperature_2m_min,weathercode,windspeed_10m_max,winddirection_10m_dominant&timezone=auto&forecast_days=6`
  try {
    const response = await fetch(url)
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error('获取天气信息时出错:', error)
  }
  return null
}

// 根据角度，获取风向
const getWindDirectionDescription = (angle) => {
    const directions = ['北', '东北', '东', '东南', '南', '西南', '西', '西北']
    const index = Math.round((angle % 360) / 45)
    return directions[index % 8]
}

// 根据风速获取风级
const getWindForceLevel = (speed) => {
  const windLevels = [
    { min: 0, max: 0.2, level: 0 },
    { min: 0.3, max: 1.5, level: 1 },
    { min: 1.6, max: 3.3, level: 2 },
    { min: 3.4, max: 5.4, level: 3 },
    { min: 5.5, max: 7.9, level: 4 },
    { min: 8.0, max: 10.7, level: 5 },
    { min: 10.8, max: 13.8, level: 6 },
    { min: 13.9, max: 17.1, level: 7 },
    { min: 17.2, max: 20.7, level: 8 },
    { min: 20.8, max: 24.4, level: 9 },
    { min: 24.5, max: 28.4, level: 10 },
    { min: 28.5, max: 32.6, level: 11 },
    { min: 32.7, max: Infinity, level: 12 }
  ]
  for (let i = 0; i < windLevels.length; i++) {
    const level = windLevels[i]
    if (speed >= level.min && speed <= level.max) {
      return level.level
    }
  }
  return null
}

const weatherCodeMap = {
  0: 'Clear',
  1: 'Clear',
  2: 'Broken Clouds',
  3: 'Cloudy',
  45: 'Fog',
  48: 'Fog',
  51: 'Light Drizzle',
  53: 'Drizzle',
  55: 'Heavy Drizzle',
  56: 'Sleet',
  57: 'Sleet',
  61: 'Light Snow',
  63: 'Snow',
  65: 'Heavy Snow',
  66: 'Sleet',
  67: 'Sleet',
  71: 'Light Snow',
  73: 'Snow',
  75: 'Heavy Snow',
  77: 'Hail',
  80: 'Light Rain Showers',
  81: 'Rain Showers',
  82: 'Heavy Rain Showers',
  85: 'Light Snow Showers',
  86: 'Heavy Snow Showers',
  95: 'Thunder Storm',
  96: 'Thunder Storm Light Rain',
  99: 'Thunder Storm Heavy Rain'
}

// 格式化日期为 YYYY-MM-DD 格式
function formatDate (date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
// 格式化周几为中文
function formatWeekday (date) {
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return weekDays[date.getDay()]
}


const convertWeatherData = weatherData => {
   const result = {
    fetchedTime: weatherData.current_weather.time,
    currentWeather: {
      temperature: Math.floor(weatherData.current_weather.temperature) + '℃', // 温度
      humidity: weatherData.hourly.relativehumidity_2m[0] + '%',  // 湿度
      windDirection: getWindDirectionDescription(weatherData.current_weather.winddirection), 
      windSpeed: weatherData.current_weather.windspeed,
      windForce: getWindForceLevel(weatherData.current_weather.windspeed) + '级',
      weather: weatherCodeMap[weatherData.current_weather.weathercode] || '未知天气'
    },
    next10Hours: [],
    next5Days: []
  }

  // 获取当前小时在 hourly 数据中的索引
  const currentTime = new Date(weatherData.current_weather.time)
  const hourlyTimeIndex = weatherData.hourly.time.findIndex(time => {
    return new Date(time).getHours() === currentTime.getHours()
  })

  // 提取未来10小时数据
  for (let i = 0; i < 10 && i + hourlyTimeIndex < weatherData.hourly.time.length; i++) {
    const hourIndex = i + hourlyTimeIndex
    const hourTime = new Date(weatherData.hourly.time[hourIndex])
    
    result.next10Hours.push({
      hour: hourTime.getHours() + '点', // 格式化为 "HH点"
      temperature: Math.floor(weatherData.hourly.temperature_2m[hourIndex]) + '℃',
      weather: weatherCodeMap[weatherData.hourly.weathercode[hourIndex]] || '未知天气'
    })
  }
  
  const dailyData = weatherData.daily
  for (let i = 0; i < dailyData.time.length; i++) {
    if (i === 0) {
      result.currentWeather.maxTemp = Math.floor(dailyData.temperature_2m_max[i])
      result.currentWeather.minTemp = Math.floor(dailyData.temperature_2m_min[i])
      continue
    }
    result.next5Days.push({
      date: dailyData.time[i],
      minTemperature: Math.floor(dailyData.temperature_2m_min[i]),
      maxTemperature: Math.floor(dailyData.temperature_2m_max[i]),
      weather: weatherCodeMap[dailyData.weathercode[i]] || '未知天气'
    })
  }
  return result
}

export default {
  name: 'WeatherForcast',
  externals: ['/china-regions-lat/lib/lats.js'],
  state : () => {
    return {
      picsumFullScreen: `${ridgeHostUrl}/npm/ridge-app-weather/day.gif`,
      currentRegionName: '北京市', // 当前位置名称
      currentRegionPos: [116.405285,39.904989], // 当前位置坐标
      weatherData: { // 天气数据
        fetchedTime: '', // 当前天气数据时间
        currentWeather: { // 现在天气
          maxTemp: "--", // 最高温度
          minTemp: "--", // 最低温度
          temperature: '--', // 温度
          humidity: '--', // 湿度
          windDirection: '-',  // 风向
          windSpeed: '-',
          windForce: '-',   // 风力
          weather: '--' // 天气
        },
        next10Hours: [], // 未来10个小时
        next5Days: [] // 未来5天
      },
      weekDays: { // 日期信息
        formattedDate: formatDate(new Date()), // 今天日期
        weekDay: formatWeekday(new Date()) // 今天星期
      },
      showEditLocation: false, // 显示对话框
      filterResult: [] // 条件过滤结果
    }
  },

  computed: {
    filteredReginFullName (scope) { // 过滤列表-列表项-区域名称
      return scope.item.parents.length ? (scope.item.parents.map(p => p.fullname).join(',') + ',' + scope.item.fullname) : scope.item.fullname
    },
    nextItemWeather (scope) { // 未来几天-单项-天气
      return scope.item.weather
    },
    nextItemTemp (scope) { // 未来几天-单项-最高温度
      return scope.item.maxTemperature + '℃'
    },
    nextItemTempMin (scope) { // 未来几天-单项-最低温度
      return scope.item.minTemperature + '℃'
    },
    nextItemWeekday (scope) { // 未来几天-单项-星期
      return formatWeekday(new Date(scope.item.date))
    },
    nextItemDate(scope) {  // 未来几天-单项-日期
      return formatDate(new Date(scope.item.date))
    },
    itemWeather : scope => scope.item.weather,  // 单项-计算天气值
    itemTemp : scope => scope.item.temperature,  // 单项-计算温度值
    itemHour : scope => scope.item.hour,  // 单项-计算小时值
  },

  setup() {
    this.fetchWeather()
  },

  actions: {
    async fetchWeather () {
      this.currentRegionName = localStorage.getItem('currentRegionName') || '北京市'
      this.currentRegionPos = JSON.parse(localStorage.getItem('currentRegionPos') || '[116.405285,39.904989]')
      const result = await getWeather(this.currentRegionPos[1], this.currentRegionPos[0])
      this.weatherData = convertWeatherData(result)
      console.log(this.weatherData)
      this.picsumFullScreen = result.current_weather.is_day === 1 ? `${ridgeHostUrl}/npm/ridge-app-weather/day.gif`: `${ridgeHostUrl}/npm/ridge-app-weather/night.gif`
    },

    toggleEdit () {
      this.showEditLocation = true
    },

    async filterPosition (val) {
      this.currentRegionName = val
      this.filterResult = searchAndFindParent(CHINA_REGIONS_LAT, this.currentRegionName)
    },

    confirmRegion(scope) { // 区域确认
      this.currentRegionName = scope.item.fullname
      localStorage.setItem('currentRegionName', scope.item.fullname)
      this.currentRegionPos = scope.item.center
      localStorage.setItem('currentRegionPos', JSON.stringify(scope.item.center))
      this.showEditLocation = false
      this.fetchWeather()
    }
  }
}
