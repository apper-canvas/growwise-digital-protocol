import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import WeatherWidget from '@/components/molecules/WeatherWidget'
import TaskCard from '@/components/molecules/TaskCard'
import GardenBedCard from '@/components/molecules/GardenBedCard'
import EmptyState from '@/components/molecules/EmptyState'
import { SkeletonLoader } from '@/components/atoms/LoadingSpinner'
import { plantService, gardenBedService, careTaskService } from '@/services'
import { toast } from 'react-toastify'

const DashboardOverview = () => {
  const [plants, setPlants] = useState([])
  const [gardenBeds, setGardenBeds] = useState([])
  const [upcomingTasks, setUpcomingTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const [plantsData, bedsData, tasksData] = await Promise.all([
          plantService.getAll(),
          gardenBedService.getAll(),
          careTaskService.getUpcoming(7)
        ])
        
        setPlants(plantsData)
        setGardenBeds(bedsData)
        setUpcomingTasks(tasksData)
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data')
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const handleTaskComplete = async (taskId) => {
    try {
      await careTaskService.markComplete(taskId)
      setUpcomingTasks(tasks => tasks.filter(t => t.id !== taskId))
      toast.success('Task completed successfully!')
    } catch (err) {
      toast.error('Failed to complete task')
    }
  }

  const getPlantById = (plantId) => {
    return plants.find(p => p.id === plantId)
  }

  if (loading) {
    return (
      <div className="max-w-full overflow-hidden p-4 md:p-6 space-y-6">
        <SkeletonLoader count={3} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-full overflow-hidden p-4 md:p-6">
        <div className="text-center py-12">
          <ApperIcon name="AlertTriangle" className="w-12 h-12 text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load dashboard</h3>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-full overflow-hidden p-4 md:p-6 space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold mb-2">Welcome to Your Garden</h1>
            <p className="text-primary-100">
              You have {plants.length} plants across {gardenBeds.length} garden beds
            </p>
          </div>
          <Button
            variant="accent"
            icon="Plus"
            onClick={() => navigate('/add-plant')}
          >
            Add Plant
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-soft p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <ApperIcon name="Leaf" className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{plants.length}</p>
              <p className="text-sm text-gray-500">Total Plants</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-soft p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-info/10 rounded-lg">
              <ApperIcon name="MapPin" className="w-6 h-6 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{gardenBeds.length}</p>
              <p className="text-sm text-gray-500">Garden Beds</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-soft p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-warning/10 rounded-lg">
              <ApperIcon name="Clock" className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{upcomingTasks.length}</p>
              <p className="text-sm text-gray-500">Tasks Due</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-soft p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {plants.filter(p => (p.healthStatus?.water || 0) > 80).length}
              </p>
              <p className="text-sm text-gray-500">Healthy Plants</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Tasks & Garden Beds */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Tasks */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-semibold text-gray-900">
                Upcoming Tasks
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/calendar')}
              >
                View All
              </Button>
            </div>

            {upcomingTasks.length === 0 ? (
              <EmptyState
                icon="CheckCircle"
                title="All caught up!"
                description="No tasks due in the next 7 days. Your garden is in great shape."
                className="py-8"
              />
            ) : (
              <div className="space-y-3">
                {upcomingTasks.slice(0, 3).map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <TaskCard
                      task={task}
                      plant={getPlantById(task.plantId)}
                      onComplete={handleTaskComplete}
                    />
                  </motion.div>
                ))}
                
                {upcomingTasks.length > 3 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-3"
                    onClick={() => navigate('/calendar')}
                  >
                    View {upcomingTasks.length - 3} more tasks
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Garden Beds Overview */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-semibold text-gray-900">
                Garden Beds
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/my-garden')}
              >
                View All
              </Button>
            </div>

            {gardenBeds.length === 0 ? (
              <EmptyState
                icon="Sprout"
                title="No garden beds yet"
                description="Create your first garden bed to start organizing your plants."
                actionLabel="Create Garden Bed"
                onAction={() => navigate('/my-garden')}
                className="py-8"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gardenBeds.slice(0, 4).map((bed, index) => (
                  <motion.div
                    key={bed.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <GardenBedCard gardenBed={bed} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Weather */}
        <div className="space-y-6">
          <WeatherWidget />
          
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
<div className="space-y-3">
              <Button
                variant="outline"
                icon="MapPin"
                className="w-full justify-start"
                onClick={() => navigate('/location')}
              >
                Manage Location
              </Button>
              <Button
                variant="outline"
                icon="Bug"
                className="w-full justify-start"
                onClick={() => navigate('/pest-identification')}
              >
                Check for Pests
              </Button>
              <Button
                variant="outline"
                icon="Calendar"
                className="w-full justify-start"
                onClick={() => navigate('/calendar')}
              >
                View Calendar
              </Button>
              <Button
                variant="outline"
                icon="BookOpen"
                className="w-full justify-start"
                onClick={() => navigate('/guides')}
              >
                Browse Guides
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardOverview