import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import { plantService } from '@/services'

const GardenBedCard = ({ gardenBed, onClick }) => {
  const [plants, setPlants] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const loadPlants = async () => {
      try {
        const bedPlants = await plantService.getByGardenBed(gardenBed.id)
        setPlants(bedPlants)
      } catch (err) {
        console.error('Failed to load plants:', err)
      } finally {
        setLoading(false)
      }
    }

    loadPlants()
  }, [gardenBed.id])

  const getSunIcon = (exposure) => {
    const icons = {
      'Full Sun': 'Sun',
      'Partial Shade': 'CloudSun',
      'Shade': 'Cloud'
    }
    return icons[exposure] || 'Sun'
  }

  const getSunColor = (exposure) => {
    const colors = {
      'Full Sun': 'text-warning',
      'Partial Shade': 'text-info',
      'Shade': 'text-gray-500'
    }
    return colors[exposure] || 'text-warning'
  }

  const handleClick = () => {
    if (onClick) {
      onClick(gardenBed)
    } else {
      navigate('/my-garden', { state: { selectedBed: gardenBed.id } })
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="bg-white rounded-xl shadow-soft hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="font-display font-semibold text-lg text-gray-900 truncate">
              {gardenBed.name}
            </h3>
            <p className="text-sm text-gray-500 truncate">
              {gardenBed.location}
            </p>
          </div>
          
          <div className="flex items-center space-x-2 flex-shrink-0 ml-3">
            <div className={`p-1 rounded ${getSunColor(gardenBed.sunExposure)}`}>
              <ApperIcon name={getSunIcon(gardenBed.sunExposure)} className="w-4 h-4" />
            </div>
            <span className="text-xs text-gray-500">{gardenBed.area} sq ft</span>
          </div>
        </div>
      </div>

      {/* Plant Preview */}
      <div className="p-4">
        {loading ? (
          <div className="animate-pulse">
            <div className="flex space-x-2 mb-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ) : (
          <>
            {plants.length > 0 ? (
              <>
                <div className="flex -space-x-2 mb-3">
                  {plants.slice(0, 4).map((plant, index) => (
                    <div
                      key={plant.id}
                      className="w-12 h-12 rounded-lg border-2 border-white overflow-hidden bg-gray-100"
                      style={{ zIndex: plants.length - index }}
                    >
                      <img
                        src={plant.photoUrl}
                        alt={plant.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = `https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=100&h=100&fit=crop&crop=center`
                        }}
                      />
                    </div>
                  ))}
                  {plants.length > 4 && (
                    <div className="w-12 h-12 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        +{plants.length - 4}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {plants.length} plant{plants.length !== 1 ? 's' : ''}
                  </span>
                  
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-xs text-gray-500">Healthy</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <ApperIcon name="Sprout" className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No plants yet</p>
                <p className="text-xs text-gray-400 mt-1">Tap to add plants</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Soil Info */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <ApperIcon name="Mountain" className="w-3 h-3" />
            <span>{gardenBed.soilType}</span>
          </div>
          <div className="flex items-center space-x-1">
            <ApperIcon name={getSunIcon(gardenBed.sunExposure)} className="w-3 h-3" />
            <span>{gardenBed.sunExposure}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default GardenBedCard