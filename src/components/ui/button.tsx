import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'default',
  className = '',
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium theme-transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500/50 disabled:opacity-50 disabled:pointer-events-none rounded-xl relative overflow-hidden transform-gpu';
  
  const variants = {
    default: 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg hover:shadow-2xl glow-effect',
    outline: 'border-2 border-pink-500/30 hover:border-pink-500/50 glass-effect hover:glass-effect-strong text-gray-900 dark:text-gray-100 hover:text-pink-500 dark:hover:text-pink-400',
    ghost: 'hover:bg-gray-100/50 dark:hover:bg-gray-800/50 text-gray-900 dark:text-gray-100 theme-transition',
  };
  
  const sizes = {
    sm: 'h-9 px-4 py-2 text-sm',
    default: 'h-11 px-6 py-2',
    lg: 'h-14 px-8 py-3 text-lg',
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <motion.button
      whileHover={{ 
        scale: 1.02,
        y: -2,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ 
        scale: 0.98,
        y: 0,
        transition: { duration: 0.1, ease: "easeOut" }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={classes}
      {...props}
    >
      <span className="relative z-10 transition-all duration-300 ease-out">{children}</span>
      {variant === 'default' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-700 opacity-0 theme-transition hover:opacity-100" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 opacity-0"
            whileHover={{ opacity: 0.2 }}
            transition={{ duration: 0.3 }}
          />
        </>
      )}
    </motion.button>
  );
};