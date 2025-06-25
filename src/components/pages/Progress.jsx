import { motion } from 'framer-motion';
import ProgressDashboard from '@/components/organisms/ProgressDashboard';

const Progress = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full overflow-y-auto"
    >
      <ProgressDashboard />
    </motion.div>
  );
};

export default Progress;