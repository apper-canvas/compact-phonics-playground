import { motion } from 'framer-motion';
import { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';

const WordTile = ({ 
  word, 
  onPlay, 
  isCompleted = false,
  size = 'medium',
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async () => {
    if (onPlay) {
      setIsPlaying(true);
      await onPlay(word);
      setTimeout(() => setIsPlaying(false), 1000);
    }
  };

  const sizeClasses = {
    small: 'p-3 min-h-[80px]',
    medium: 'p-4 min-h-[100px]',
    large: 'p-6 min-h-[120px]'
  };

  const textSizes = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={handlePlay}
      className={`
        ${sizeClasses[size]}
        bg-white rounded-2xl shadow-lg border-4 cursor-pointer
        flex flex-col items-center justify-center gap-2
        ${isCompleted 
          ? 'border-secondary shadow-secondary/30' 
          : 'border-primary/30 hover:border-primary'
        }
        ${className}
      `}
    >
      {/* Word Text */}
      <div className="flex items-center gap-2">
        <span className={`font-display font-bold text-primary ${textSizes[size]}`}>
          {word.text}
        </span>
        
        {/* Play Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`
            p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors
            ${isPlaying ? 'animate-pulse' : ''}
          `}
        >
          <ApperIcon 
            name={isPlaying ? "Volume2" : "Play"} 
            size={16} 
            className="text-primary" 
          />
        </motion.button>
      </div>

      {/* Letter Breakdown */}
      <div className="flex items-center gap-1">
        {word.letters.map((letter, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0.6 }}
            animate={isPlaying ? { 
              opacity: [0.6, 1, 0.6],
              scale: [1, 1.1, 1]
            } : { opacity: 0.6 }}
            transition={{ 
              delay: index * 0.2,
              duration: 0.4,
              repeat: isPlaying ? 1 : 0
            }}
            className="text-sm font-medium text-gray-600 bg-gray-100 rounded px-2 py-1"
          >
            {letter}
          </motion.span>
        ))}
      </div>

      {/* Completion Badge */}
      {isCompleted && (
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
          className="absolute -top-2 -right-2"
        >
          <div className="bg-secondary rounded-full p-1 shadow-lg">
            <ApperIcon name="Check" size={14} className="text-white" />
          </div>
        </motion.div>
      )}

      {/* Sound Wave Animation */}
      {isPlaying && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.3, 0], opacity: [0, 0.4, 0] }}
          transition={{ duration: 1, repeat: 2 }}
          className="absolute inset-0 border-4 border-accent rounded-2xl pointer-events-none"
        />
      )}
    </motion.div>
  );
};

export default WordTile;