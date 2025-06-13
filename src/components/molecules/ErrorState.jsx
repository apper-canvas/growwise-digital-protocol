import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const ErrorState = ({ 
  message = 'Something went wrong', 
  onRetry,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`text-center py-12 ${className}`}
    >
      <div className="w-16 h-16 mx-auto mb-4 bg-error/10 rounded-full flex items-center justify-center">
        <ApperIcon name="AlertTriangle" className="w-8 h-8 text-error" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        {message}
      </p>
      
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          icon="RefreshCw"
        >
          Try Again
        </Button>
      )}
    </motion.div>
  )
}

export default ErrorState