import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import StarRating from '@/components/atoms/StarRating';
import ProgressBar from '@/components/atoms/ProgressBar';
import progressService from '@/services/api/progressService';
import letterService from '@/services/api/letterService';
import wordService from '@/services/api/wordService';
import activityService from '@/services/api/activityService';

const ProgressDashboard = () => {
  const [progress, setProgress] = useState(null);
  const [letters, setLetters] = useState([]);
  const [words, setWords] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      setLoading(true);
      const [progressData, lettersData, wordsData, activitiesData] = await Promise.all([
        progressService.getProgress(),
        letterService.getAll(),
        wordService.getAll(),
        activityService.getRecentActivities()
      ]);

      setProgress(progressData || {
        completedLetters: [],
        completedWords: [],
        totalStars: 0,
        currentLevel: 1,
        streakDays: 0
      });
      setLetters(lettersData);
      setWords(wordsData);
      setRecentActivities(activitiesData);
    } catch (error) {
      console.error('Failed to load progress data:', error);
    } finally {
      setLoading(false);
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

  const completedLettersCount = progress?.completedLetters?.length || 0;
  const completedWordsCount = progress?.completedWords?.length || 0;
  const totalLetters = letters.length;
  const letterProgress = totalLetters > 0 ? (completedLettersCount / totalLetters) * 100 : 0;
  
  const achievements = [
    {
      id: 'first-letter',
      title: 'First Letter!',
      description: 'Completed your first letter',
      icon: 'BookOpen',
      unlocked: completedLettersCount >= 1,
      color: 'text-primary'
    },
    {
      id: 'five-letters',
      title: 'Letter Master',
      description: 'Completed 5 letters',
      icon: 'Star',
      unlocked: completedLettersCount >= 5,
      color: 'text-accent'
    },
    {
      id: 'first-word',
      title: 'Word Builder!',
      description: 'Built your first word',
      icon: 'Blocks',
      unlocked: completedWordsCount >= 1,
      color: 'text-secondary'
    },
    {
      id: 'alphabet-hero',
      title: 'Alphabet Hero',
      description: 'Completed all 26 letters',
      icon: 'Trophy',
      unlocked: completedLettersCount >= 26,
      color: 'text-error'
    }
  ];

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
      className="max-w-6xl mx-auto p-4 space-y-6"
    >
      {/* Header Stats */}
      <motion.div variants={itemVariants} className="text-center">
        <h2 className="text-3xl font-display font-bold text-primary mb-2">
          Your Progress 📊
        </h2>
        <p className="text-gray-600">
          Keep up the great work learning!
        </p>
      </motion.div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Stars */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -4 }}
          className="bg-white rounded-2xl shadow-lg p-6 text-center border-4 border-accent/30"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <ApperIcon name="Star" size={40} className="text-accent mx-auto mb-3" />
          </motion.div>
          <h3 className="text-2xl font-display font-bold text-accent">
            {progress?.totalStars || 0}
          </h3>
          <p className="text-gray-600">Stars Earned</p>
        </motion.div>

        {/* Letters */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -4 }}
          className="bg-white rounded-2xl shadow-lg p-6 text-center border-4 border-primary/30"
        >
          <ApperIcon name="BookOpen" size={40} className="text-primary mx-auto mb-3" />
          <h3 className="text-2xl font-display font-bold text-primary">
            {completedLettersCount}/{totalLetters}
          </h3>
          <p className="text-gray-600">Letters Learned</p>
        </motion.div>

        {/* Words */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -4 }}
          className="bg-white rounded-2xl shadow-lg p-6 text-center border-4 border-secondary/30"
        >
          <ApperIcon name="Blocks" size={40} className="text-secondary mx-auto mb-3" />
          <h3 className="text-2xl font-display font-bold text-secondary">
            {completedWordsCount}
          </h3>
          <p className="text-gray-600">Words Built</p>
        </motion.div>
      </div>

      {/* Progress Bar */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <h3 className="text-lg font-display font-bold text-gray-800 mb-4">
          Alphabet Progress
        </h3>
        <ProgressBar
          progress={completedLettersCount}
          max={totalLetters}
          variant="rainbow"
          size="large"
          showPercentage={true}
          animated={true}
        />
        <p className="text-center text-gray-600 mt-2">
          {Math.round(letterProgress)}% Complete
        </p>
      </motion.div>

      {/* Achievements */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <h3 className="text-lg font-display font-bold text-gray-800 mb-4">
          Achievements 🏆
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`
                p-4 rounded-xl border-2 transition-all
                ${achievement.unlocked 
                  ? 'bg-gradient-to-r from-accent/10 to-secondary/10 border-accent' 
                  : 'bg-gray-50 border-gray-200 opacity-60'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div className={`
                  p-2 rounded-full
                  ${achievement.unlocked ? 'bg-white shadow-md' : 'bg-gray-200'}
                `}>
                  <ApperIcon 
                    name={achievement.unlocked ? achievement.icon : 'Lock'} 
                    size={24} 
                    className={achievement.unlocked ? achievement.color : 'text-gray-400'} 
                  />
                </div>
                
                <div>
                  <h4 className="font-bold text-gray-800">
                    {achievement.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {achievement.description}
                  </p>
                </div>
                
                {achievement.unlocked && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                    className="ml-auto"
                  >
                    <ApperIcon name="Check" size={20} className="text-secondary" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activities */}
      {recentActivities.length > 0 && (
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-lg font-display font-bold text-gray-800 mb-4">
            Recent Activities 📚
          </h3>
          
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={activity.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
              >
                <div className="p-2 bg-primary/10 rounded-full">
                  <ApperIcon 
                    name={
                      activity.type === 'letter-sound' ? 'BookOpen' :
                      activity.type === 'word-building' ? 'Blocks' :
                      'Gamepad2'
                    }
                    size={16} 
                    className="text-primary" 
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 capitalize">
                    {activity.type.replace('-', ' ')}
                  </p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(activity.completedAt), 'MMM d, h:mm a')}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <StarRating stars={Math.ceil(activity.score / 20)} maxStars={5} size="small" />
                  <span className="text-sm font-bold text-accent">
                    {activity.score}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Encouragement */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-6 text-center"
      >
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ApperIcon name="Heart" size={32} className="text-error mx-auto mb-3" />
        </motion.div>
        <h3 className="text-xl font-display font-bold text-gray-800 mb-2">
          Keep Learning! 🌟
        </h3>
        <p className="text-gray-600">
          You're doing amazing! Every letter and word you learn makes you a better reader.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ProgressDashboard;