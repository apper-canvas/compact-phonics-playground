import { motion } from 'framer-motion';
import { forwardRef } from 'react';

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  className = '',
  onClick,
  ...props 
}, ref) => {
  const baseClasses = 'child-button rounded-full font-bold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/30 flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 shadow-lg hover:shadow-xl',
    accent: 'bg-accent text-white hover:bg-accent/90 shadow-lg hover:shadow-xl',
    surface: 'bg-surface text-gray-800 hover:bg-surface/90 shadow-md hover:shadow-lg',
    outline: 'border-3 border-primary text-primary hover:bg-primary hover:text-white',
    ghost: 'text-primary hover:bg-primary/10'
  };

  const sizes = {
    small: 'px-4 py-2 text-sm min-h-[44px]',
    medium: 'px-6 py-3 text-base min-h-[52px]',
    large: 'px-8 py-4 text-lg min-h-[60px]'
  };

  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed hover:transform-none' 
    : '';

  // Filter out custom props before passing to motion.button
  const { variant: _, size: __, ...filteredProps } = props;

  return (
    <motion.button
      ref={ref}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...filteredProps}
    >
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;