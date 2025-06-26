import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  icon,
  className = '',
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  const hasValue = value && value.length > 0;
  const shouldFloat = focused || hasValue;

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400">
            <ApperIcon name={icon} size={16} />
          </div>
        )}
        
        <input
          type={type}
          value={value || ''}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          className={`
            w-full px-3 py-3 border border-surface-300 rounded-lg
            bg-white text-surface-900 placeholder-transparent
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            transition-all duration-200
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${disabled ? 'bg-surface-50 cursor-not-allowed' : ''}
          `}
          placeholder={placeholder}
          {...props}
        />

        {label && (
          <motion.label
            initial={false}
            animate={{
              top: shouldFloat ? '6px' : '50%',
              fontSize: shouldFloat ? '0.75rem' : '1rem',
              color: focused ? '#0369a1' : error ? '#ef4444' : '#64748b'
            }}
            className={`
              absolute left-3 transform -translate-y-1/2 pointer-events-none
              transition-all duration-200 bg-white px-1
              ${icon ? 'left-10' : ''}
            `}
          >
            {label} {required && <span className="text-red-500">*</span>}
          </motion.label>
        )}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-500 flex items-center gap-1"
        >
          <ApperIcon name="AlertCircle" size={14} />
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default Input;