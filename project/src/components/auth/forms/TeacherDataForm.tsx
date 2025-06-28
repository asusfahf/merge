import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  X, 
  User, 
  Mail, 
  Lock, 
  Users, 
  GraduationCap,
  MapPin,
  Eye,
  EyeOff,
  CheckCircle,
  BookOpen,
  Award
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Card, CardContent } from '../../ui/Card';

interface TeacherFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  school: string;
  subjects: string[];
  gradeLevel: string;
  experience: string;
  classSize: string;
  teachingStyle: string;
  goals: string;
  agreeToTerms: boolean;
}

interface TeacherDataFormProps {
  onBack: () => void;
  onClose?: () => void;
}

const subjects = [
  'Mathematics', 'Science', 'English', 'History', 'Foreign Languages',
  'Computer Science', 'Art', 'Music', 'Physical Education', 'Psychology',
  'Economics', 'Biology', 'Chemistry', 'Physics', 'Literature', 'Social Studies'
];

const gradeLevels = [
  'Elementary (K-5)', 'Middle School (6-8)', 'High School (9-12)', 
  'College/University', 'Adult Education', 'Special Education', 'Mixed Grades'
];

const experienceLevels = [
  'New Teacher (0-2 years)', 'Early Career (3-5 years)', 
  'Experienced (6-10 years)', 'Veteran (11-20 years)', 'Master Teacher (20+ years)'
];

const classSizes = [
  '1-10 students', '11-20 students', '21-30 students', 
  '31-40 students', '40+ students', 'Varies by class'
];

const teachingStyles = [
  'Traditional Lecture', 'Interactive Discussion', 'Project-Based Learning',
  'Flipped Classroom', 'Collaborative Learning', 'Inquiry-Based Learning',
  'Technology-Integrated', 'Differentiated Instruction', 'Mixed Methods'
];

