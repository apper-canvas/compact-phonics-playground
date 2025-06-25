import { motion } from 'framer-motion';

const ProgressBar = ({ 
  progress = 0, 
  max = 100, 
  variant = 'primary',
  size = 'medium',
  showPercentage = false,
  animated = true,
  className = ''
}) => {
  const percentage = Math.min(Math.max((progress / max) * 100, 0), 100);

  const variants = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    accent: 'bg-accent',
    rainbow: 'bg-gradient-to-r from-primary via-secondary to-accent'
  };

  const sizes = {
    small: 'h-2',
    medium: 'h-4',
    large: 'h-6'
  };

  const progressVariants = {
    initial: { width: '0%' },
    animate: { width: `${percentage}%` }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Background */}
      <div className={`w-full ${sizes[size]} bg-gray-200 rounded-full overflow-hidden`}>
        {/* Progress Fill */}
        <motion.div
          variants={animated ? progressVariants : {}}
          initial={animated ? "initial" : undefined}
          animate={animated ? "animate" : undefined}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full ${variants[variant]} rounded-full relative`}
          style={!animated ? { width: `${percentage}%` } : {}}
        >
          {/* Shine Effect */}
          {percentage > 0 && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                repeatDelay: 2,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />
          )}
        </motion.div>
      </div>

      {/* Percentage Text */}
      {showPercentage && (
        <motion.div
          initial={animated ? { opacity: 0, y: 10 } : {}}
          animate={animated ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <span className="text-xs font-bold text-white mix-blend-difference">
            {Math.round(percentage)}%
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default ProgressBar;