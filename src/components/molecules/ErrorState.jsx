import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ErrorState = ({ message, onRetry, className = '' }) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`text-center py-12 ${className}`}
    >
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <ApperIcon name="AlertCircle" size={24} className="text-red-600" />
      </div>
      
      <h3 className="text-lg font-semibold text-surface-900 mb-2">Error</h3>
      <p className="text-red-600 mb-6">{message}</p>
      
      {onRetry && (
        <Button onClick={onRetry} variant="outline" icon="RefreshCw">
          Reintentar
        </Button>
      )}
    </motion.div>
  );
};

export default ErrorState;