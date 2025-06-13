// Mock data for location
const mockLocation = {
  id: 1,
  address: '123 Garden Street',
  city: 'San Francisco',
  state: 'CA',
  zipCode: '94107',
  country: 'United States',
  latitude: '37.7749',
  longitude: '-122.4194',
  timezone: 'America/Los_Angeles',
  gardenSize: 'medium',
  gardenType: 'mixed',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-20T14:22:00Z'
}

// Simulate API delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const locationService = {
  async getLocation() {
    await delay(300)
    return { ...mockLocation }
  },

  async saveLocation(locationData) {
    await delay(500)
    // In a real app, this would send data to the server
    Object.assign(mockLocation, locationData, { updatedAt: new Date().toISOString() })
    return { ...mockLocation }
  },

  async getCurrentLocation() {
    await delay(200)
    // This would typically use navigator.geolocation in the component
    return {
      latitude: 37.7749,
      longitude: -122.4194,
      accuracy: 10
    }
  },

  async reverseGeocode(latitude, longitude) {
    await delay(800)
    // In a real app, this would call a geocoding API
    return {
      address: '123 Garden Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94107',
      country: 'United States',
      timezone: 'America/Los_Angeles'
    }
  },

  async getWeatherByLocation(latitude, longitude) {
    await delay(400)
    // Mock weather data based on location
    return {
      temperature: 72,
      condition: 'sunny',
      humidity: 65,
      windSpeed: 8,
      forecast: [
        { day: 'Today', high: 75, low: 62, condition: 'sunny' },
        { day: 'Tomorrow', high: 73, low: 60, condition: 'partly-cloudy' },
        { day: 'Wednesday', high: 70, low: 58, condition: 'cloudy' }
      ]
    }
  },

  async searchLocations(query) {
    await delay(300)
    // Mock location search results
    return [
      {
        address: '123 Garden Street, San Francisco, CA 94107',
        latitude: 37.7749,
        longitude: -122.4194
      },
      {
        address: '456 Plant Avenue, San Francisco, CA 94108',
        latitude: 37.7849,
        longitude: -122.4094
      }
    ]
  }
}