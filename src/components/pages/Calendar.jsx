import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isSameMonth } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import TaskCard from '@/components/molecules/TaskCard'
import EmptyState from '@/components/molecules/EmptyState'
import { SkeletonLoader } from '@/components/atoms/LoadingSpinner'
import { careTaskService, plantService } from '@/services'
import { toast } from 'react-toastify'

const Calendar = () => {
  const [tasks, setTasks] = useState([])
  const [plants, setPlants] = useState([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [view, setView] = useState('month') // 'month' or 'list'
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadCalendarData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const [tasksData, plantsData] = await Promise.all([
          careTaskService.getAll(),
          plantService.getAll()
        ])
        
        setTasks(tasksData)
        setPlants(plantsData)
      } catch (err) {
        setError(err.message || 'Failed to load calendar data')
        toast.error('Failed to load calendar data')
      } finally {
        setLoading(false)
      }
    }

    loadCalendarData()
  }, [])

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

  const getPlantById = (plantId) => {
    return plants.find(p => p.id === plantId)
  }

  const getTasksForDate = (date) => {
    return tasks.filter(task => isSameDay(new Date(task.scheduledDate), date))
  }

  const getSelectedDateTasks = () => {
    return getTasksForDate(selectedDate).sort((a, b) => 
      new Date(a.scheduledDate) - new Date(b.scheduledDate)
    )
  }

  const getTasksForMonth = () => {
    const start = startOfMonth(currentDate)
    const end = endOfMonth(currentDate)
    
    return tasks.filter(task => {
      const taskDate = new Date(task.scheduledDate)
      return taskDate >= start && taskDate <= end
    })
  }

  const monthDays = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  })

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  if (loading) {
    return (
      <div className="max-w-full overflow-hidden p-4 md:p-6">
        <SkeletonLoader count={2} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-full overflow-hidden p-4 md:p-6">
        <div className="text-center py-12">
          <ApperIcon name="AlertTriangle" className="w-12 h-12 text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load calendar</h3>
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
            <h1 className="text-2xl font-display font-bold text-gray-900">Care Calendar</h1>
            <p className="text-gray-500 mt-1">
              {tasks.filter(t => !t.completed).length} pending tasks
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* View Toggle */}
            <div className="hidden md:flex bg-surface rounded-lg p-1">
              <button
                onClick={() => setView('month')}
                className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                  view === 'month' 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ApperIcon name="Calendar" className="w-4 h-4 mr-1 inline" />
                Month
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                  view === 'list' 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ApperIcon name="List" className="w-4 h-4 mr-1 inline" />
                List
              </button>
            </div>
          </div>
        </div>

        {/* Mobile View Toggle */}
        <div className="md:hidden mt-4 flex bg-surface rounded-lg p-1">
          <button
            onClick={() => setView('month')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded transition-colors ${
              view === 'month' 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-gray-600'
            }`}
          >
            <ApperIcon name="Calendar" className="w-4 h-4 mr-1 inline" />
            Month View
          </button>
          <button
            onClick={() => setView('list')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded transition-colors ${
              view === 'list' 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-gray-600'
            }`}
          >
            <ApperIcon name="List" className="w-4 h-4 mr-1 inline" />
            List View
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6">
        <AnimatePresence mode="wait">
          {view === 'month' ? (
            <motion.div
              key="month"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Calendar */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-soft overflow-hidden">
                  {/* Calendar Header */}
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-lg font-display font-semibold text-gray-900">
                      {format(currentDate, 'MMMM yyyy')}
                    </h2>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="ChevronLeft"
                        onClick={() => navigateMonth(-1)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setCurrentDate(new Date())
                          setSelectedDate(new Date())
                        }}
                      >
                        Today
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="ChevronRight"
                        onClick={() => navigateMonth(1)}
                      />
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="p-4">
                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="p-2 text-center text-xs font-medium text-gray-500">
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-1">
                      {monthDays.map(day => {
                        const dayTasks = getTasksForDate(day)
                        const isSelected = isSameDay(day, selectedDate)
                        const isTodayDate = isToday(day)
                        const isCurrentMonth = isSameMonth(day, currentDate)

                        return (
                          <motion.button
                            key={day.toISOString()}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedDate(day)}
                            className={`
                              p-2 h-16 rounded-lg transition-all text-left relative
                              ${isSelected 
                                ? 'bg-primary text-white' 
                                : isTodayDate 
                                  ? 'bg-secondary/10 text-secondary border-2 border-secondary'
                                  : isCurrentMonth
                                    ? 'hover:bg-surface text-gray-900'
                                    : 'text-gray-400 hover:bg-gray-50'
                              }
                            `}
                          >
                            <span className="text-sm font-medium">
                              {format(day, 'd')}
                            </span>
                            
                            {dayTasks.length > 0 && (
                              <div className="absolute bottom-1 left-1 right-1 flex space-x-1">
                                {dayTasks.slice(0, 3).map((task, index) => (
                                  <div
                                    key={task.id}
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      task.completed 
                                        ? 'bg-success' 
                                        : isSelected
                                          ? 'bg-white'
                                          : 'bg-warning'
                                    }`}
                                  />
                                ))}
                                {dayTasks.length > 3 && (
                                  <span className={`text-xs ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                                    +{dayTasks.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Date Tasks */}
              <div className="space-y-4">
                <div className="bg-white rounded-xl shadow-soft p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {format(selectedDate, 'EEEE, MMMM d')}
                  </h3>
                  
                  {getSelectedDateTasks().length === 0 ? (
                    <EmptyState
                      icon="Calendar"
                      title="No tasks"
                      description="No tasks scheduled for this date."
                      className="py-6"
                    />
                  ) : (
                    <div className="space-y-3">
                      {getSelectedDateTasks().map(task => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          plant={getPlantById(task.plantId)}
                          onComplete={handleTaskComplete}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {tasks.length === 0 ? (
                <EmptyState
                  icon="Calendar"
                  title="No tasks scheduled"
                  description="Your plants don't have any care tasks scheduled yet. Tasks will appear here as you add plants and care schedules."
                />
              ) : (
                <div className="space-y-4">
                  {tasks
                    .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
                    .map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <TaskCard
                          task={task}
                          plant={getPlantById(task.plantId)}
                          onComplete={handleTaskComplete}
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

export default Calendar