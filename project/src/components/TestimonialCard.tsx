import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
  delay?: number;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ name, role, content, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 40 }}
    whileInView={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ 
      duration: 0.6, 
      delay,
      ease: [0.25, 0.46, 0.45, 0.94]
    }}
    viewport={{ once: true, margin: "-30px" }}
    whileHover={{
      y: -5,
      scale: 1.02,
      transition: { duration: 0.3, ease: "easeOut" }
    }}
    className="glass-effect p-8 rounded-2xl hover:glass-effect-strong theme-transition hover-lift transform-gpu group"
  >
    {/* Stars with stagger animation */}
    <motion.div 
      className="mb-6 flex gap-1"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: delay + 0.2 }}
      viewport={{ once: true }}
    >
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ 
            duration: 0.4, 
            delay: delay + 0.3 + (i * 0.1),
            ease: "easeOut"
          }}
          viewport={{ once: true }}
          whileHover={{ 
            scale: 1.2, 
            rotate: 360,
            transition: { duration: 0.3 }
          }}
        >
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 transition-all duration-300" />
        </motion.div>
      ))}
    </motion.div>
    
    {/* Quote with typewriter effect simulation */}
    <motion.blockquote 
      className="mb-6 text-lg leading-relaxed text-gray-900 dark:text-gray-100 theme-transition"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ 
        duration: 0.8, 
        delay: delay + 0.4,
        ease: "easeOut"
      }}
      viewport={{ once: true }}
    >
      <motion.span
        initial={{ width: 0 }}
        whileInView={{ width: "100%" }}
        transition={{ duration: 1.2, delay: delay + 0.5 }}
        viewport={{ once: true }}
        className="inline-block overflow-hidden"
      >
        "{content}"
      </motion.span>
    </motion.blockquote>
    
    {/* Author info with slide-in effect */}
    <motion.div 
      className="flex items-center gap-4"
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: delay + 0.6,
        ease: "easeOut"
      }}
      viewport={{ once: true }}
    >
      {/* Avatar with pulse effect */}
      <motion.div 
        className="h-12 w-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg"
        whileHover={{ 
          scale: 1.1,
          rotate: [0, -5, 5, 0],
          transition: { duration: 0.4 }
        }}
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ 
          duration: 0.4, 
          delay: delay + 0.7,
          ease: "easeOut"
        }}
        viewport={{ once: true }}
      >
        {name.charAt(0)}
      </motion.div>
      
      <div>
        <motion.div 
          className="font-semibold text-gray-900 dark:text-gray-100 theme-transition"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.4, 
            delay: delay + 0.8,
            ease: "easeOut"
          }}
          viewport={{ once: true }}
        >
          {name}
        </motion.div>
        <motion.div 
          className="text-sm text-gray-600 dark:text-gray-400 theme-transition"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.4, 
            delay: delay + 0.9,
            ease: "easeOut"
          }}
          viewport={{ once: true }}
        >
          {role}
        </motion.div>
      </div>
    </motion.div>
    
    {/* Subtle glow effect on hover */}
    <motion.div
      className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      initial={false}
    />
  </motion.div>
);