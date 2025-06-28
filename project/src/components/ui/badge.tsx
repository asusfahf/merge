import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default', 
  className = '' 
}) => {
  const variants = {
    default: 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm',
    secondary: 'glass-effect text-gray-800 dark:text-gray-200 theme-transition',
  };
  
  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold theme-transition ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};