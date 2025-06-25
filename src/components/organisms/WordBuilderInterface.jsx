import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import wordService from '@/services/api/wordService';
import progressService from '@/services/api/progressService';

const WordBuilderInterface = ({ onBack }) => {
  const [availableLetters, setAvailableLetters] = useState(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']);
  const [wordSlots, setWordSlots] = useState([null, null, null]);
  const [completedWords, setCompletedWords] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [validationState, setValidationState] = useState('none'); // none, validating, valid, invalid
  const [draggedLetter, setDraggedLetter] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const word = wordSlots.filter(slot => slot !== null).join('');
    setCurrentWord(word);
    
    if (wordSlots.every(slot => slot !== null)) {
      validateWord(word);
    } else {
      setValidationState('none');
    }
  }, [wordSlots]);

  const validateWord = async (word) => {
    if (word.length !== 3) return;
    
    setValidationState('validating');
    setLoading(true);

    try {
      const foundWord = await wordService.validateWord(word.split(''));
      
      if (foundWord) {
        setValidationState('valid');
        
        // Add to completed words if not already there
        if (!completedWords.some(w => w.Id === foundWord.Id)) {
          setCompletedWords(prev => [...prev, foundWord]);
          
          // Update progress
          try {
            await progressService.addCompletedWord(foundWord.Id);
            toast.success(`Great! You built "${foundWord.text}"! 🎉`);
          } catch (error) {
            console.error('Failed to update progress:', error);
          }
        }
        
        // Reset after celebration
        setTimeout(() => {
          setWordSlots([null, null, null]);
          setValidationState('none');
        }, 2000);
      } else {
        setValidationState('invalid');
        
        // Reset after showing error
        setTimeout(() => {
          setWordSlots([null, null, null]);
          setValidationState('none');
        }, 1500);
      }
    } catch (error) {
      console.error('Validation error:', error);
      setValidationState('invalid');
    } finally {
      setLoading(false);
    }
  };

  const handleLetterClick = (letter) => {
    // Find first empty slot
    const emptySlotIndex = wordSlots.findIndex(slot => slot === null);
    if (emptySlotIndex !== -1) {
      const newSlots = [...wordSlots];
      newSlots[emptySlotIndex] = letter;
      setWordSlots(newSlots);
    }
  };

  const handleSlotClick = (index) => {
    // Remove letter from slot
    const newSlots = [...wordSlots];
    newSlots[index] = null;
    setWordSlots(newSlots);
  };

  const clearWord = () => {
    setWordSlots([null, null, null]);
    setValidationState('none');
  };

  const getSlotStyle = (index) => {
    const baseStyle = "w-16 h-16 md:w-20 md:h-20 border-4 rounded-2xl flex items-center justify-center cursor-pointer transition-all";
    
    if (validationState === 'valid') {
      return `${baseStyle} border-secondary bg-secondary/10 animate-pulse`;
    } else if (validationState === 'invalid') {
      return `${baseStyle} border-error bg-error/10 animate-wiggle`;
    } else if (wordSlots[index]) {
      return `${baseStyle} border-primary bg-primary/10`;
    } else {
      return `${baseStyle} border-gray-300 border-dashed bg-gray-50 hover:border-primary`;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button onClick={onBack} variant="ghost" size="small">
          <ApperIcon name="ArrowLeft" size={16} />
          Back
        </Button>
        
        <div className="text-center">
          <h2 className="text-xl font-display font-bold text-primary">
            Word Builder
          </h2>
          <p className="text-sm text-gray-600">
            Tap letters to build words
          </p>
        </div>
        
        <div className="text-right">
          <div className="text-lg font-bold text-accent">
            📝 {completedWords.length}
          </div>
        </div>
      </div>

      {/* Word Building Area */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h3 className="text-lg font-display font-bold text-center mb-4">
          Build a 3-letter word
        </h3>
        
        {/* Word Slots */}
        <div className="flex justify-center gap-3 mb-6">
          {wordSlots.map((letter, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSlotClick(index)}
              className={getSlotStyle(index)}
            >
              {letter && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="text-2xl font-display font-bold text-primary"
                >
                  {letter}
                </motion.span>
              )}
              
              {!letter && (
                <motion.div
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-gray-400"
                >
                  <ApperIcon name="Plus" size={20} />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Validation Feedback */}
        <AnimatePresence mode="wait">
          {validationState === 'validating' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center"
            >
              <ApperIcon name="Loader" size={24} className="text-primary mx-auto animate-spin" />
              <p className="text-gray-600 mt-2">Checking word...</p>
            </motion.div>
          )}
          
          {validationState === 'valid' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 360, 0] }}
                transition={{ duration: 0.8 }}
              >
                <ApperIcon name="CheckCircle" size={32} className="text-secondary mx-auto" />
              </motion.div>
              <p className="text-secondary font-bold mt-2">Perfect! 🎉</p>
            </motion.div>
          )}
          
          {validationState === 'invalid' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: [-10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <ApperIcon name="XCircle" size={32} className="text-error mx-auto" />
              </motion.div>
              <p className="text-error font-bold mt-2">Not a word - try again!</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Clear Button */}
        {wordSlots.some(slot => slot !== null) && (
          <div className="flex justify-center mt-4">
            <Button onClick={clearWord} variant="outline" size="small">
              <ApperIcon name="RotateCcw" size={16} />
              Clear
            </Button>
          </div>
        )}
      </div>

      {/* Letter Picker */}
      <div className="bg-white rounded-2xl shadow-lg p-4">
        <h4 className="text-md font-display font-bold text-center mb-4">
          Choose letters
        </h4>
        
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 max-w-full overflow-hidden">
          {availableLetters.map((letter, index) => (
            <motion.button
              key={letter}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleLetterClick(letter)}
              className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 hover:bg-primary/20 border-2 border-primary/30 hover:border-primary rounded-xl flex items-center justify-center transition-all"
            >
              <span className="text-lg font-display font-bold text-primary">
                {letter}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Completed Words */}
      {completedWords.length > 0 && (
        <div className="mt-6 bg-white rounded-2xl shadow-lg p-4">
          <h4 className="text-md font-display font-bold text-center mb-4">
            Words you've built 🏆
          </h4>
          
          <div className="flex flex-wrap justify-center gap-2">
            {completedWords.map((word, index) => (
              <motion.div
                key={word.Id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-secondary/10 border-2 border-secondary rounded-xl px-3 py-2"
              >
                <span className="text-sm font-bold text-secondary">
                  {word.text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WordBuilderInterface;