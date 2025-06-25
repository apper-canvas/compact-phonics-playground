import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const GameCard = ({ 
  title, 
  description, 
  icon, 
  difficulty = 1,
  isLocked = false,
  onPlay,
  className = ''
}) => {
  const difficultyColors = {
    1: 'bg-secondary',
    2: 'bg-accent',
    3: 'bg-error'
  };

  const difficultyLabels = {
    1: 'Easy',
    2: 'Medium',
    3: 'Hard'
  };

  return (
    <motion.div
      whileHover={!isLocked ? { scale: 1.02, y: -4 } : {}}
      className={`
        bg-white rounded-2xl shadow-lg border-4 p-6
        ${isLocked 
          ? 'border-gray-300 opacity-60' 
          : 'border-primary/30 hover:border-primary hover:shadow-xl'
        }
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`
            p-3 rounded-2xl 
            ${isLocked ? 'bg-gray-200' : 'bg-primary/10'}
          `}>
            <ApperIcon 
              name={isLocked ? 'Lock' : icon} 
              size={24} 
              className={isLocked ? 'text-gray-400' : 'text-primary'} 
            />
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-gray-800">
              {title}
            </h3>
            <div className={`
              inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white
              ${difficultyColors[difficulty]}
            `}>
              <ApperIcon name="Zap" size={12} />
              {difficultyLabels[difficulty]}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-6 text-sm leading-relaxed">
        {description}
      </p>

      {/* Action Button */}
      <Button
        variant={isLocked ? 'ghost' : 'primary'}
        size="medium"
        disabled={isLocked}
        onClick={onPlay}
        className="w-full"
      >
        {isLocked ? (
          <>
            <ApperIcon name="Lock" size={16} />
            Complete more letters to unlock
          </>
        ) : (
          <>
            <ApperIcon name="Play" size={16} />
            Play Game
          </>
        )}
      </Button>

      {/* Locked Overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-white/20 rounded-2xl flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ApperIcon name="Lock" size={32} className="text-gray-400" />
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default GameCard;