import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import LetterCard from '@/components/atoms/LetterCard';
import letterService from '@/services/api/letterService';
import progressService from '@/services/api/progressService';

const LetterSoundGame = ({ onComplete, onBack }) => {
  const [gameState, setGameState] = useState('playing'); // playing, correct, wrong, complete
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [loading, setLoading] = useState(true);
  const [letters, setLetters] = useState([]);

  const totalQuestions = 5;

  useEffect(() => {
    loadLetters();
  }, []);

  const loadLetters = async () => {
    try {
      setLoading(true);
      const allLetters = await letterService.getAll();
      setLetters(allLetters);
      generateQuestion(allLetters);
    } catch (error) {
      toast.error('Failed to load letters');
    } finally {
      setLoading(false);
    }
  };

  const generateQuestion = (availableLetters) => {
    if (availableLetters.length < 4) return;

    // Pick a random letter as the correct answer
    const correctLetter = availableLetters[Math.floor(Math.random() * availableLetters.length)];
    
    // Pick 3 other random letters as wrong options
    const wrongOptions = availableLetters
      .filter(l => l.Id !== correctLetter.Id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    // Shuffle all options
    const allOptions = [correctLetter, ...wrongOptions].sort(() => Math.random() - 0.5);

    setCurrentQuestion(correctLetter);
    setOptions(allOptions);
    setGameState('playing');
  };

  const handleAnswer = async (selectedLetter) => {
    const isCorrect = selectedLetter.Id === currentQuestion.Id;
    
    if (isCorrect) {
      setGameState('correct');
      setScore(score + 1);
      
      // Award progress
      try {
        await progressService.addCompletedLetter(selectedLetter.Id);
        await progressService.awardStars(1);
      } catch (error) {
        console.error('Failed to update progress:', error);
      }
    } else {
      setGameState('wrong');
    }

    // Move to next question after delay
    setTimeout(() => {
      const newQuestionsAnswered = questionsAnswered + 1;
      setQuestionsAnswered(newQuestionsAnswered);

      if (newQuestionsAnswered >= totalQuestions) {
        setGameState('complete');
        if (onComplete) {
          onComplete({ score: score + (isCorrect ? 1 : 0), total: totalQuestions });
        }
      } else {
        generateQuestion(letters);
      }
    }, 1500);
  };

  const playLetterSound = async (letter) => {
    try {
      await letterService.playSound(letter.Id);
      // In a real app, this would play actual audio
      console.log(`Playing sound for letter: ${letter.character}`);
    } catch (error) {
      console.error('Failed to play sound:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <ApperIcon name="Loader" size={32} className="text-primary" />
        </motion.div>
      </div>
    );
  }

  if (gameState === 'complete') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-6"
        >
          <ApperIcon name="Trophy" size={64} className="text-accent mx-auto" />
        </motion.div>
        
        <h2 className="text-3xl font-display font-bold text-primary mb-4">
          Great Job!
        </h2>
        
        <p className="text-lg text-gray-600 mb-6">
          You scored {score} out of {totalQuestions}!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => window.location.reload()} variant="primary">
            Play Again
          </Button>
          <Button onClick={onBack} variant="outline">
            Back to Games
          </Button>
        </div>
      </motion.div>
    );
  }

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
            Letter Sound Game
          </h2>
          <p className="text-sm text-gray-600">
            Question {questionsAnswered + 1} of {totalQuestions}
          </p>
        </div>
        
        <div className="text-right">
          <div className="text-lg font-bold text-accent">
            ⭐ {score}
          </div>
        </div>
      </div>

      {/* Question */}
      {currentQuestion && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center mb-8"
          >
            <h3 className="text-2xl font-display font-bold text-gray-800 mb-4">
              Which letter makes the sound:
            </h3>
            
            {/* Sound Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => playLetterSound(currentQuestion)}
              className="bg-accent text-white rounded-full px-8 py-4 text-3xl font-bold shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-3">
                <ApperIcon name="Volume2" size={24} />
                {currentQuestion.sound}
              </div>
            </motion.button>
            
            <p className="text-gray-600 mt-2">
              Tap to hear the sound again
            </p>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Options */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {options.map((letter, index) => (
          <motion.div
            key={letter.Id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex justify-center"
          >
            <LetterCard
              letter={letter}
              onClick={() => handleAnswer(letter)}
              showSound={false}
              size="large"
              className={`
                ${gameState === 'correct' && letter.Id === currentQuestion.Id 
                  ? 'border-secondary shadow-secondary/50' 
                  : ''
                }
                ${gameState === 'wrong' && letter.Id === currentQuestion.Id 
                  ? 'border-error shadow-error/50' 
                  : ''
                }
              `}
            />
          </motion.div>
        ))}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {gameState === 'correct' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6 }}
            >
              <ApperIcon name="CheckCircle" size={48} className="text-secondary mx-auto mb-2" />
            </motion.div>
            <h3 className="text-xl font-bold text-secondary">Correct! 🎉</h3>
          </motion.div>
        )}
        
        {gameState === 'wrong' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: [-5, 5, -5, 0] }}
              transition={{ duration: 0.5 }}
            >
              <ApperIcon name="XCircle" size={48} className="text-error mx-auto mb-2" />
            </motion.div>
            <h3 className="text-xl font-bold text-error">Try again!</h3>
            <p className="text-gray-600">
              The correct answer was: <strong>{currentQuestion.character}</strong>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LetterSoundGame;