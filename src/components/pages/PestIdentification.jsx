import { useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import { SkeletonLoader } from '@/components/atoms/LoadingSpinner'
import pestIdentificationService from '@/services/api/pestIdentificationService'
import { plantService } from '@/services'
import { toast } from 'react-toastify'

const PestIdentification = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const plantId = searchParams.get('plantId')
  
  const [step, setStep] = useState('capture') // capture, analyzing, results
  const [photoData, setPhotoData] = useState(null)
  const [identificationResult, setIdentificationResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const fileInputRef = useRef(null)

  const handlePhotoCapture = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Photo size must be less than 10MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setPhotoData(event.target.result)
    }
    reader.readAsDataURL(file)
  }

  const handlePhotoClick = () => {
    fileInputRef.current?.click()
  }

  const handleAnalyzePhoto = async () => {
    if (!photoData) {
      toast.error('Please capture a photo first')
      return
    }

    setLoading(true)
    setError(null)
    setStep('analyzing')

    try {
      let plantType = null
      if (plantId) {
        try {
          const plant = await plantService.getById(plantId)
          plantType = plant.type
        } catch (err) {
          // Continue without plant context
        }
      }

      const result = await pestIdentificationService.identifyPestFromPhoto(photoData, plantType)
      setIdentificationResult(result)
      setStep('results')
    } catch (err) {
      setError(err.message || 'Failed to analyze photo')
      toast.error('Failed to analyze photo')
      setStep('capture')
    } finally {
      setLoading(false)
    }
  }

  const handleRetake = () => {
    setPhotoData(null)
    setIdentificationResult(null)
    setStep('capture')
    setError(null)
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-error bg-error/10 border-error/20'
      case 'moderate': return 'text-warning bg-warning/10 border-warning/20'
      case 'low': return 'text-success bg-success/10 border-success/20'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getTypeIcon = (type) => {
    return type === 'pest' ? 'Bug' : 'AlertTriangle'
  }

  return (
    <div className="max-w-full overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
        <div className="flex items-center space-x-3 mb-4">
          <Button
            variant="ghost"
            icon="ArrowLeft"
            onClick={() => navigate(plantId ? `/plant/${plantId}` : '/dashboard')}
          >
            Back
          </Button>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-2 bg-error/10 rounded-lg">
            <ApperIcon name="Bug" className="w-6 h-6 text-error" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">
              Pest & Disease Identification
            </h1>
            <p className="text-gray-500">
              Take a photo to identify pests or diseases affecting your plants
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Photo Capture Step */}
            {step === 'capture' && (
              <motion.div
                key="capture"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Photo Capture Area */}
                <div className="bg-white rounded-xl shadow-soft p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Capture Photo
                  </h2>
                  
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                    onClick={handlePhotoClick}
                  >
                    {photoData ? (
                      <div className="space-y-4">
                        <img 
                          src={photoData} 
                          alt="Captured plant" 
                          className="w-full h-64 object-cover rounded-lg mx-auto"
                        />
                        <p className="text-sm text-gray-600">Click to retake photo</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                          <ApperIcon name="Camera" className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-lg font-medium text-gray-900">Take a Photo</p>
                          <p className="text-sm text-gray-500">
                            Capture a clear photo of the affected plant parts
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
                </div>

                {/* Tips */}
                <div className="bg-info/5 border border-info/20 rounded-lg p-4">
                  <h3 className="font-medium text-info mb-2 flex items-center">
                    <ApperIcon name="Lightbulb" className="w-4 h-4 mr-2" />
                    Photography Tips
                  </h3>
                  <ul className="text-sm text-info space-y-1">
                    <li>• Focus on affected leaves or plant parts</li>
                    <li>• Ensure good lighting for clear details</li>
                    <li>• Include healthy parts for comparison</li>
                    <li>• Take multiple angles if symptoms vary</li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button
                    variant="primary"
                    icon="Search"
                    onClick={handleAnalyzePhoto}
                    disabled={!photoData}
                    className="flex-1"
                  >
                    Analyze Photo
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Analyzing Step */}
            {step === 'analyzing' && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl shadow-soft p-8 text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="Search" className="w-8 h-8 text-primary animate-pulse" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Analyzing Photo...
                </h2>
                <p className="text-gray-500 mb-6">
                  Our AI is examining your photo for pests and diseases
                </p>
                <SkeletonLoader count={3} />
              </motion.div>
            )}

            {/* Results Step */}
            {step === 'results' && identificationResult && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Identification Results */}
                <div className="bg-white rounded-xl shadow-soft p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Identification Results
                    </h2>
                    <span className="text-sm text-gray-500">
                      {Math.round(identificationResult.confidence * 100)}% confidence
                    </span>
                  </div>

                  <div className="flex items-start space-x-4 mb-6">
                    <div className="p-3 bg-error/10 rounded-lg">
                      <ApperIcon 
                        name={getTypeIcon(identificationResult.type)} 
                        className="w-8 h-8 text-error" 
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {identificationResult.name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(identificationResult.severity)}`}>
                          {identificationResult.severity} severity
                        </span>
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                          {identificationResult.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Detected Symptoms */}
                  {identificationResult.matchedSymptoms && (
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-2">Detected Symptoms</h4>
                      <div className="space-y-2">
                        {identificationResult.matchedSymptoms.map((symptom, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                            <ApperIcon name="Check" className="w-4 h-4 text-success" />
                            <span>{symptom}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Treatment Recommendations */}
                <div className="bg-white rounded-xl shadow-soft p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Treatment Recommendations
                  </h3>
                  
                  <div className="space-y-3">
                    {identificationResult.treatments.map((treatment, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-success/5 rounded-lg">
                        <div className="p-1 bg-success/10 rounded-full mt-0.5">
                          <ApperIcon name="Check" className="w-3 h-3 text-success" />
                        </div>
                        <p className="text-sm text-gray-700">{treatment}</p>
                      </div>
                    ))}
                  </div>

                  {/* Prevention Tips */}
                  {identificationResult.prevention && (
                    <div className="mt-6 p-4 bg-info/5 border border-info/20 rounded-lg">
                      <h4 className="font-medium text-info mb-2 flex items-center">
                        <ApperIcon name="Shield" className="w-4 h-4 mr-2" />
                        Prevention
                      </h4>
                      <p className="text-sm text-info">{identificationResult.prevention}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    icon="Camera"
                    onClick={handleRetake}
                    className="flex-1"
                  >
                    Analyze Another Photo
                  </Button>
                  <Button
                    variant="primary"
                    icon="ArrowLeft"
                    onClick={() => navigate(plantId ? `/plant/${plantId}` : '/dashboard')}
                    className="flex-1"
                  >
                    Done
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default PestIdentification