import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  X, 
  User, 
  Mail, 
  Lock, 
  Heart, 
  Users,
  Plus,
  Minus,
  Eye,
  EyeOff,
  CheckCircle,
  Phone,
  MapPin
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Card, CardContent } from '../../ui/Card';

interface Child {
  name: string;
  age: string;
  grade: string;
  school: string;
  subjects: string[];
}

interface ParentFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
  children: Child[];
  relationship: string;
  concerns: string;
  supportStyle: string;
  goals: string;
  agreeToTerms: boolean;
}

interface ParentDataFormProps {
  onBack: () => void;
  onClose?: () => void;
}

const grades = [
  'Pre-K', 'Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', 
  '5th Grade', '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade',
  '11th Grade', '12th Grade', 'College Freshman', 'College Sophomore', 
  'College Junior', 'College Senior', 'Graduate Student'
];

const subjects = [
  'Mathematics', 'Science', 'English', 'History', 'Foreign Languages',
  'Computer Science', 'Art', 'Music', 'Physical Education', 'Psychology',
  'Economics', 'Biology', 'Chemistry', 'Physics', 'Literature', 'Social Studies'
];

const relationships = [
  'Mother', 'Father', 'Guardian', 'Grandparent', 'Step-parent', 'Foster Parent', 'Other'
];

const supportStyles = [
  'Hands-on Helper', 'Encouraging Motivator', 'Structured Supervisor', 
  'Collaborative Partner', 'Independent Supporter', 'Mixed Approach'
];

