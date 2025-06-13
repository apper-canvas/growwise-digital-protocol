import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const PlantCard = ({ plant, onTaskComplete, showActions = true }) => {
  const navigate = useNavigate()

  const getHealthColor = (value) => {
    if (value >= 80) return 'text-success'
    if (value >= 60) return 'text-warning'
    return 'text-error'
  }

  const getHealthBg = (value) => {
    if (value >= 80) return 'bg-success'
    if (value >= 60) return 'bg-warning'
    return 'bg-error'
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-xl shadow-soft hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={() => navigate(`/plant/${plant.id}`)}
    >
      {/* Plant Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <img
          src={plant.photoUrl}
          alt={plant.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = `https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=300&fit=crop&crop=center`
          }}
        />
        
        {/* Health rings overlay */}
        <div className="absolute top-3 right-3 flex space-x-2">
          {/* Water level */}
          <div className="relative w-8 h-8">
            <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
              <circle
                cx="16"
                cy="16"
                r="12"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="3"
                fill="none"
              />
              <circle
                cx="16"
                cy="16"
                r="12"
                stroke="#42A5F5"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${(plant.healthStatus?.water || 0) * 0.75} 75`}
                strokeLinecap="round"
              />
            </svg>
            <ApperIcon name="Droplets" className="absolute inset-0 w-4 h-4 m-auto text-info" />
          </div>

          {/* Sun level */}
          <div className="relative w-8 h-8">
            <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
              <circle
                cx="16"
                cy="16"
                r="12"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="3"
                fill="none"
              />
              <circle
                cx="16"
                cy="16"
                r="12"
                stroke="#FFA726"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${(plant.healthStatus?.sunlight || 0) * 0.75} 75`}
                strokeLinecap="round"
              />
            </svg>
            <ApperIcon name="Sun" className="absolute inset-0 w-4 h-4 m-auto text-warning" />
          </div>

          {/* Nutrients level */}
          <div className="relative w-8 h-8">
            <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
              <circle
                cx="16"
                cy="16"
                r="12"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="3"
                fill="none"
              />
              <circle
                cx="16"
                cy="16"
                r="12"
                stroke="#4CAF50"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${(plant.healthStatus?.nutrients || 0) * 0.75} 75`}
                strokeLinecap="round"
              />
            </svg>
            <ApperIcon name="Zap" className="absolute inset-0 w-4 h-4 m-auto text-success" />
          </div>
        </div>
      </div>

      {/* Plant Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-display font-semibold text-lg text-gray-900 truncate">
              {plant.name}
            </h3>
            <p className="text-sm text-gray-500 italic truncate">
              {plant.scientificName}
            </p>
          </div>
          <span className="flex-shrink-0 px-2 py-1 text-xs font-medium bg-secondary/10 text-secondary rounded-full">
            {plant.type}
          </span>
        </div>

        {/* Health Status Bars */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1">
              <ApperIcon name="Droplets" className="w-3 h-3 text-info" />
              <span className="text-gray-600">Water</span>
            </div>
            <span className={`font-medium ${getHealthColor(plant.healthStatus?.water || 0)}`}>
              {plant.healthStatus?.water || 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${getHealthBg(plant.healthStatus?.water || 0)}`}
              style={{ width: `${plant.healthStatus?.water || 0}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1">
              <ApperIcon name="Sun" className="w-3 h-3 text-warning" />
              <span className="text-gray-600">Light</span>
            </div>
            <span className={`font-medium ${getHealthColor(plant.healthStatus?.sunlight || 0)}`}>
              {plant.healthStatus?.sunlight || 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${getHealthBg(plant.healthStatus?.sunlight || 0)}`}
              style={{ width: `${plant.healthStatus?.sunlight || 0}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1">
              <ApperIcon name="Zap" className="w-3 h-3 text-success" />
              <span className="text-gray-600">Nutrients</span>
            </div>
            <span className={`font-medium ${getHealthColor(plant.healthStatus?.nutrients || 0)}`}>
              {plant.healthStatus?.nutrients || 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${getHealthBg(plant.healthStatus?.nutrients || 0)}`}
              style={{ width: `${plant.healthStatus?.nutrients || 0}%` }}
            />
          </div>
        </div>

        {/* Quick Actions */}
        {showActions && (
          <div className="flex space-x-2 pt-2 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="sm"
              icon="Droplets"
              className="flex-1 text-xs"
              onClick={(e) => {
                e.stopPropagation()
                onTaskComplete?.('water', plant.id)
              }}
            >
              Water
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon="Scissors"
              className="flex-1 text-xs"
              onClick={(e) => {
                e.stopPropagation()
                onTaskComplete?.('prune', plant.id)
              }}
            >
              Prune
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default PlantCard