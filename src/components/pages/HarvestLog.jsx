import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import Webcam from 'react-webcam'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import { plantService, harvestService } from '@/services'
import { toast } from 'react-toastify'

const HarvestLog = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const plantId = id || searchParams.get('plantId')
  
  const [plant, setPlant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [photos, setPhotos] = useState([])
  
  const webcamRef = useRef(null)
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    yieldAmount: '',
    yieldUnit: 'lbs',
    qualityRating: 5,
    notes: '',
    storageMethod: '',
    weatherConditions: ''
  })

  useEffect(() => {
    const loadPlantData = async () => {
      if (!plantId) {
        toast.error('No plant specified')
        navigate('/my-garden')
        return
      }

      try {
        setLoading(true)
        const plantData = await plantService.getById(plantId)
        setPlant(plantData)
      } catch (err) {
        toast.error('Failed to load plant details')
        navigate('/my-garden')
      } finally {
        setLoading(false)
      }
    }

    loadPlantData()
  }, [plantId, navigate])

  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot()
    if (imageSrc) {
      setPhotos(prev => [...prev, imageSrc])
      setShowCamera(false)
      toast.success('Photo captured!')
    }
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setPhotos(prev => [...prev, event.target.result])
        toast.success('Photo added!')
      }
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.yieldAmount || formData.yieldAmount <= 0) {
      toast.error('Please enter a valid yield amount')
      return
    }

    setSubmitting(true)
    
    try {
      const harvestData = {
        plantId,
        ...formData,
        yieldAmount: parseFloat(formData.yieldAmount),
        photos,
        harvestDate: new Date().toISOString()
      }

      await harvestService.create(harvestData)
      toast.success('Harvest logged successfully!')
      navigate(`/plant/${plantId}`)
    } catch (err) {
      toast.error('Failed to log harvest')
    } finally {
      setSubmitting(false)
    }
  }

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="max-w-full overflow-hidden p-4 md:p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!plant) {
    return (
      <div className="max-w-full overflow-hidden p-4 md:p-6">
        <div className="text-center py-12">
          <ApperIcon name="AlertTriangle" className="w-12 h-12 text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Plant not found</h3>
          <Button onClick={() => navigate('/my-garden')}>
            Back to Garden
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-full overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
        <div className="flex items-center space-x-3 mb-4">
          <Button
            variant="ghost"
            icon="ArrowLeft"
            onClick={() => navigate(`/plant/${plantId}`)}
          >
            Back to {plant.name}
          </Button>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <ApperIcon name="Apple" className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">
              Log Harvest
            </h1>
            <p className="text-gray-500">Record your harvest from {plant.name}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6">
        <div className="max-w-2xl mx-auto">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-soft p-6 space-y-6"
          >
            {/* Photos Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Harvest Photos
              </label>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={photo}
                      alt={`Harvest ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 p-1 bg-error text-white rounded-full hover:bg-error/80"
                    >
                      <ApperIcon name="X" className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  icon="Camera"
                  onClick={() => setShowCamera(true)}
                >
                  Take Photo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  icon="Upload"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload Photo
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>

            {/* Camera Modal */}
            {showCamera && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl p-6 max-w-md w-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Capture Photo</h3>
                    <Button
                      variant="ghost"
                      icon="X"
                      onClick={() => setShowCamera(false)}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      screenshotFormat="image/jpeg"
                      className="w-full rounded-lg"
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      onClick={capturePhoto}
                      icon="Camera"
                      className="flex-1"
                    >
                      Capture
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCamera(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Yield Amount */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Yield Amount"
                type="number"
                step="0.1"
                min="0"
                value={formData.yieldAmount}
                onChange={(e) => updateFormData('yieldAmount', e.target.value)}
                placeholder="0.0"
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit
                </label>
                <select
                  value={formData.yieldUnit}
                  onChange={(e) => updateFormData('yieldUnit', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="lbs">lbs</option>
                  <option value="kg">kg</option>
                  <option value="oz">oz</option>
                  <option value="pieces">pieces</option>
                  <option value="bunches">bunches</option>
                </select>
              </div>
            </div>

            {/* Quality Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Quality Rating
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => updateFormData('qualityRating', rating)}
                    className={`p-2 rounded-lg transition-colors ${
                      formData.qualityRating >= rating
                        ? 'text-warning bg-warning/10'
                        : 'text-gray-300 hover:text-warning/50'
                    }`}
                  >
                    <ApperIcon name="Star" className="w-6 h-6 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Fields */}
            <Input
              label="Storage Method"
              value={formData.storageMethod}
              onChange={(e) => updateFormData('storageMethod', e.target.value)}
              placeholder="e.g., Refrigerated, Root cellar, Dried"
            />

            <Input
              label="Weather Conditions"
              value={formData.weatherConditions}
              onChange={(e) => updateFormData('weatherConditions', e.target.value)}
              placeholder="e.g., Sunny, 75°F"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => updateFormData('notes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Additional notes about this harvest..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1"
              >
                {submitting ? 'Logging...' : 'Log Harvest'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/plant/${plantId}`)}
              >
                Cancel
              </Button>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  )
}

export default HarvestLog