import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import LoadingSpinner from '@/components/atoms/LoadingSpinner'
import { locationService } from '@/services'
import { toast } from 'react-toastify'

const Location = () => {
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [gettingLocation, setGettingLocation] = useState(false)
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    latitude: '',
    longitude: '',
    timezone: '',
    gardenSize: '',
    gardenType: ''
  })

  useEffect(() => {
    loadLocation()
  }, [])

  const loadLocation = async () => {
    try {
      setLoading(true)
      const data = await locationService.getLocation()
      setLocation(data)
      setFormData(data)
    } catch (error) {
      toast.error('Failed to load location data')
    } finally {
      setLoading(false)
    }
  }

  const handleGetCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser')
      return
    }

    setGettingLocation(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const locationData = await locationService.reverseGeocode(latitude, longitude)
          
          setFormData(prev => ({
            ...prev,
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            address: locationData.address || '',
            city: locationData.city || '',
            state: locationData.state || '',
            zipCode: locationData.zipCode || '',
            country: locationData.country || '',
            timezone: locationData.timezone || ''
          }))
          
          toast.success('Location detected successfully!')
        } catch (error) {
          toast.error('Failed to get location details')
        } finally {
          setGettingLocation(false)
        }
      },
      (error) => {
        setGettingLocation(false)
        toast.error('Failed to get your location')
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      await locationService.saveLocation(formData)
      setLocation(formData)
      toast.success('Location saved successfully!')
    } catch (error) {
      toast.error('Failed to save location')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-soft p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <ApperIcon name="MapPin" className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-gray-900">
                Garden Location
              </h1>
              <p className="text-gray-500">Manage your garden's location settings</p>
            </div>
          </div>
          <Button
            variant="outline"
            icon="Navigation"
            onClick={handleGetCurrentLocation}
            loading={gettingLocation}
          >
            Get Current Location
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Location Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-soft p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Location Details</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Input
                label="Street Address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="123 Garden Street"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Garden City"
                />
                <Input
                  label="State/Province"
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  placeholder="CA"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="ZIP/Postal Code"
                  value={formData.zipCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                  placeholder="12345"
                />
                <Input
                  label="Country"
                  value={formData.country}
                  onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                  placeholder="United States"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Latitude"
                  value={formData.latitude}
                  onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                  placeholder="37.7749"
                  type="number"
                  step="any"
                />
                <Input
                  label="Longitude"
                  value={formData.longitude}
                  onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                  placeholder="-122.4194"
                  type="number"
                  step="any"
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-md font-semibold text-gray-900 mb-4">Garden Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Garden Size
                  </label>
                  <select
                    value={formData.gardenSize}
                    onChange={(e) => setFormData(prev => ({ ...prev, gardenSize: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select garden size</option>
                    <option value="small">Small (under 100 sq ft)</option>
                    <option value="medium">Medium (100-500 sq ft)</option>
                    <option value="large">Large (500-1000 sq ft)</option>
                    <option value="xlarge">Very Large (1000+ sq ft)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Garden Type
                  </label>
                  <select
                    value={formData.gardenType}
                    onChange={(e) => setFormData(prev => ({ ...prev, gardenType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select garden type</option>
                    <option value="vegetable">Vegetable Garden</option>
                    <option value="flower">Flower Garden</option>
                    <option value="herb">Herb Garden</option>
                    <option value="mixed">Mixed Garden</option>
                    <option value="container">Container Garden</option>
                    <option value="greenhouse">Greenhouse</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                loading={saving}
                icon="Save"
              >
                Save Location
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Location Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* Current Location */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Location</h3>
            {location?.city ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="MapPin" className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {location.city}, {location.state}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Globe" className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {location.latitude?.slice(0, 8)}, {location.longitude?.slice(0, 9)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No location set</p>
            )}
          </div>

          {/* Location Benefits */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Benefits</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <ApperIcon name="Sun" className="w-5 h-5 text-warning mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Weather Data</p>
                  <p className="text-xs text-gray-500">Get accurate local weather information</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <ApperIcon name="Calendar" className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Planting Calendar</p>
                  <p className="text-xs text-gray-500">Receive location-specific planting advice</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <ApperIcon name="Bug" className="w-5 h-5 text-error mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Pest Alerts</p>
                  <p className="text-xs text-gray-500">Get notified about local pest activity</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Location