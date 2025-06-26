import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  icon, 
  iconPosition = 'left',
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary',
    outline: 'border border-surface-300 text-surface-700 hover:bg-surface-50 focus:ring-primary',
    ghost: 'text-surface-600 hover:bg-surface-100 focus:ring-primary',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500'
  };

  const sizes = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-2.5 text-sm',
    large: 'px-6 py-3 text-base'
  };

  const buttonVariants = {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 }
  };

  return (
    <motion.button
      variants={buttonVariants}
      whileHover={!disabled && !loading ? "hover" : ""}
      whileTap={!disabled && !loading ? "tap" : ""}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
      )}
      {!loading && icon && iconPosition === 'left' && (
        <ApperIcon name={icon} size={16} className="mr-2" />
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && (
        <ApperIcon name={icon} size={16} className="ml-2" />
      )}
    </motion.button>
  );
};

export default Button;