import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import { weatherService } from '@/services'
import { SkeletonLoader } from '@/components/atoms/LoadingSpinner'

const WeatherWidget = ({ className = '' }) => {
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadWeatherData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const [currentWeather, forecastData] = await Promise.all([
          weatherService.getCurrent(),
          weatherService.getForecast(3)
        ])
        
        setWeather(currentWeather)
        setForecast(forecastData)
      } catch (err) {
        setError(err.message || 'Failed to load weather data')
      } finally {
        setLoading(false)
      }
    }

    loadWeatherData()
  }, [])

  const getWeatherIcon = (condition) => {
    const icons = {
      'Sunny': 'Sun',
      'Partly Cloudy': 'CloudSun',
      'Cloudy': 'Cloud',
      'Light Rain': 'CloudRain',
      'Rain': 'CloudRain',
      'Heavy Rain': 'CloudRain'
    }
    return icons[condition] || 'Cloud'
  }

  const getGardenImpact = (weather) => {
    if (!weather) return null

    const { temperature, condition, rainfall, humidity } = weather
    const temp = temperature.current

    if (temp > 85) {
      return {
        type: 'warning',
        message: 'High heat - increase watering frequency',
        icon: 'Thermometer'
      }
    }

    if (rainfall > 0.5) {
      return {
        type: 'info',
        message: 'Recent rain - reduce watering schedule',
        icon: 'CloudRain'
      }
    }

    if (humidity < 40) {
      return {
        type: 'warning',
        message: 'Low humidity - mist sensitive plants',
        icon: 'Droplets'
      }
    }

    if (temp < 50) {
      return {
        type: 'error',
        message: 'Cold weather - protect tender plants',
        icon: 'Snowflake'
      }
    }

    return {
      type: 'success',
      message: 'Great conditions for gardening!',
      icon: 'Leaf'
    }
  }

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-soft p-4 ${className}`}>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-white rounded-xl shadow-soft p-4 ${className}`}>
        <div className="text-center py-4">
          <ApperIcon name="CloudOff" className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Unable to load weather</p>
        </div>
      </div>
    )
  }

  const impact = getGardenImpact(weather)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-soft p-4 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center">
          <ApperIcon name="CloudSun" className="w-5 h-5 mr-2 text-primary" />
          Weather
        </h3>
        <span className="text-xs text-gray-500">
          {new Date().toLocaleDateString()}
        </span>
      </div>

      {/* Current Weather */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-surface rounded-lg">
            <ApperIcon 
              name={getWeatherIcon(weather.condition)} 
              className="w-8 h-8 text-warning" 
            />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {weather.temperature.current}°F
            </div>
            <div className="text-sm text-gray-500">
              {weather.condition}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm text-gray-600">
            H: {weather.temperature.high}° L: {weather.temperature.low}°
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Humidity: {weather.humidity}%
          </div>
        </div>
      </div>

      {/* Garden Impact Alert */}
      {impact && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-3 rounded-lg mb-4 ${
            impact.type === 'warning' ? 'bg-warning/10 text-warning' :
            impact.type === 'error' ? 'bg-error/10 text-error' :
            impact.type === 'info' ? 'bg-info/10 text-info' :
            'bg-success/10 text-success'
          }`}
        >
          <div className="flex items-center space-x-2">
            <ApperIcon name={impact.icon} className="w-4 h-4" />
            <span className="text-sm font-medium">{impact.message}</span>
          </div>
        </motion.div>
      )}

      {/* 3-Day Forecast */}
      <div className="border-t border-gray-100 pt-3">
        <h4 className="text-xs font-medium text-gray-700 mb-2">3-Day Forecast</h4>
        <div className="grid grid-cols-3 gap-2">
          {forecast.map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-xs text-gray-500 mb-1">
                {index === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
              </div>
              <ApperIcon 
                name={getWeatherIcon(day.condition)} 
                className="w-5 h-5 mx-auto mb-1 text-warning" 
              />
              <div className="text-xs">
                <span className="font-medium">{day.temperature.high}°</span>
                <span className="text-gray-500 ml-1">{day.temperature.low}°</span>
              </div>
              {day.rainfall > 0 && (
                <div className="text-xs text-info mt-1">
                  {day.rainfall}"
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default WeatherWidget