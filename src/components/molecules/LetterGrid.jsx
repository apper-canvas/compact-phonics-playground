import { motion } from 'framer-motion';
import LetterCard from '@/components/atoms/LetterCard';

const LetterGrid = ({ 
  letters = [], 
  onLetterClick, 
  completedLetters = [],
  className = ''
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
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
      className={`
        grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6
        gap-4 md:gap-6 p-4 max-w-full
        ${className}
      `}
    >
      {letters.map((letter) => (
        <motion.div
          key={letter.Id}
          variants={itemVariants}
          whileHover={{ y: -4 }}
          className="flex justify-center"
        >
          <LetterCard
            letter={letter}
            onClick={onLetterClick}
            isCompleted={completedLetters.includes(letter.Id)}
            size="large"
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default LetterGrid;