export const ParentDataForm: React.FC<ParentDataFormProps> = ({ onBack, onClose }) => {
  const [formData, setFormData] = useState<ParentFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    children: [{ name: '', age: '', grade: '', school: '', subjects: [] }],
    relationship: '',
    concerns: '',
    supportStyle: '',
    goals: '',
    agreeToTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [step, setStep] = useState(1);

  const handleInputChange = (field: keyof ParentFormData, value: string | boolean | Child[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleChildChange = (index: number, field: keyof Child, value: string | string[]) => {
    const updatedChildren = [...formData.children];
    updatedChildren[index] = { ...updatedChildren[index], [field]: value };
    setFormData(prev => ({ ...prev, children: updatedChildren }));
  };

  const handleSubjectToggle = (childIndex: number, subject: string) => {
    const updatedChildren = [...formData.children];
    const currentSubjects = updatedChildren[childIndex].subjects;
    updatedChildren[childIndex].subjects = currentSubjects.includes(subject)
      ? currentSubjects.filter(s => s !== subject)
      : [...currentSubjects, subject];
    setFormData(prev => ({ ...prev, children: updatedChildren }));
  };

  const addChild = () => {
    setFormData(prev => ({
      ...prev,
      children: [...prev.children, { name: '', age: '', grade: '', school: '', subjects: [] }]
    }));
  };

  const removeChild = (index: number) => {
    if (formData.children.length > 1) {
      const updatedChildren = formData.children.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, children: updatedChildren }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSuccess(true);
      console.log('Parent registration successful:', formData);
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
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center mx-auto mb-6 shadow-lg glow-effect">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 theme-transition">Welcome to Your Family Hub!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 theme-transition">
            Your parent account has been created successfully. Get ready to support your child's learning journey with personalized insights.
          </p>
          <Button className="hover-lift glow-effect" onClick={onClose}>
            View Family Dashboard
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
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg' 
                    : 'glass-effect text-gray-400 dark:text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 h-1 mx-2 rounded-full theme-transition ${
                    stepNumber < step ? 'bg-gradient-to-r from-pink-500 to-purple-500' : 'bg-gray-200 dark:bg-gray-700'
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
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center mx-auto mb-6 shadow-lg glow-effect">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 theme-transition">
            {step === 1 && 'Parent Profile'}
            {step === 2 && 'Your Children'}
            {step === 3 && 'Support Preferences'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 theme-transition">
            {step === 1 && 'Create your parent profile'}
            {step === 2 && 'Tell us about your children'}
            {step === 3 && 'How would you like to support their learning?'}
          </p>
        </motion.div>

        {/* Form */}
        <Card className="glass-effect-strong shadow-xl">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Parent Information */}
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 theme-transition">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type="tel"
                          placeholder="Enter your phone number"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 theme-transition">
                        Relationship
                      </label>
                      <select
                        value={formData.relationship}
                        onChange={(e) => handleInputChange('relationship', e.target.value)}
                        className="w-full border border-gray-300/50 dark:border-gray-600/50 glass-effect px-3 py-2 text-sm text-gray-900 dark:text-gray-100 rounded-xl theme-transition focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select relationship</option>
                        {relationships.map(rel => (
                          <option key={rel} value={rel}>{rel}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 theme-transition">
                      Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Enter your address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="pl-10"
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

              {/* Step 2: Children Information */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {formData.children.map((child, index) => (
                    <div key={index} className="glass-effect p-6 rounded-xl border-l-4 border-pink-500">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 theme-transition">
                          Child {index + 1}
                        </h3>
                        {formData.children.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeChild(index)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 theme-transition">
                            Name
                          </label>
                          <Input
                            type="text"
                            placeholder="Child's name"
                            value={child.name}
                            onChange={(e) => handleChildChange(index, 'name', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 theme-transition">
                            Age
                          </label>
                          <Input
                            type="number"
                            placeholder="Age"
                            value={child.age}
                            onChange={(e) => handleChildChange(index, 'age', e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 theme-transition">
                            Grade
                          </label>
                          <select
                            value={child.grade}
                            onChange={(e) => handleChildChange(index, 'grade', e.target.value)}
                            className="w-full border border-gray-300/50 dark:border-gray-600/50 glass-effect px-3 py-2 text-sm text-gray-900 dark:text-gray-100 rounded-xl theme-transition focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            required
                          >
                            <option value="">Select grade</option>
                            {grades.map(grade => (
                              <option key={grade} value={grade}>{grade}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 theme-transition">
                            School
                          </label>
                          <Input
                            type="text"
                            placeholder="School name"
                            value={child.school}
                            onChange={(e) => handleChildChange(index, 'school', e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 theme-transition">
                          Subjects
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {subjects.slice(0, 12).map(subject => (
                            <label key={subject} className="flex items-center cursor-pointer text-xs">
                              <input
                                type="checkbox"
                                checked={child.subjects.includes(subject)}
                                onChange={() => handleSubjectToggle(index, subject)}
                                className="h-3 w-3 text-pink-500 focus:ring-pink-500 border-gray-300 dark:border-gray-600 rounded theme-transition"
                              />
                              <span className="ml-2 text-gray-600 dark:text-gray-400 theme-transition">{subject}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={addChild}
                    className="w-full hover-lift"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Child
                  </Button>
                </motion.div>
              )}

              {/* Step 3: Support Preferences */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 theme-transition">
                      Support Style
                    </label>
                    <select
                      value={formData.supportStyle}
                      onChange={(e) => handleInputChange('supportStyle', e.target.value)}
                      className="w-full border border-gray-300/50 dark:border-gray-600/50 glass-effect px-3 py-2 text-sm text-gray-900 dark:text-gray-100 rounded-xl theme-transition focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select your support style</option>
                      {supportStyles.map(style => (
                        <option key={style} value={style}>{style}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 theme-transition">
                      Learning Concerns
                    </label>
                    <textarea
                      placeholder="Tell us about any learning challenges, concerns, or areas where your child needs extra support..."
                      value={formData.concerns}
                      onChange={(e) => handleInputChange('concerns', e.target.value)}
                      className="w-full min-h-[100px] border border-gray-300/50 dark:border-gray-600/50 glass-effect px-3 py-2 text-sm text-gray-900 dark:text-gray-100 rounded-xl theme-transition focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 theme-transition">
                      Goals & Expectations
                    </label>
                    <textarea
                      placeholder="What are your goals for your child's learning? How would you like Rafiq to help your family?"
                      value={formData.goals}
                      onChange={(e) => handleInputChange('goals', e.target.value)}
                      className="w-full min-h-[100px] border border-gray-300/50 dark:border-gray-600/50 glass-effect px-3 py-2 text-sm text-gray-900 dark:text-gray-100 rounded-xl theme-transition focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={formData.agreeToTerms}
                        onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                        className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 dark:border-gray-600 rounded mt-0.5 theme-transition"
                        required
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400 theme-transition">
                        I agree to the{' '}
                        <a href="#terms" className="text-pink-500 hover:text-pink-600 font-medium theme-transition">
                          Terms of Service
                        </a>
                        {' '}and{' '}
                        <a href="#privacy" className="text-pink-500 hover:text-pink-600 font-medium theme-transition">
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
                      className="hover-lift glow-effect bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                    >
                      Next Step
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="hover-lift glow-effect bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
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