import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Brain, 
  GraduationCap, 
  Users, 
  Heart, 
  ArrowRight,
  BookOpen,
  Award,
  Home,
  Sparkles
} from 'lucide-react';
import { Button } from '../ui/Button';
import { StudentDataForm } from './forms/StudentDataForm';
import { TeacherDataForm } from './forms/TeacherDataForm';
import { ParentDataForm } from './forms/ParentDataForm';
import { useUser } from '@/context/UserContext';
import { useNavigate } from 'react-router-dom';


type UserRole = 'student' | 'teacher' | 'parent';

interface RoleSelectionPageProps {
  onClose?: () => void;
}

const roles = [
  {
    id: 'student' as UserRole,
    title: 'Student',
    subtitle: 'I want to learn and grow',
    description: 'Access your personalized learning dashboard, track progress, and get AI-powered help with your studies.',
    icon: GraduationCap,
    gradient: 'from-blue-500 to-cyan-500',
    glowColor: 'shadow-blue-500/20',
    features: [
      'Smart study planner',
      'AI tutor & mentor',
      'Progress tracking',
      'Distraction-free interface'
    ]
  },
  {
    id: 'teacher' as UserRole,
    title: 'Teacher',
    subtitle: 'I want to inspire and educate',
    description: 'Streamline your teaching with AI-powered insights, automated feedback, and comprehensive student analytics.',
    icon: Users,
    gradient: 'from-green-500 to-emerald-500',
    glowColor: 'shadow-green-500/20',
    features: [
      'Student analytics dashboard',
      'AI-powered feedback',
      'Content management',
      'Class performance insights'
    ]
  },
  {
    id: 'parent' as UserRole,
    title: 'Parent',
    subtitle: 'I want to support my child',
    description: 'Stay connected with your child\'s learning journey through beautiful progress cards and AI-powered insights.',
    icon: Heart,
    gradient: 'from-pink-500 to-purple-500',
    glowColor: 'shadow-pink-500/20',
    features: [
      'Family progress cards',
      'Learning insights',
      'AI parenting guidance',
      'Achievement tracking'
    ]
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 60,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const cardHoverVariants = {
  rest: {
    scale: 1,
    y: 0,
    rotateY: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.03,
    y: -12,
    rotateY: 5,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  tap: {
    scale: 0.98,
    y: -8,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
};

const featureVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

export const RoleSelectionPage: React.FC<RoleSelectionPageProps> = ({ onClose }) => {
  const { setRole } = useUser();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [showDataForm, setShowDataForm] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<UserRole | null>(null);
 
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setShowDataForm(true);
    setRole(role);
    navigate("/login");
  };

  const handleBackToRoles = () => {
    setShowDataForm(false);
    setSelectedRole(null);
  };

  const renderDataForm = () => {
    if (!selectedRole) return null;

    switch (selectedRole) {
      case 'student':
        return <StudentDataForm onBack={handleBackToRoles} onClose={onClose} />;
      case 'teacher':
        return <TeacherDataForm onBack={handleBackToRoles} onClose={onClose} />;
      case 'parent':
        return <ParentDataForm onBack={handleBackToRoles} onClose={onClose} />;
      default:
        return null;
    }
  };

  if (showDataForm) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="data-form"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {renderDataForm()}
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/20 flex items-center justify-center p-6 theme-transition overflow-hidden">
      {/* Escape Button */}
      {onClose && (
        <motion.button
          onClick={onClose}
          className="fixed top-6 right-6 z-50 h-12 w-12 rounded-full glass-effect shadow-lg hover:shadow-xl theme-transition flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          whileHover={{ 
            scale: 1.1, 
            rotate: 90,
            transition: { duration: 0.3 }
          }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <X className="h-6 w-6" />
        </motion.button>
      )}

      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/10 dark:bg-pink-500/5 mix-blend-normal filter blur-[128px]"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 mix-blend-normal filter blur-[128px]"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            opacity: [0.6, 0.3, 0.6]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/5 mix-blend-normal filter blur-[96px] transform -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div 
        className="w-full max-w-7xl relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="text-center mb-16"
        >
          <motion.div 
            className="flex items-center justify-center gap-3 mb-8"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="h-16 w-16 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg glow-effect"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(236, 72, 153, 0.3)",
                  "0 0 40px rgba(147, 51, 234, 0.4)",
                  "0 0 20px rgba(236, 72, 153, 0.3)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Brain className="h-8 w-8 text-white" />
              </motion.div>
            </motion.div>
            <motion.span 
              className="font-bold text-3xl gradient-text"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Rafiq
            </motion.span>
          </motion.div>
          
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6 theme-transition"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Choose Your Path
          </motion.h1>
          
          <motion.p
            className="text-xl text-gray-600 dark:text-gray-400 theme-transition max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Tell us who you are so we can personalize your Rafiq experience
          </motion.p>
          
          {/* Floating sparkles */}
          <motion.div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 2) * 20}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5
                }}
              >
                <Sparkles className="h-4 w-4 text-pink-400" />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Role Cards */}
        <motion.div 
          className="grid gap-8 md:grid-cols-3 mb-16 perspective-1000"
          variants={containerVariants}
        >
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <motion.div
                key={role.id}
                variants={itemVariants}
                custom={index}
                className="group relative overflow-hidden transform-gpu"
                onHoverStart={() => setHoveredCard(role.id)}
                onHoverEnd={() => setHoveredCard(null)}
              >
                <motion.div 
                  className={`glass-effect-strong p-8 rounded-3xl cursor-pointer h-full transition-all duration-500 hover:glass-effect ${role.glowColor} hover:shadow-2xl`}
                  variants={cardHoverVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => handleRoleSelect(role.id)}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  
                  {/* Enhanced Gradient Background */}
                  <motion.div 
                    className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${role.gradient} opacity-10 rounded-full`}
                    animate={{
                      scale: hoveredCard === role.id ? [1, 1.3, 1] : 1,
                      opacity: hoveredCard === role.id ? [0.1, 0.3, 0.1] : 0.1,
                      rotate: [0, 360]
                    }}
                    transition={{
                      scale: { duration: 2, ease: "easeInOut" },
                      opacity: { duration: 2, ease: "easeInOut" },
                      rotate: { duration: 20, repeat: Infinity, ease: "linear" }
                    }}
                  />
                  
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    initial={false}
                    animate={hoveredCard === role.id ? { opacity: 1 } : { opacity: 0 }}
                  >
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                      style={{
                        animation: hoveredCard === role.id ? 'shimmer 1.5s ease-in-out' : 'none'
                      }}
                    />
                  </motion.div>
                  
                  <div className="relative z-10">
                    {/* Enhanced Icon */}
                    <motion.div 
                      className={`mb-6 inline-flex h-16 w-16 items-center justify-center bg-gradient-to-br ${role.gradient} text-white rounded-2xl shadow-lg glow-effect`}
                      whileHover={{
                        rotate: [0, -10, 10, 0],
                        scale: 1.15,
                        transition: { duration: 0.6, ease: "easeInOut" }
                      }}
                      animate={{
                        boxShadow: hoveredCard === role.id 
                          ? ["0 0 20px rgba(59, 130, 246, 0.3)", "0 0 40px rgba(59, 130, 246, 0.5)", "0 0 20px rgba(59, 130, 246, 0.3)"]
                          : "0 0 20px rgba(59, 130, 246, 0.2)"
                      }}
                      transition={{
                        boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      }}
                    >
                      <Icon className="h-8 w-8" />
                    </motion.div>
                    
                    {/* Content */}
                    <motion.h3 
                      className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 theme-transition"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                    >
                      {role.title}
                    </motion.h3>
                    
                    <motion.p 
                      className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4 theme-transition"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    >
                      {role.subtitle}
                    </motion.p>
                    
                    <motion.p 
                      className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed theme-transition"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                    >
                      {role.description}
                    </motion.p>
                    
                    {/* Enhanced Features */}
                    <motion.ul className="space-y-3 mb-6">
                      {role.features.map((feature, featureIndex) => (
                        <motion.li
                          key={featureIndex}
                          variants={featureVariants}
                          custom={featureIndex}
                          initial="hidden"
                          animate="visible"
                          className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 theme-transition"
                        >
                          <motion.div 
                            className={`h-2 w-2 bg-gradient-to-r ${role.gradient} rounded-full`}
                            whileHover={{ scale: 1.5 }}
                            animate={hoveredCard === role.id ? {
                              scale: [1, 1.3, 1],
                              opacity: [0.7, 1, 0.7]
                            } : {}}
                            transition={{
                              duration: 1.5,
                              repeat: hoveredCard === role.id ? Infinity : 0,
                              ease: "easeInOut"
                            }}
                          />
                          <motion.span 
                            className="group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-300"
                            whileHover={{ x: 5 }}
                          >
                            {feature}
                          </motion.span>
                        </motion.li>
                      ))}
                    </motion.ul>

                    {/* Enhanced hover indicator */}
                    <motion.div 
                      className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500"
                      initial={{ y: 20 }}
                      animate={hoveredCard === role.id ? { y: 0 } : { y: 20 }}
                    >
                      <motion.div 
                        className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 px-4 py-2 rounded-full backdrop-blur-sm"
                        whileHover={{ scale: 1.05 }}
                      >
                        <span>Click to continue</span>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Enhanced Bottom Section */}
        <motion.div
          variants={itemVariants}
          className="text-center"
        >
          <motion.div 
            className="glass-effect p-8 rounded-3xl max-w-2xl mx-auto hover:glass-effect-strong transition-all duration-500"
            whileHover={{ 
              scale: 1.02,
              y: -5,
              transition: { duration: 0.3 }
            }}
          >
            <motion.div 
              className="flex items-center justify-center gap-2 mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <div className="flex items-center gap-1">
                {[BookOpen, Award, Home].map((Icon, index) => (
                  <motion.div
                    key={index}
                    className="h-8 w-8 rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center"
                    whileHover={{ 
                      scale: 1.2, 
                      rotate: 360,
                      transition: { duration: 0.5 }
                    }}
                    animate={{
                      y: [0, -5, 0],
                    }}
                    transition={{
                      duration: 2 + index * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.2
                    }}
                  >
                    <Icon className="h-4 w-4 text-pink-500" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.p 
              className="text-sm text-gray-600 dark:text-gray-400 theme-transition leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              Not sure which role fits you best? Don't worry! You can always change your preferences later in your account settings.
            </motion.p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};