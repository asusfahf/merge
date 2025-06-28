import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ className = '', ...props }) => {
  const classes = `flex h-11 w-full rounded-xl border border-gray-300/50 dark:border-gray-600/50 glass-effect px-3 py-2 text-sm text-gray-900 dark:text-gray-100 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/50 focus-visible:ring-offset-2 focus-visible:border-pink-500/50 disabled:cursor-not-allowed disabled:opacity-50 theme-transition ${className}`;
  
  return <input className={classes} {...props} />;
};