import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import PlantCard from '@/components/molecules/PlantCard'
import GardenBedCard from '@/components/molecules/GardenBedCard'
import EmptyState from '@/components/molecules/EmptyState'
import { SkeletonLoader } from '@/components/atoms/LoadingSpinner'
import { plantService, gardenBedService, careTaskService } from '@/services'
import { toast } from 'react-toastify'

const MyGarden = () => {
  const [plants, setPlants] = useState([])
  const [gardenBeds, setGardenBeds] = useState([])
  const [selectedBed, setSelectedBed] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [view, setView] = useState('beds') // 'beds' or 'plants'
  const navigate = useNavigate()

  useEffect(() => {
    const loadGardenData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const [plantsData, bedsData] = await Promise.all([
          plantService.getAll(),
          gardenBedService.getAll()
        ])
        
        setPlants(plantsData)
        setGardenBeds(bedsData)
      } catch (err) {
        setError(err.message || 'Failed to load garden data')
        toast.error('Failed to load garden data')
      } finally {
        setLoading(false)
      }
    }

    loadGardenData()
  }, [])

  const handleTaskComplete = async (taskType, plantId) => {
    try {
      // Create a quick task completion
      const newTask = {
        plantId,
        type: taskType === 'water' ? 'Water' : 'Prune',
        scheduledDate: new Date().toISOString(),
        instructions: `Quick ${taskType} from garden view`
      }
      
      const createdTask = await careTaskService.create(newTask)
      await careTaskService.markComplete(createdTask.id, `Completed via quick action`)
      
      toast.success(`${taskType === 'water' ? 'Watering' : 'Pruning'} completed!`)
    } catch (err) {
      toast.error(`Failed to complete ${taskType}`)
    }
  }

  const getFilteredPlants = () => {
    if (!selectedBed) return plants
    return plants.filter(plant => plant.gardenBedId === selectedBed)
  }

  const filteredPlants = getFilteredPlants()

  if (loading) {
    return (
      <div className="max-w-full overflow-hidden p-4 md:p-6">
        <SkeletonLoader count={3} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-full overflow-hidden p-4 md:p-6">
        <div className="text-center py-12">
          <ApperIcon name="AlertTriangle" className="w-12 h-12 text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load garden</h3>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-full overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">My Garden</h1>
            <p className="text-gray-500 mt-1">
              {plants.length} plants across {gardenBeds.length} garden beds
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* View Toggle */}
            <div className="hidden md:flex bg-surface rounded-lg p-1">
              <button
                onClick={() => setView('beds')}
                className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                  view === 'beds' 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ApperIcon name="LayoutGrid" className="w-4 h-4 mr-1 inline" />
                Beds
              </button>
              <button
                onClick={() => setView('plants')}
                className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                  view === 'plants' 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ApperIcon name="Leaf" className="w-4 h-4 mr-1 inline" />
                Plants
              </button>
            </div>

            <Button
              variant="primary"
              icon="Plus"
              onClick={() => navigate('/add-plant')}
            >
              Add Plant
            </Button>
          </div>
        </div>

        {/* Mobile View Toggle */}
        <div className="md:hidden mt-4 flex bg-surface rounded-lg p-1">
          <button
            onClick={() => setView('beds')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded transition-colors ${
              view === 'beds' 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-gray-600'
            }`}
          >
            <ApperIcon name="LayoutGrid" className="w-4 h-4 mr-1 inline" />
            Garden Beds
          </button>
          <button
            onClick={() => setView('plants')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded transition-colors ${
              view === 'plants' 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-gray-600'
            }`}
          >
            <ApperIcon name="Leaf" className="w-4 h-4 mr-1 inline" />
            All Plants
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6">
        <AnimatePresence mode="wait">
          {view === 'beds' ? (
            <motion.div
              key="beds"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {gardenBeds.length === 0 ? (
                <EmptyState
                  icon="Sprout"
                  title="No garden beds yet"
                  description="Create your first garden bed to start organizing your plants by location and growing conditions."
                  actionLabel="Add Your First Plant"
                  onAction={() => navigate('/add-plant')}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gardenBeds.map((bed, index) => (
                    <motion.div
                      key={bed.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <GardenBedCard 
                        gardenBed={bed}
                        onClick={() => {
                          setSelectedBed(bed.id)
                          setView('plants')
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="plants"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Filter Header */}
              {selectedBed && (
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="ArrowLeft"
                      onClick={() => setSelectedBed(null)}
                    >
                      All Plants
                    </Button>
                    <span className="text-gray-300">|</span>
                    <span className="font-medium text-gray-900">
                      {gardenBeds.find(b => b.id === selectedBed)?.name}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {filteredPlants.length} plants
                  </span>
                </div>
              )}

              {filteredPlants.length === 0 ? (
                <EmptyState
                  icon="Leaf"
                  title={selectedBed ? "No plants in this bed" : "No plants yet"}
                  description={
                    selectedBed 
                      ? "Add some plants to this garden bed to start tracking their care."
                      : "Start your gardening journey by adding your first plant."
                  }
                  actionLabel="Add Plant"
                  onAction={() => navigate('/add-plant')}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPlants.map((plant, index) => (
                    <motion.div
                      key={plant.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <PlantCard 
                        plant={plant} 
                        onTaskComplete={handleTaskComplete}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default MyGarden