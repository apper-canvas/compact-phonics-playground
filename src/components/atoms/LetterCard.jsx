import { motion } from "framer-motion";
import React, { useState } from "react";
import { toast } from "react-toastify";
import audioService from "@/services/audioService";
import ApperIcon from "@/components/ApperIcon";

export default function LetterCard({ 
  letter, 
  onClick, 
  isCompleted = false, 
  size = 'medium',
  className = '',
  showSound = true,
  playSound = true
}) => {
const [isPlaying, setIsPlaying] = useState(false);

  const sizeClasses = {
    small: 'w-16 h-16 text-lg',
    medium: 'w-20 h-20 text-xl',
    large: 'w-24 h-24 text-2xl'
  };

  const cardVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
    playing: { 
      scale: [1, 1.2, 1], 
      rotate: [0, 5, -5, 0],
      transition: { duration: 0.6, times: [0, 0.3, 0.7, 1] }
    }
  };

  const handleClick = async () => {
    if (onClick) {
      onClick(letter);
    }

    if (playSound) {
      try {
        setIsPlaying(true);
        const audioUrl = letter.audioUrl || `/sounds/letters/${letter.character?.toLowerCase()}.mp3`;
        await audioService.playSound(audioUrl);
      } catch (error) {
        console.error('Error playing letter sound:', error);
        toast.error(`Audio not available for "${letter.character}"`, {
          position: 'bottom-right',
          autoClose: 2000,
          hideProgressBar: true
        });
      } finally {
        setIsPlaying(false);
      }
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