import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        {/* Illustration */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="w-24 h-24 mx-auto mb-6 bg-surface rounded-full flex items-center justify-center"
        >
          <ApperIcon name="Sprout" className="w-12 h-12 text-primary" />
        </motion.div>

        <h1 className="text-6xl font-display font-bold text-primary mb-2">404</h1>
        <h2 className="text-2xl font-display font-semibold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          Looks like this page got lost in the garden! The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="space-y-3">
          <Button
            onClick={() => navigate('/dashboard')}
            className="w-full"
            icon="Home"
          >
            Back to Dashboard
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="w-full"
            icon="ArrowLeft"
          >
            Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export default NotFound