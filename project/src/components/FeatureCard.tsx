import React from 'react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 60, scale: 0.9 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ 
      duration: 0.7, 
      delay,
      ease: [0.25, 0.46, 0.45, 0.94]
    }}
    viewport={{ once: true, margin: "-50px" }}
    whileHover={{
      y: -8,
      scale: 1.02,
      transition: { duration: 0.3, ease: "easeOut" }
    }}
    className="group relative overflow-hidden glass-effect p-8 rounded-2xl hover:glass-effect-strong theme-transition hover-lift transform-gpu"
  >
    {/* Animated background gradient */}
    <motion.div 
      className="absolute -right-20 -top-20 h-40 w-40 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-full group-hover:from-pink-500/20 group-hover:to-purple-500/20 theme-transition"
      animate={{
        rotate: [0, 360],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }}
    />
    
    {/* Shimmer effect */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer" 
           style={{
             background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
             animation: 'shimmer 2s infinite'
           }} />
    </div>
    
    <div className="relative z-10">
      {/* Icon with enhanced animation */}
      <motion.div 
        className="mb-6 inline-flex h-16 w-16 items-center justify-center bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-2xl shadow-lg glow-effect"
        whileHover={{
          rotate: [0, -10, 10, 0],
          scale: 1.1,
          transition: { duration: 0.5, ease: "easeInOut" }
        }}
        initial={{ scale: 0, rotate: -180 }}
        whileInView={{ scale: 1, rotate: 0 }}
        transition={{ 
          duration: 0.6, 
          delay: delay + 0.2,
          ease: "easeOut"
        }}
        viewport={{ once: true }}
      >
        {icon}
      </motion.div>
      
      {/* Title with stagger animation */}
      <motion.h3 
        className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100 theme-transition"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ 
          duration: 0.5, 
          delay: delay + 0.3,
          ease: "easeOut"
        }}
        viewport={{ once: true }}
      >
        {title}
      </motion.h3>
      
      {/* Description with fade-in */}
      <motion.p 
        className="text-gray-600 dark:text-gray-400 leading-relaxed theme-transition"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          delay: delay + 0.4,
          ease: "easeOut"
        }}
        viewport={{ once: true }}
      >
        {description}
      </motion.p>
      
      {/* Hover indicator */}
      <motion.div
        className="mt-6 flex items-center gap-2 text-sm font-medium text-pink-500 opacity-0 group-hover:opacity-100 transition-all duration-300"
        initial={{ x: -10 }}
        whileHover={{ x: 0 }}
      >
        <span>Learn more</span>
        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          →
        </motion.div>
      </motion.div>
    </div>
  </motion.div>
);