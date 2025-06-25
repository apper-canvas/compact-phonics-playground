import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GameCard from "@/components/molecules/GameCard";
import LetterSoundGame from "@/components/organisms/LetterSoundGame";
import ApperIcon from "@/components/atoms/ApperIcon";
import progressService from "@/services/api/progressService";
import activityService from "@/services/api/activityService";
const Games = () => {
  const [currentGame, setCurrentGame] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const progressData = await progressService.getProgress();
      setProgress(progressData);
    } catch (error) {
      console.error('Failed to load progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGameComplete = async (gameResult) => {
    try {
      // Save activity
      await activityService.create({
        type: currentGame,
        score: Math.round((gameResult.score / gameResult.total) * 100),
        timeSpent: 0 // Would track actual time in real app
      });

      // Award bonus stars for high scores
      if (gameResult.score === gameResult.total) {
        await progressService.awardStars(3); // Perfect score bonus
      } else if (gameResult.score >= gameResult.total * 0.8) {
        await progressService.awardStars(2); // Good score bonus
      } else {
        await progressService.awardStars(1); // Participation
      }

      // Reload progress
      await loadProgress();
    } catch (error) {
      console.error('Failed to save game result:', error);
    }
  };

  const games = [
    {
      id: 'letter-sound-match',
      title: 'Letter Sound Match',
      description: 'Listen to sounds and pick the right letter. Perfect for learning phonics!',
      icon: 'Volume2',
      difficulty: 1,
      minLetters: 3,
      component: LetterSoundGame
    },
    {
      id: 'rhyme-time',
      title: 'Rhyme Time',
      description: 'Find words that rhyme together. Coming soon!',
      icon: 'Music',
      difficulty: 2,
      minLetters: 8,
      component: null
    },
    {
      id: 'word-hunt',
      title: 'Word Hunt',
      description: 'Find hidden words in a grid of letters. Coming soon!',
      icon: 'SearchIcon',
      difficulty: 3,
      minLetters: 15,
      component: null
    }
  ];

  const completedLetters = progress?.completedLetters?.length || 0;

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

  // Show game interface if a game is selected
  if (currentGame) {
    const game = games.find(g => g.id === currentGame);
    const GameComponent = game?.component;
    
    if (GameComponent) {
      return (
        <GameComponent
          onComplete={handleGameComplete}
          onBack={() => setCurrentGame(null)}
        />
      );
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 md:p-6 max-w-4xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-primary mb-2">
          Fun Learning Games! 🎮
        </h1>
        <p className="text-gray-600 mb-4">
          Play games to practice what you've learned
        </p>
        
        {/* Progress Indicator */}
        <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-lg border-2 border-primary/20">
          <ApperIcon name="Trophy" size={20} className="text-accent" />
          <span className="text-sm font-medium">
            {completedLetters} letters completed
          </span>
        </div>
      </motion.div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {games.map((game, index) => {
          const isLocked = completedLetters < game.minLetters;
          
          return (
            <motion.div key={game.id} variants={itemVariants}>
              <GameCard
                title={game.title}
                description={game.description}
                icon={game.icon}
                difficulty={game.difficulty}
                isLocked={isLocked}
                onPlay={() => {
                  if (!isLocked && game.component) {
                    setCurrentGame(game.id);
                  }
                }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Unlock Message */}
      {completedLetters < 15 && (
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-accent/10 via-secondary/10 to-primary/10 rounded-2xl p-6 text-center"
        >
          <motion.div
            animate={{ bounce: [0, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
          >
            <ApperIcon name="Gift" size={32} className="text-primary mx-auto mb-3" />
          </motion.div>
          <h3 className="text-lg font-display font-bold text-gray-800 mb-2">
            More Games Coming! 🎁
          </h3>
          <p className="text-gray-600 text-sm">
            Complete more letters to unlock additional games and activities.
            Keep learning to discover all the fun!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Games;