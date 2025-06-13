import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import { plantService, gardenBedService } from '@/services'
import { toast } from 'react-toastify'

const AddPlant = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  
  const [step, setStep] = useState(1) // 1: Photo, 2: Identification, 3: Details
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [identifying, setIdentifying] = useState(false)
  const [identificationResult, setIdentificationResult] = useState(null)
  const [gardenBeds, setGardenBeds] = useState([])
  const [loading, setLoading] = useState(false)
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    scientificName: '',
    type: '',
    gardenBedId: '',
    careRequirements: {},
    healthStatus: {
      water: 80,
      sunlight: 85,
      nutrients: 75
    }
  })

  // Load garden beds when component mounts
  useState(() => {
    const loadGardenBeds = async () => {
      try {
        const beds = await gardenBedService.getAll()
        setGardenBeds(beds)
      } catch (err) {
        console.error('Failed to load garden beds:', err)
      }
    }
    loadGardenBeds()
  }, [])

  const handlePhotoCapture = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPhoto(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoPreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePhotoClick = () => {
    fileInputRef.current?.click()
  }

  const handleIdentifyPlant = async () => {
    if (!photo) return

    setIdentifying(true)
    try {
      const result = await plantService.identifyFromPhoto(photo)
      setIdentificationResult(result)
      
      // Pre-fill form with identification results
      setFormData(prev => ({
        ...prev,
        name: result.name,
        scientificName: result.scientificName,
        type: result.type,
        careRequirements: result.careRequirements
      }))
      
      setStep(3) // Skip to details step
    } catch (err) {
      toast.error('Failed to identify plant. Please try again.')
    } finally {
      setIdentifying(false)
    }
  }

  const handleManualEntry = () => {
    setStep(3) // Go to manual entry
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.gardenBedId) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      // Create plant with photo URL (in a real app, you'd upload the photo)
      const plantData = {
        ...formData,
        photoUrl: photoPreview || `https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=300&fit=crop&crop=center`
      }
      
      await plantService.create(plantData)
      toast.success('Plant added successfully!')
      navigate('/my-garden')
    } catch (err) {
      toast.error('Failed to add plant. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="max-w-full overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            icon="ArrowLeft"
            onClick={() => navigate('/my-garden')}
          >
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">Add New Plant</h1>
            <p className="text-gray-500 mt-1">
              {step === 1 && "Take a photo or upload an image"}
              {step === 2 && "AI is identifying your plant"}
              {step === 3 && "Complete plant details"}
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mt-4 flex items-center justify-center space-x-2">
          {[1, 2, 3].map(stepNumber => (
            <div key={stepNumber} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${step >= stepNumber 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-200 text-gray-500'
                }
              `}>
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={`w-8 h-0.5 mx-2 ${step > stepNumber ? 'bg-primary' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {/* Step 1: Photo Capture */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-xl font-display font-semibold text-gray-900 mb-2">
                  Capture Your Plant
                </h2>
                <p className="text-gray-600 mb-6">
                  Take a clear photo of your plant for AI identification
                </p>
              </div>

              {/* Photo Area */}
              <div
                onClick={handlePhotoClick}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all duration-200"
              >
                {photoPreview ? (
                  <div className="space-y-4">
                    <img
                      src={photoPreview}
                      alt="Plant preview"
                      className="max-h-64 mx-auto rounded-lg shadow-md"
                    />
                    <Button variant="outline" icon="Camera">
                      Take Another Photo
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto">
                      <ApperIcon name="Camera" className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900 mb-1">Take a Photo</p>
                      <p className="text-sm text-gray-500">
                        Tap to open camera or select from gallery
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoCapture}
                className="hidden"
              />

              {/* Action Buttons */}
              <div className="flex flex-col space-y-3">
                {photoPreview && (
                  <Button
                    onClick={() => setStep(2)}
                    icon="Sparkles"
                    className="w-full"
                  >
                    Identify with AI
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={handleManualEntry}
                  className="w-full"
                >
                  Enter Details Manually
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: AI Identification */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 text-center"
            >
              <div className="space-y-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto"
                >
                  <ApperIcon name="Sparkles" className="w-8 h-8 text-primary" />
                </motion.div>
                
                <div>
                  <h2 className="text-xl font-display font-semibold text-gray-900 mb-2">
                    AI is Analyzing Your Plant
                  </h2>
                  <p className="text-gray-600">
                    Our AI is identifying your plant and gathering care information...
                  </p>
                </div>
              </div>

              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="Plant being identified"
                  className="max-h-48 mx-auto rounded-lg shadow-md"
                />
              )}

              <Button
                loading={true}
                disabled={true}
                className="w-full"
              >
                Analyzing Plant...
              </Button>

              {/* Auto-identify after component mounts */}
              {useState(() => {
                handleIdentifyPlant()
              }, [])}
            </motion.div>
          )}

          {/* Step 3: Plant Details Form */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* AI Identification Results */}
                {identificationResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-success/5 border border-success/20 rounded-lg p-4 mb-6"
                  >
                    <div className="flex items-center space-x-2 mb-3">
                      <ApperIcon name="CheckCircle" className="w-5 h-5 text-success" />
                      <span className="font-medium text-success">Plant Identified!</span>
                      <span className="text-sm text-gray-500">
                        {Math.round(identificationResult.confidence * 100)}% confidence
                      </span>
                    </div>
                    <div className="text-sm text-gray-700">
                      <p><strong>Name:</strong> {identificationResult.name}</p>
                      <p><strong>Scientific Name:</strong> {identificationResult.scientificName}</p>
                      <p><strong>Type:</strong> {identificationResult.type}</p>
                    </div>
                  </motion.div>
                )}

                <div className="text-center mb-6">
                  <h2 className="text-xl font-display font-semibold text-gray-900 mb-2">
                    Plant Details
                  </h2>
                  <p className="text-gray-600">
                    Review and complete the information for your plant
                  </p>
                </div>

                {/* Basic Information */}
                <div className="space-y-4">
                  <Input
                    label="Plant Name"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    placeholder="e.g., Cherry Tomato"
                    required
                  />

                  <Input
                    label="Scientific Name"
                    value={formData.scientificName}
                    onChange={(e) => updateFormData('scientificName', e.target.value)}
                    placeholder="e.g., Solanum lycopersicum"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plant Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => updateFormData('type', e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    >
                      <option value="">Select type...</option>
                      <option value="Vegetable">Vegetable</option>
                      <option value="Flower">Flower</option>
                      <option value="Herb">Herb</option>
                      <option value="Tree">Tree</option>
                      <option value="Shrub">Shrub</option>
                      <option value="Succulent">Succulent</option>
                      <option value="Houseplant">Houseplant</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Garden Bed *
                    </label>
                    <select
                      value={formData.gardenBedId}
                      onChange={(e) => updateFormData('gardenBedId', e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    >
                      <option value="">Select garden bed...</option>
                      {gardenBeds.map(bed => (
                        <option key={bed.id} value={bed.id}>
                          {bed.name} - {bed.location}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-3 pt-6">
                  <Button
                    type="submit"
                    loading={loading}
                    className="w-full"
                  >
                    Add Plant to Garden
                  </Button>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => navigate('/my-garden')}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default AddPlant