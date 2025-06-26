import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const EmptyState = ({ 
  icon = 'Package', 
  title, 
  description, 
  actionLabel, 
  onAction,
  className = ''
}) => {
  const iconVariants = {
    float: {
      y: [0, -10, 0],
      transition: {
        repeat: Infinity,
        duration: 3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`text-center py-12 ${className}`}
    >
      <motion.div
        variants={iconVariants}
        animate="float"
        className="inline-block mb-6"
      >
        <div className="w-20 h-20 bg-surface-100 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} size={32} className="text-surface-400" />
        </div>
      </motion.div>
      
      <h3 className="text-lg font-semibold text-surface-900 mb-2">{title}</h3>
      <p className="text-surface-500 mb-6 max-w-md mx-auto">{description}</p>
      
      {actionLabel && onAction && (
        <Button onClick={onAction} icon="Plus">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;