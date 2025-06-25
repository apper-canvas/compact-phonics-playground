import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import LetterGrid from "@/components/molecules/LetterGrid";
import letterService from "@/services/api/letterService";
import progressService from "@/services/api/progressService";
import ApperIcon from "@/components/atoms/ApperIcon";
import Button from "@/components/atoms/Button";
const Alphabet = () => {
  const [letters, setLetters] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [lettersData, progressData] = await Promise.all([
        letterService.getAll(),
        progressService.getProgress()
      ]);
      
      setLetters(lettersData);
      setProgress(progressData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load alphabet data');
    } finally {
      setLoading(false);
    }
  };

  const handleLetterClick = async (letter) => {
    try {
      // Play sound
      await letterService.playSound(letter.Id);
      
      // Mark as completed and update progress
      await letterService.markCompleted(letter.Id);
      const updatedProgress = await progressService.addCompletedLetter(letter.Id);
      
      // Update local state
      setLetters(prev => prev.map(l => 
        l.Id === letter.Id ? { ...l, completed: true } : l
      ));
      setProgress(updatedProgress);
      
      toast.success(`Great job learning the letter ${letter.character}! 🎉`);
    } catch (error) {
      console.error('Failed to handle letter click:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {[...Array(26)].map((_, i) => (
            <div key={i} className="flex justify-center">
              <div className="w-24 h-24 md:w-28 md:h-28 bg-gray-200 rounded-2xl animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <motion.div
          animate={{ rotate: [-5, 5, -5, 0] }}
          transition={{ duration: 0.5 }}
        >
          <ApperIcon name="AlertCircle" size={48} className="text-error mb-4" />
        </motion.div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Oops!</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={loadData} variant="primary">
          Try Again
        </Button>
      </div>
    );
  }

  if (letters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ApperIcon name="BookOpen" size={48} className="text-primary mb-4" />
        </motion.div>
        <h3 className="text-xl font-display font-bold text-gray-800 mb-2">
          Ready to Learn?
        </h3>
        <p className="text-gray-600">
          Let's start with the alphabet!
        </p>
      </div>
    );
  }

  const completedCount = progress?.completedLetters?.length || 0;
  const progressPercentage = (completedCount / letters.length) * 100;

  return (
    <div className="p-4 md:p-6 max-w-full overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-2xl md:text-3xl font-display font-bold text-primary mb-2">
          Learn the Alphabet! 🔤
        </h1>
        <p className="text-gray-600 mb-4">
          Tap each letter to hear its sound and see an example word
        </p>
        
        {/* Progress Indicator */}
        <div className="max-w-md mx-auto bg-white rounded-2xl p-4 shadow-lg border-4 border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Progress</span>
            <span className="text-sm font-bold text-accent">
              {completedCount}/{letters.length}
            </span>
          </div>
          
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full relative"
              style={{ minWidth: progressPercentage > 0 ? '8px' : '0' }}
            >
              {/* Shine effect */}
              {progressPercentage > 0 && (
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    repeatDelay: 3,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
              )}
            </motion.div>
          </div>
          
          <div className="text-center mt-2">
            <span className="text-xs text-gray-500">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
        </div>
      </motion.div>

      {/* Letters Grid */}
      <LetterGrid
        letters={letters}
        onLetterClick={handleLetterClick}
        completedLetters={progress?.completedLetters || []}
      />

      {/* Encouragement Message */}
      {completedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <div className="bg-gradient-to-r from-accent/10 via-secondary/10 to-primary/10 rounded-2xl p-6 max-w-md mx-auto">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <ApperIcon name="Star" size={32} className="text-accent mx-auto mb-3" />
            </motion.div>
            <h3 className="text-lg font-display font-bold text-gray-800 mb-2">
              Amazing Work! 🌟
            </h3>
            <p className="text-gray-600 text-sm">
              You've learned {completedCount} letter{completedCount !== 1 ? 's' : ''}! 
              {completedCount >= 5 && " You're becoming a reading superstar!"}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Alphabet;