import { useState } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const TaskCard = ({ task, plant, onComplete, onSkip }) => {
  const [completing, setCompleting] = useState(false)

  const getTaskIcon = (type) => {
    const icons = {
      Water: 'Droplets',
      Fertilize: 'Zap',
      Prune: 'Scissors', 
      'Pest Check': 'Bug',
      Deadhead: 'Flower',
      Harvest: 'Apple',
      Support: 'Wrench'
    }
    return icons[type] || 'CheckCircle'
  }

  const getTaskColor = (type) => {
    const colors = {
      Water: 'text-info bg-info/10',
      Fertilize: 'text-warning bg-warning/10',
      Prune: 'text-secondary bg-secondary/10',
      'Pest Check': 'text-error bg-error/10',
      Deadhead: 'text-pink-500 bg-pink-50',
      Harvest: 'text-orange-500 bg-orange-50',
      Support: 'text-gray-600 bg-gray-100'
    }
    return colors[type] || 'text-gray-600 bg-gray-100'
  }

  const getPriorityColor = () => {
    const now = new Date()
    const taskDate = new Date(task.scheduledDate)
    const diffHours = (taskDate - now) / (1000 * 60 * 60)

    if (diffHours < 0) return 'border-l-4 border-l-error' // Overdue
    if (diffHours < 24) return 'border-l-4 border-l-warning' // Due today
    return 'border-l-4 border-l-secondary' // Upcoming
  }

  const handleComplete = async () => {
    setCompleting(true)
    try {
      await onComplete?.(task.id)
    } finally {
      setCompleting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`bg-white rounded-lg shadow-soft hover:shadow-md transition-all duration-200 ${getPriorityColor()} overflow-hidden`}
    >
      <div className="p-4">
        <div className="flex items-start space-x-3">
          {/* Plant Image */}
          <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
            <img
              src={plant?.photoUrl}
              alt={plant?.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = `https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=100&h=100&fit=crop&crop=center`
              }}
            />
          </div>

          {/* Task Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTaskColor(task.type)}`}>
                <ApperIcon name={getTaskIcon(task.type)} className="w-3 h-3 mr-1" />
                {task.type}
              </span>
              <span className="text-xs text-gray-500">
                {format(new Date(task.scheduledDate), 'MMM dd, h:mm a')}
              </span>
            </div>

            <h4 className="font-medium text-gray-900 mb-1 truncate">
              {plant?.name || 'Unknown Plant'}
            </h4>

            {task.instructions && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {task.instructions}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="success"
                loading={completing}
                onClick={handleComplete}
                className="flex-1"
              >
                <ApperIcon name="Check" className="w-4 h-4 mr-1" />
                Complete
              </Button>
              
              {onSkip && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onSkip(task.id)}
                  className="px-3"
                >
                  <ApperIcon name="Clock" className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TaskCard