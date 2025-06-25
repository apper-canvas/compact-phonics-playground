import { motion } from 'framer-motion';
import { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';
import audioService from '@/services/audioService';
const LetterCard = ({ 
  letter, 
  onClick, 
  isCompleted = false, 
  showSound = true,
  size = 'large',
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

const handleClick = async () => {
    if (onClick) {
      setIsPlaying(true);
      
      // Play the letter sound
      if (letter.audioUrl) {
        await audioService.playSound(letter.audioUrl);
      }
      
      // Call the parent onClick handler
      await onClick(letter);
      
      setTimeout(() => setIsPlaying(false), 1000);
    }
  };

  const sizeClasses = {
    small: 'w-16 h-16 text-2xl',
    medium: 'w-20 h-20 text-3xl',
    large: 'w-24 h-24 md:w-28 md:h-28 text-4xl md:text-5xl'
  };

  const cardVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: { scale: 1.05, rotate: 1 },
    tap: { scale: 0.95, rotate: -1 },
    playing: { 
      scale: [1, 1.2, 1], 
      rotate: [0, 5, -5, 0],
      transition: { duration: 0.6, times: [0, 0.3, 0.7, 1] }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      animate={isPlaying ? "playing" : "initial"}
      onClick={handleClick}
      className={`
        ${sizeClasses[size]}
        bg-white rounded-2xl shadow-lg border-4 cursor-pointer
        flex flex-col items-center justify-center gap-1 p-2
        ${isCompleted 
          ? 'border-secondary shadow-secondary/30' 
          : 'border-primary/30 hover:border-primary'
        }
        ${className}
      `}
    >
      {/* Letter Character */}
      <div className="relative flex items-center justify-center">
        <span className="font-display font-bold text-primary">
          {letter.character}
        </span>
        
        {/* Letter Face - Simple dots for eyes */}
        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 flex gap-1">
          <div className="w-1 h-1 bg-primary/40 rounded-full"></div>
          <div className="w-1 h-1 bg-primary/40 rounded-full"></div>
        </div>
      </div>

      {/* Sound Indicator */}
      {showSound && (
        <div className="flex items-center gap-1">
          <ApperIcon 
            name="Volume2" 
            size={12} 
            className={`text-gray-500 ${isPlaying ? 'animate-pulse' : ''}`} 
          />
          <span className="text-xs text-gray-600 font-medium">
            {letter.sound}
          </span>
        </div>
      )}

      {/* Completion Star */}
      {isCompleted && (
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
          className="absolute -top-2 -right-2"
        >
          <div className="bg-accent rounded-full p-1 shadow-lg">
            <ApperIcon name="Star" size={16} className="text-white fill-current" />
          </div>
        </motion.div>
      )}

      {/* Sound Wave Animation */}
      {isPlaying && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.5, 0], opacity: [0, 0.6, 0] }}
          transition={{ duration: 1, repeat: 2 }}
          className="absolute inset-0 border-4 border-accent rounded-2xl pointer-events-none"
        />
      )}
    </motion.div>
  );
};

export default LetterCard;