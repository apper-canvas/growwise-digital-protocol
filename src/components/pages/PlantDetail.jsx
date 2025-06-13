import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import TaskCard from '@/components/molecules/TaskCard'
import { SkeletonLoader } from '@/components/atoms/LoadingSpinner'
import { plantService, careTaskService, gardenBedService } from '@/services'
import { toast } from 'react-toastify'

const PlantDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [plant, setPlant] = useState(null)
  const [gardenBed, setGardenBed] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadPlantData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const [plantData, tasksData] = await Promise.all([
          plantService.getById(id),
          careTaskService.getByPlant(id)
        ])
        
        setPlant(plantData)
        setTasks(tasksData)

        // Load garden bed info
        if (plantData.gardenBedId) {
          const bedData = await gardenBedService.getById(plantData.gardenBedId)
          setGardenBed(bedData)
        }
      } catch (err) {
        setError(err.message || 'Failed to load plant details')
        toast.error('Failed to load plant details')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadPlantData()
    }
  }, [id])

  const handleTaskComplete = async (taskId) => {
    try {
      await careTaskService.markComplete(taskId)
      setTasks(tasks => 
        tasks.map(task => 
          task.id === taskId 
            ? { ...task, completed: true, completedDate: new Date().toISOString() }
            : task
        )
      )
      toast.success('Task completed successfully!')
    } catch (err) {
      toast.error('Failed to complete task')
    }
  }

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

  const upcomingTasks = tasks.filter(task => !task.completed)
    .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))

  const recentTasks = tasks.filter(task => task.completed)
    .sort((a, b) => new Date(b.completedDate) - new Date(a.completedDate))
    .slice(0, 5)

  if (loading) {
    return (
      <div className="max-w-full overflow-hidden p-4 md:p-6">
        <SkeletonLoader count={2} />
      </div>
    )
  }

  if (error || !plant) {
    return (
      <div className="max-w-full overflow-hidden p-4 md:p-6">
        <div className="text-center py-12">
          <ApperIcon name="AlertTriangle" className="w-12 h-12 text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Plant not found</h3>
          <p className="text-gray-500 mb-4">{error || 'The requested plant could not be found.'}</p>
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
            onClick={() => navigate('/my-garden')}
          >
            Back to Garden
          </Button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-display font-bold text-gray-900 break-words">
              {plant.name}
            </h1>
            <p className="text-gray-500 italic mt-1">{plant.scientificName}</p>
            <div className="flex items-center space-x-4 mt-2">
              <span className="px-2 py-1 text-sm font-medium bg-secondary/10 text-secondary rounded-full">
                {plant.type}
              </span>
              {gardenBed && (
                <span className="text-sm text-gray-500">
                  <ApperIcon name="MapPin" className="w-4 h-4 inline mr-1" />
                  {gardenBed.name}
                </span>
              )}
              <span className="text-sm text-gray-500">
                Planted {format(new Date(plant.plantedDate), 'MMM dd, yyyy')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Plant Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Plant Photo & Health */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-soft overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Plant Photo */}
                <div className="h-64 md:h-80 bg-gray-100 relative">
                  <img
                    src={plant.photoUrl}
                    alt={plant.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop&crop=center`
                    }}
                  />
                </div>

                {/* Health Status */}
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Plant Health</h3>
                  
                  <div className="space-y-4">
                    {/* Water Level */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="Droplets" className="w-4 h-4 text-info" />
                          <span className="text-sm font-medium text-gray-700">Water Level</span>
                        </div>
                        <span className={`text-sm font-bold ${getHealthColor(plant.healthStatus?.water || 0)}`}>
                          {plant.healthStatus?.water || 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getHealthBg(plant.healthStatus?.water || 0)}`}
                          style={{ width: `${plant.healthStatus?.water || 0}%` }}
                        />
                      </div>
                    </div>

                    {/* Sunlight */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="Sun" className="w-4 h-4 text-warning" />
                          <span className="text-sm font-medium text-gray-700">Sunlight</span>
                        </div>
                        <span className={`text-sm font-bold ${getHealthColor(plant.healthStatus?.sunlight || 0)}`}>
                          {plant.healthStatus?.sunlight || 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getHealthBg(plant.healthStatus?.sunlight || 0)}`}
                          style={{ width: `${plant.healthStatus?.sunlight || 0}%` }}
                        />
                      </div>
                    </div>

                    {/* Nutrients */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="Zap" className="w-4 h-4 text-success" />
                          <span className="text-sm font-medium text-gray-700">Nutrients</span>
                        </div>
                        <span className={`text-sm font-bold ${getHealthColor(plant.healthStatus?.nutrients || 0)}`}>
                          {plant.healthStatus?.nutrients || 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getHealthBg(plant.healthStatus?.nutrients || 0)}`}
                          style={{ width: `${plant.healthStatus?.nutrients || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Care Requirements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-soft p-6"
            >
              <h3 className="font-semibold text-gray-900 mb-4">Care Requirements</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(plant.careRequirements || {}).map(([key, value]) => (
                  <div key={key} className="border rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <ApperIcon 
                        name={
                          key === 'sunlight' ? 'Sun' :
                          key === 'water' ? 'Droplets' :
                          key === 'soil' ? 'Mountain' :
                          key === 'fertilizer' ? 'Zap' :
                          key === 'pruning' ? 'Scissors' :
                          'Info'
                        } 
                        className="w-4 h-4 text-primary" 
                      />
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {key}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            {recentTasks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-soft p-6"
              >
                <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
                
                <div className="space-y-3">
                  {recentTasks.map(task => (
                    <div key={task.id} className="flex items-center space-x-3 p-3 bg-success/5 rounded-lg">
                      <div className="p-1.5 bg-success/10 rounded-full">
                        <ApperIcon name="Check" className="w-3 h-3 text-success" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {task.type} completed
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(task.completedDate), 'MMM dd, yyyy h:mm a')}
                        </p>
                        {task.notes && (
                          <p className="text-xs text-gray-600 mt-1">{task.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Tasks */}
          <div className="space-y-6">
            {/* Upcoming Tasks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-soft p-6"
            >
              <h3 className="font-semibold text-gray-900 mb-4">Upcoming Tasks</h3>
              
              {upcomingTasks.length === 0 ? (
                <div className="text-center py-6">
                  <ApperIcon name="CheckCircle" className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No upcoming tasks</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      plant={plant}
                      onComplete={handleTaskComplete}
                    />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-soft p-6"
            >
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-2">
                <Button
                  variant="outline"
                  icon="Droplets"
                  className="w-full justify-start"
                  onClick={() => {
                    // Quick water action
                    handleTaskComplete('water-quick')
                  }}
                >
                  Water Now
                </Button>
                <Button
                  variant="outline"
                  icon="Scissors"
                  className="w-full justify-start"
                  onClick={() => {
                    // Quick prune action
                    handleTaskComplete('prune-quick')
                  }}
                >
                  Record Pruning
</Button>
                <Button
                  variant="outline"
                  icon="Bug"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate(`/pest-identification?plantId=${plant.id}`)
                  }}
                >
                  Check for Pests
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlantDetail