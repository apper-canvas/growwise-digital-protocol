import weatherData from '@/services/mockData/weather.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const weatherService = {
  async getCurrent() {
    await delay(400)
    return { ...weatherData.current }
  },

  async getForecast(days = 7) {
    await delay(500)
    return weatherData.forecast.slice(0, days).map(day => ({ ...day }))
  },

  async getWeatherAlerts() {
    await delay(300)
    return [...(weatherData.alerts || [])]
  }
}

export default weatherService