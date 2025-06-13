import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary/50 shadow-sm',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary/50 shadow-sm',
    accent: 'bg-accent text-white hover:bg-accent/90 focus:ring-accent/50 shadow-sm',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/50',
    ghost: 'text-gray-600 hover:text-primary hover:bg-surface focus:ring-primary/50',
    success: 'bg-success text-white hover:bg-success/90 focus:ring-success/50 shadow-sm',
    warning: 'bg-warning text-white hover:bg-warning/90 focus:ring-warning/50 shadow-sm',
    error: 'bg-error text-white hover:bg-error/90 focus:ring-error/50 shadow-sm'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  }

  const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'

  return (
    <motion.button
      whileHover={disabled || loading ? {} : { scale: 1.05 }}
      whileTap={disabled || loading ? {} : { scale: 0.95 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
      )}
      
      {icon && iconPosition === 'left' && !loading && (
        <ApperIcon name={icon} className="w-4 h-4 mr-2" />
      )}
      
      {children}
      
      {icon && iconPosition === 'right' && !loading && (
        <ApperIcon name={icon} className="w-4 h-4 ml-2" />
      )}
    </motion.button>
  )
}

export default Button