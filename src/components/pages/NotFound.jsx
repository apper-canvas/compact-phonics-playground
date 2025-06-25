import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto"
      >
        {/* Animated 404 Icon */}
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            y: [0, -10, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            repeatDelay: 1
          }}
          className="mb-6"
        >
          <ApperIcon 
            name="HelpCircle" 
            size={80} 
            className="text-primary mx-auto" 
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-display font-bold text-primary mb-4"
        >
          Oops! 404
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-gray-600 mb-8"
        >
          Looks like this page went on an adventure! 
          Let's get you back to learning.
        </motion.p>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button 
            onClick={handleGoHome}
            variant="primary"
            size="large"
            className="px-8"
          >
            <ApperIcon name="Home" size={20} />
            Back to Alphabet
          </Button>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex justify-center gap-4"
        >
          {['Star', 'Heart', 'Smile'].map((icon, index) => (
            <motion.div
              key={icon}
              animate={{ 
                y: [0, -8, 0],
                rotate: [0, 15, -15, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                delay: index * 0.3,
                repeatDelay: 1
              }}
            >
              <ApperIcon 
                name={icon} 
                size={24} 
                className="text-accent" 
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;