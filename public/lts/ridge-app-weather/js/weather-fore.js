// 天气代码对应的含义
var weatherCodeMap = {
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
// 根据城市名称获取经纬度
async function getCoordinates (city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`
  try {
    const response = await fetch(url)
    if (response.ok) {
      const data = await response.json()
      if (data.results && data.results.length > 0) {
        return {
          latitude: data.results[0].latitude,
          longitude: data.results[0].longitude
        }
      }
    }
  } catch (error) {
    console.error('获取经纬度时出错:', error)
  }
  return null
}

// 根据经纬度获取天气信息
async function getWeather (latitude, longitude) {
  // 修正后的 API 请求地址，去除了错误的参数
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,precipitation,weathercode,windspeed_10m,winddirection_10m&daily=temperature_2m_max,temperature_2m_min,weathercode,windspeed_10m_max,winddirection_10m_dominant&timezone=auto&forecast_days=4`
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
async function getWeatherInfo (city) {
  let weatherData = null
  if (Array.isArray(city) && city.length === 2) {
    weatherData = await getWeather(city[1], city[0])
  } else {
    const coordinates = await getCoordinates(city)
    if (!coordinates) {
      return { error: '未能获取到城市的经纬度。' }
    }
    weatherData = await getWeather(coordinates.latitude, coordinates.longitude)
  }
  if (!weatherData) {
    return { error: '未能获取到天气信息。' }
  }

  function getWindDirectionDescription (angle) {
    const directions = ['北', '东北', '东', '东南', '南', '西南', '西', '西北']
    const index = Math.round((angle % 360) / 45)
    return directions[index % 8]
  }

  function getWindForceLevel (speed) {
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

  const result = {
    currentWeather: {
      temperature: weatherData.current_weather.temperature + '℃',
      humidity: weatherData.hourly.relativehumidity_2m[0] + '%',
      windDirection: getWindDirectionDescription(weatherData.current_weather.winddirection),
      windSpeed: weatherData.current_weather.windspeed,
      windForce: getWindForceLevel(weatherData.current_weather.windspeed) + '级',
      weather: weatherCodeMap[weatherData.current_weather.weathercode] || '未知天气'
    },
    next10Hours: [],
    next5Days: []
  }

  const hourlyData = weatherData.hourly
  for (let i = 0; i < Math.min(10, hourlyData.time.length); i++) {
    result.next10Hours.push({
      time: hourlyData.time[i],
      temperature: hourlyData.temperature_2m[i] + '℃',
      humidity: hourlyData.relativehumidity_2m[i],
      windDirection: getWindDirectionDescription(hourlyData.winddirection_10m[i]),
      windSpeed: hourlyData.windspeed_10m[i],
      windForce: getWindForceLevel(hourlyData.windspeed_10m[i]),
      weather: weatherCodeMap[hourlyData.weathercode[i]] || '未知天气'
    })
  }

  const dailyData = weatherData.daily
  const hourlyTime = hourlyData.time
  const hourlyHumidity = hourlyData.relativehumidity_2m
  for (let i = 0; i < dailyData.time.length; i++) {
    const currentDate = dailyData.time[i]
    const dayHumidityValues = []
    for (let j = 0; j < hourlyTime.length; j++) {
      if (hourlyTime[j].startsWith(currentDate)) {
        dayHumidityValues.push(hourlyHumidity[j])
      }
    }
    const maxHumidity = Math.max(...dayHumidityValues)
    const minHumidity = Math.min(...dayHumidityValues)

    result.next5Days.push({
      date: dailyData.time[i],
      maxTemperature: dailyData.temperature_2m_max[i]  + '℃',
      minTemperature: dailyData.temperature_2m_min[i]  + '℃',
      maxHumidity,
      minHumidity,
      windDirection: getWindDirectionDescription(dailyData.winddirection_10m_dominant[i]),
      maxWindSpeed: dailyData.windspeed_10m_max[i],
      windForce: getWindForceLevel(dailyData.windspeed_10m_max[i]),
      weather: weatherCodeMap[dailyData.weathercode[i]] || '未知天气'
    })
  }

  return result
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

function getCurrentWeekDays (next) {
  // 创建一个 Date 对象，获取当前日期和时间
  const currentDate = new Date()

  const nexts = []
  if (next) {
    // 获取当前日期后五天的星期
    for (let i = 1; i <= next; i++) {
      // 创建一个新的 Date 对象，避免修改原始的 currentDate
      const futureDate = new Date(currentDate)
      // 设置日期为当前日期加上 i 天
      futureDate.setDate(currentDate.getDate() + i)

      nexts.push({
        formattedDate: formatDate(futureDate),
        weekDay: formatWeekday(futureDate)
      })
    }
  }

  return {
    formattedDate: formatDate(currentDate),
    weekDay: formatWeekday(currentDate),
    nexts
  }
}

export default {
  name: 'WeatherForcast',
  externals: ['/china-regions-lat/lib/lats.js'],
  state: {
    currentRegionName: '', // 当前位置名称
    currentRegionPos: [], // 当前位置坐标
    filterResult: [], // 过滤结果
    weekDays: { // 日期信息
      formattedDate: '-', // 今天日期
      weekDay: '-', // 今天星期
      nexts: [] // 后几天星期
    },
    currentSwitch: 'detail',
    weatherData: { // 天气数据
      currentWeather: { // 现在天气
        temperature: 3.5, // 温度
        humidity: 25, // 湿度
        windDirection: '北',  // 风向
        windSpeed: 5.4,
        windForce: 3,   // 风力
        weather: '主要晴朗' // 天气
      },
      next10Hours: [
        {
          time: '2025-02-21T00:00',
          temperature: -2.2,
          humidity: 25,
          windDirection: '东',
          windSpeed: 5,
          windForce: 3,
          weather: '晴朗'
        }
      ],
      next5Days: [
        {
          date: '2025-02-21',
          maxTemperature: 3.7,
          minTemperature: -4.7,
          maxHumidity: 39,
          minHumidity: 15,
          windDirection: '东北',
          maxWindSpeed: 7.4,
          windForce: 4,
          weather: '多云'
        }
      ]
    },
    name: 'World' // 姓名
  },

  computed: {
    filteredReginFullName (scope) { // 过滤列表-列表项-区域名称
      return scope.item.parents.length ? (scope.item.parents.map(p => p.fullname).join(',') + ',' + scope.item.fullname) : scope.item.fullname
    },
    nextItemWeather (scope) { // 未来几天-单项-天气
      return scope.item.weather
    },
    nextItemTemp (scope) { // 未来几天-单项-温度
      return scope.item.maxTemperature
    },
    nextItemWeekday (scope) { // 未来几天-单项-星期
      return this.weekDays.nexts[scope.i].weekDay
    }
  },

  setup () {
    this.weekDays = getCurrentWeekDays(5)
    this.currentRegionName = localStorage.getItem('currentRegionName') || '北京市'
    this.currentRegionPos = JSON.parse(localStorage.getItem('currentRegionPos') || '[116.405285,39.904989]')
    this.fetchWeather()
  },

  watch: {
    currentRegionName () {
      this.filterPosition()
    }
  },
  actions: {
    async fetchWeather () {
      const result = await getWeatherInfo(this.currentRegionPos)
      this.weatherData = result
    },

    _searchAndFindParent (data, searchTerm) {
      const result = []
      // 先找出符合搜索条件的项目
      const matchedItems = data.filter(item => item.fullname.includes(searchTerm)).splice(0, 10)
      for (const item of matchedItems) {
        const currentResult = {
          ...item,
          parents: []
        }
        // 递归查找所有父级节点
        this._findAllParents(data, item.pid, currentResult.parents)
        result.push(currentResult)
      }
      return result
    },

    _findAllParents (data, pid, parents) {
      const parent = data.find(parentItem => parentItem.code === pid)
      if (parent) {
        parents.unshift(parent)
        // 继续递归查找父级的父级
        this._findAllParents(data, parent.pid, parents)
      }
    },

    toggleEdit () {
      if (this.currentSwitch === 'detail') {
        this.currentSwitch = 'edit'
      } else {
        this.currentSwitch = 'detail'
      }
    },

    confirmRegion(scope) { // 区域确认
      this.currentRegionName = scope.item.fullname
      localStorage.setItem('currentRegionName', scope.item.fullname)
      this.currentRegionPos = scope.item.center
      localStorage.setItem('currentRegionPos', JSON.stringify(scope.item.center))
      this.currentSwitch = 'detail'
      this.fetchWeather()
    },

    async filterPosition () {
      this.filterResult = this._searchAndFindParent(CHINA_REGIONS_LAT, this.currentRegionName)
    }   
  }
}
