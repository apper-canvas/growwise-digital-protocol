import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import EmptyState from '@/components/molecules/EmptyState'
import { SkeletonLoader } from '@/components/atoms/LoadingSpinner'
import { guideService } from '@/services'
import { toast } from 'react-toastify'

const Guides = () => {
  const [guides, setGuides] = useState([])
  const [filteredGuides, setFilteredGuides] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const navigate = useNavigate()

  const categories = ['All', 'Vegetables', 'Flowers', 'Herbs', 'Soil & Compost', 'Pest Control']

  useEffect(() => {
    const loadGuides = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const guidesData = await guideService.getAll()
        setGuides(guidesData)
        setFilteredGuides(guidesData)
      } catch (err) {
        setError(err.message || 'Failed to load guides')
        toast.error('Failed to load guides')
      } finally {
        setLoading(false)
      }
    }

    loadGuides()
  }, [])

  useEffect(() => {
    let filtered = [...guides]

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(guide => guide.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(guide =>
        guide.title.toLowerCase().includes(query) ||
        guide.description.toLowerCase().includes(query) ||
        guide.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    setFilteredGuides(filtered)
  }, [guides, selectedCategory, searchQuery])

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Beginner': 'bg-success/10 text-success',
      'Intermediate': 'bg-warning/10 text-warning',
      'Advanced': 'bg-error/10 text-error'
    }
    return colors[difficulty] || 'bg-gray-100 text-gray-600'
  }

  const getDifficultyIcon = (difficulty) => {
    const icons = {
      'Beginner': 'Leaf',
      'Intermediate': 'TreePine',
      'Advanced': 'Trees'
    }
    return icons[difficulty] || 'BookOpen'
  }

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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load guides</h3>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-full overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">Plant Care Guides</h1>
            <p className="text-gray-500 mt-1">
              Comprehensive guides to help you grow healthy plants
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-md">
          <Input
            type="text"
            placeholder="Search guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon="Search"
            className="w-full"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6">
        {/* Category Filters */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-surface text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Guides Grid */}
        {filteredGuides.length === 0 ? (
          <EmptyState
            icon="BookOpen"
            title={searchQuery || selectedCategory !== 'All' ? "No guides found" : "No guides available"}
            description={
              searchQuery 
                ? `No guides match "${searchQuery}". Try different keywords.`
                : selectedCategory !== 'All'
                  ? `No guides found in the ${selectedCategory} category.`
                  : "Plant care guides will appear here."
            }
            actionLabel={searchQuery || selectedCategory !== 'All' ? "Clear Filters" : undefined}
            onAction={() => {
              setSearchQuery('')
              setSelectedCategory('All')
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide, index) => (
              <motion.div
                key={guide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="bg-white rounded-xl shadow-soft hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer"
                onClick={() => navigate(`/guides/${guide.id}`)} // This would need to be implemented
              >
                {/* Guide Image */}
                <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative overflow-hidden">
                  <img
                    src={guide.imageUrl}
                    alt={guide.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 hidden items-center justify-center">
                    <ApperIcon name="BookOpen" className="w-16 h-16 text-primary/60" />
                  </div>
                  
                  {/* Difficulty Badge */}
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(guide.difficulty)}`}>
                    <ApperIcon name={getDifficultyIcon(guide.difficulty)} className="w-3 h-3 mr-1 inline" />
                    {guide.difficulty}
                  </div>
                </div>

                {/* Guide Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="px-2 py-1 text-xs font-medium bg-secondary/10 text-secondary rounded-full">
                      {guide.category}
                    </span>
                    <div className="flex items-center text-xs text-gray-500">
                      <ApperIcon name="Clock" className="w-3 h-3 mr-1" />
                      {guide.readTime}
                    </div>
                  </div>

                  <h3 className="font-display font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                    {guide.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {guide.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {guide.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                    {guide.tags.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                        +{guide.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Read More Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between"
                    icon="ArrowRight"
                    iconPosition="right"
                  >
                    Read Guide
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Guides