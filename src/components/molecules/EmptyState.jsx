import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const EmptyState = ({ 
  icon = 'Leaf',
  title,
  description,
  actionLabel,
  onAction,
  illustration,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`text-center py-12 ${className}`}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="mb-6"
      >
        {illustration ? (
          <div className="w-24 h-24 mx-auto mb-4 bg-surface rounded-full flex items-center justify-center">
            {illustration}
          </div>
        ) : (
          <div className="w-16 h-16 mx-auto mb-4 bg-surface rounded-full flex items-center justify-center">
            <ApperIcon name={icon} className="w-8 h-8 text-primary" />
          </div>
        )}
      </motion.div>
      
      <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={onAction}
            variant="primary"
            size="lg"
            className="mx-auto"
          >
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}

export default EmptyState