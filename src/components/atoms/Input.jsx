import { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  icon,
  iconPosition = 'left',
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  const [focused, setFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const hasValue = value && value.length > 0
  const shouldFloatLabel = focused || hasValue

  const inputType = type === 'password' && showPassword ? 'text' : type

  return (
    <div className={`relative ${className}`}>
      {/* Input container */}
      <div className="relative">
        {/* Left icon */}
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} className="w-4 h-4 text-gray-400" />
          </div>
        )}

        {/* Input field */}
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          className={`
            block w-full px-3 py-3 border border-gray-300 rounded-lg
            bg-white text-gray-900 placeholder-transparent
            focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            transition-all duration-200
            ${icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${icon && iconPosition === 'right' ? 'pr-10' : ''}
            ${type === 'password' ? 'pr-10' : ''}
            ${error ? 'border-error focus:border-error focus:ring-error/50' : ''}
          `}
          placeholder={placeholder}
          {...props}
        />

        {/* Floating label */}
        {label && (
          <motion.label
            initial={false}
            animate={{
              scale: shouldFloatLabel ? 0.85 : 1,
              y: shouldFloatLabel ? -24 : 0,
              x: shouldFloatLabel ? (icon && iconPosition === 'left' ? -28 : -12) : (icon && iconPosition === 'left' ? 28 : 0)
            }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`
              absolute left-3 top-3 pointer-events-none origin-left
              transition-colors duration-200
              ${shouldFloatLabel 
                ? `text-xs ${focused ? 'text-primary' : 'text-gray-500'} bg-white px-1` 
                : 'text-gray-500'
              }
              ${error && shouldFloatLabel ? 'text-error' : ''}
            `}
          >
            {label} {required && <span className="text-error">*</span>}
          </motion.label>
        )}

        {/* Right icon or password toggle */}
        {((icon && iconPosition === 'right') || type === 'password') && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {type === 'password' ? (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <ApperIcon name={showPassword ? 'EyeOff' : 'Eye'} className="w-4 h-4" />
              </button>
            ) : (
              <ApperIcon name={icon} className="w-4 h-4 text-gray-400" />
            )}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-error flex items-center"
        >
          <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
          {error}
        </motion.p>
      )}

      {/* Helper text */}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
}

export default Input