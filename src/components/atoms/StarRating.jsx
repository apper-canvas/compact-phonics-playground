import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const StarRating = ({ 
  stars = 0, 
  maxStars = 5, 
  size = 'medium',
  animated = true,
  className = ''
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  const starVariants = {
    empty: { scale: 1, rotate: 0 },
    filled: { scale: 1.1, rotate: 15 },
    burst: { 
      scale: [1, 1.5, 1], 
      rotate: [0, 180, 360],
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[...Array(maxStars)].map((_, index) => {
        const isFilled = index < stars;
        
        return (
          <motion.div
            key={index}
            variants={animated ? starVariants : {}}
            initial="empty"
            animate={isFilled ? "filled" : "empty"}
            whileHover={animated ? "burst" : {}}
            className={sizeClasses[size]}
          >
            <ApperIcon
              name="Star"
              className={`${
                isFilled 
                  ? 'text-accent fill-current' 
                  : 'text-gray-300'
              } w-full h-full`}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default StarRating;