export const TeacherDataForm: React.FC<TeacherDataFormProps> = ({ onBack, onClose }) => {
  const [formData, setFormData] = useState<TeacherFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    school: '',
    subjects: [],
    gradeLevel: '',
    experience: '',
    classSize: '',
    teachingStyle: '',
    goals: '',
    agreeToTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [step, setStep] = useState(1);

  const handleInputChange = (field: keyof TeacherFormData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubjectToggle = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSuccess(true);
      console.log('Teacher registration successful:', formData);
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/20 flex items-center justify-center p-6 theme-transition">
        {onClose && (
          <button onClick={onClose} className="fixed top-6 right-6 z-50 h-12 w-12 rounded-full glass-effect shadow-lg hover:shadow-xl theme-transition flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:scale-110 active:scale-95 transition-all duration-150">
            <X className="h-6 w-6" />
          </button>
        )}
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-lg glow-effect">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 theme-transition">Welcome to Your Teaching Hub!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 theme-transition">
            Your teacher account has been created successfully. Get ready to transform your teaching with AI-powered insights.
          </p>
          <Button className="hover-lift glow-effect" onClick={onClose}>
            Start Teaching
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/20 flex items-center justify-center p-6 theme-transition">
      {/* Navigation */}
      <div className="fixed top-6 left-6 z-50">
        <Button
          variant="ghost"
          onClick={step === 1 ? onBack : prevStep}
          className="h-12 w-12 rounded-full glass-effect shadow-lg hover:shadow-xl theme-transition"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </div>

      {onClose && (
        <button onClick={onClose} className="fixed top-6 right-6 z-50 h-12 w-12 rounded-full glass-effect shadow-lg hover:shadow-xl theme-transition flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:scale-110 active:scale-95 transition-all duration-150">
          <X className="h-6 w-6" />
        </button>
      )}

      <div className="w-full max-w-2xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold theme-transition ${
                  stepNumber <= step 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' 
                    : 'glass-effect text-gray-400 dark:text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 h-1 mx-2 rounded-full theme-transition ${
                    stepNumber < step ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 theme-transition">
              Step {step} of 3
            </p>
          </div>
        </div>

        {/* Header */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-center mb-8"
        >
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-lg glow-effect">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 theme-transition">
            {step === 1 && 'Teacher Profile'}
            {step === 2 && 'Teaching Details'}
            {step === 3 && 'Teaching Preferences'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 theme-transition">
            {step === 1 && 'Create your teacher profile'}
            {step === 2 && 'Tell us about your teaching experience'}
            {step === 3 && 'Customize your teaching dashboard'}
          </p>
        </motion.div>

        {/* Form */}
        <Card className="glass-effect-strong shadow-xl">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Basic Information */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 theme-transition">
                        First Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Enter your first name"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 theme-transition">
                        Last Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Enter your last name"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 theme-transition">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 theme-transition">
                      School/Institution
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Enter your school or institution name"
                        value={formData.school}
                        onChange={(e) => handleInputChange('school', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 theme-transition">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 theme-transition"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 theme-transition">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 theme-transition"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Teaching Details */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 theme-transition">
                        Grade Level
                      </label>
                      <select
                        value={formData.gradeLevel}
                        onChange={(e) => handleInputChange('gradeLevel', e.target.value)}
                        className="w-full border border-gray-300/50 dark:border-gray-600/50 glass-effect px-3 py-2 text-sm text-gray-900 dark:text-gray-100 rounded-xl theme-transition focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select grade level</option>
                        {gradeLevels.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 theme-transition">
                        Teaching Experience
                      </label>
                      <select
                        value={formData.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        className="w-full border border-gray-300/50 dark:border-gray-600/50 glass-effect px-3 py-2 text-sm text-gray-900 dark:text-gray-100 rounded-xl theme-transition focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select experience level</option>
                        {experienceLevels.map(exp => (
                          <option key={exp} value={exp}>{exp}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 theme-transition">
                      Subjects You Teach
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {subjects.map(subject => (
                        <label key={subject} className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.subjects.includes(subject)}
                            onChange={() => handleSubjectToggle(subject)}
                            className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 dark:border-gray-600 rounded theme-transition"
                          />
                          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 theme-transition">{subject}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 theme-transition">
                      Average Class Size
                    </label>
                    <select
                      value={formData.classSize}
                      onChange={(e) => handleInputChange('classSize', e.target.value)}
                      className="w-full border border-gray-300/50 dark:border-gray-600/50 glass-effect px-3 py-2 text-sm text-gray-900 dark:text-gray-100 rounded-xl theme-transition focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select class size</option>
                      {classSizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Teaching Preferences */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 theme-transition">
                      Teaching Style
                    </label>
                    <select
                      value={formData.teachingStyle}
                      onChange={(e) => handleInputChange('teachingStyle', e.target.value)}
                      className="w-full border border-gray-300/50 dark:border-gray-600/50 glass-effect px-3 py-2 text-sm text-gray-900 dark:text-gray-100 rounded-xl theme-transition focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select your teaching style</option>
                      {teachingStyles.map(style => (
                        <option key={style} value={style}>{style}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 theme-transition">
                      Teaching Goals & Expectations
                    </label>
                    <textarea
                      placeholder="Tell us about your teaching goals, what you hope to achieve with Rafiq, and how you'd like to improve your students' learning experience..."
                      value={formData.goals}
                      onChange={(e) => handleInputChange('goals', e.target.value)}
                      className="w-full min-h-[120px] border border-gray-300/50 dark:border-gray-600/50 glass-effect px-3 py-2 text-sm text-gray-900 dark:text-gray-100 rounded-xl theme-transition focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={formData.agreeToTerms}
                        onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                        className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 dark:border-gray-600 rounded mt-0.5 theme-transition"
                        required
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400 theme-transition">
                        I agree to the{' '}
                        <a href="#terms" className="text-green-500 hover:text-green-600 font-medium theme-transition">
                          Terms of Service
                        </a>
                        {' '}and{' '}
                        <a href="#privacy" className="text-green-500 hover:text-green-600 font-medium theme-transition">
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8">
                <div>
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="hover-lift"
                    >
                      Previous
                    </Button>
                  )}
                </div>
                <div>
                  {step < 3 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="hover-lift glow-effect bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    >
                      Next Step
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="hover-lift glow-effect bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Creating Account...
                        </div>
                      ) : (
                        'Create My Account'
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};