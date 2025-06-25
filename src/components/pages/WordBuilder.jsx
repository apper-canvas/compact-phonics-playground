import { motion } from 'framer-motion';
import WordBuilderInterface from '@/components/organisms/WordBuilderInterface';

const WordBuilder = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full overflow-y-auto"
    >
      <WordBuilderInterface />
    </motion.div>
  );
};

export default WordBuilder;