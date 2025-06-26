import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  padding = 'medium',
  ...props 
}) => {
  const paddings = {
    none: '',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  };

  const cardVariants = {
    hover: { 
      y: -2,
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    }
  };

  return (
    <motion.div
      variants={hover ? cardVariants : {}}
      whileHover={hover ? "hover" : ""}
      className={`
        bg-white rounded-lg border border-surface-200 shadow-sm
        ${paddings[padding]}
        ${hover ? 'cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;