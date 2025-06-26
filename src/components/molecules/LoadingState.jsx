import { motion } from 'framer-motion';

const LoadingState = ({ count = 3, type = 'card' }) => {
  const shimmerVariants = {
    animate: {
      backgroundPosition: ['200% 0', '-200% 0'],
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: 'linear'
      }
    }
  };

  const staggerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  if (type === 'table') {
    return (
      <div className="space-y-4">
        {[...Array(count)].map((_, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.div
                  variants={shimmerVariants}
                  animate="animate"
                  className="w-12 h-12 bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 
                           rounded-lg bg-[length:200%_100%]"
                />
                <div className="space-y-2">
                  <motion.div
                    variants={shimmerVariants}
                    animate="animate"
                    className="h-4 w-32 bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 
                             rounded bg-[length:200%_100%]"
                  />
                  <motion.div
                    variants={shimmerVariants}
                    animate="animate"
                    className="h-3 w-24 bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 
                             rounded bg-[length:200%_100%]"
                  />
                </div>
              </div>
              <motion.div
                variants={shimmerVariants}
                animate="animate"
                className="h-8 w-20 bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 
                         rounded bg-[length:200%_100%]"
              />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerVariants}
      initial="initial"
      animate="animate"
      className="space-y-4"
    >
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          variants={itemVariants}
          className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
        >
          <div className="animate-pulse space-y-4">
            <div className="flex items-center justify-between">
              <motion.div
                variants={shimmerVariants}
                animate="animate"
                className="h-6 w-48 bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 
                         rounded bg-[length:200%_100%]"
              />
              <motion.div
                variants={shimmerVariants}
                animate="animate"
                className="h-5 w-16 bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 
                         rounded bg-[length:200%_100%]"
              />
            </div>
            <motion.div
              variants={shimmerVariants}
              animate="animate"
              className="h-4 w-full bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 
                       rounded bg-[length:200%_100%]"
            />
            <motion.div
              variants={shimmerVariants}
              animate="animate"
              className="h-4 w-3/4 bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 
                       rounded bg-[length:200%_100%]"
            />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default LoadingState;