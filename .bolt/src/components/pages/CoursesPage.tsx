import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Star, 
  Clock, 
  Users, 
  Play, 
  Plus, 
  Search, 
  Filter, 
  Grid3X3, 
  List,
  Heart,
  ShoppingCart,
  CreditCard,
  Lock,
  Check
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Course {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  progress: number;
  category: string;
  instructor: string;
  rating: number;
  students: number;
  price?: number;
  isPaid: boolean;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
}

interface CoursesPageProps {
  onAddToMyCourses: (course: Course) => void;
  isInMyCourses: (courseId: string) => boolean;
}

// Payment Modal Component
function PaymentModal({ 
  isOpen, 
  onClose, 
  course, 
  onPaymentSuccess 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  course: Course; 
  onPaymentSuccess: () => void; 
}) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        margin: 0,
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card rounded-2xl border border-border shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Payment form content */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Complete Purchase</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 rounded-full hover:bg-muted"
          >
            ×
          </Button>
        </div>

        {/* Course Summary */}
        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl mb-6">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-16 h-12 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-sm text-foreground">{course.title}</h3>
            <p className="text-xs text-muted-foreground">{course.category}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total:</p>
            <p className="text-lg font-bold text-foreground">${course.price}</p>
          </div>
        </div>

        {/* Payment Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
            <Input placeholder="John Doe" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
            <Input type="email" placeholder="john@example.com" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Card Number</label>
            <Input placeholder="1234 5678 9012 3456" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Expiry Date</label>
              <Input placeholder="MM/YY" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">CVV</label>
              <Input placeholder="123" />
            </div>
          </div>
        </div>

        <Button 
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Pay ${course.price}
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}

// Course Preview Modal Component  
function CoursePreviewModal({ 
  isOpen, 
  onClose, 
  course, 
  onAddToMyCourses, 
  isInMyCourses, 
  onPaymentRequired 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  course: Course | null; 
  onAddToMyCourses: (course: Course) => void; 
  isInMyCourses: (courseId: string) => boolean; 
  onPaymentRequired: (course: Course) => void; 
}) {
  if (!isOpen || !course) return null;

  const handleAddToCourses = () => {
    if (course.isPaid) {
      onPaymentRequired(course);
    } else {
      onAddToMyCourses(course);
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        margin: 0,
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal content */}
        <div className="relative">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-48 object-cover rounded-t-2xl"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 h-8 w-8 p-0 rounded-full bg-black/50 hover:bg-black/70 text-white"
          >
            ×
          </Button>
          {course.isPaid && (
            <Badge className="absolute top-4 left-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              <Lock className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-2">{course.title}</h2>
              <p className="text-muted-foreground mb-3">{course.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span>By {course.instructor}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{course.rating}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{course.students.toLocaleString()} students</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}</span>
                </div>
              </div>
            </div>
            
            {course.isPaid && (
              <div className="text-right ml-4">
                <div className="text-2xl font-bold text-foreground">${course.price}</div>
                <div className="text-sm text-muted-foreground">One-time payment</div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mb-6">
            <Badge className="bg-purple-100/80 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
              {course.category}
            </Badge>
            <Badge className="bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              {course.level}
            </Badge>
            {course.tags.slice(0, 2).map(tag => (
              <Badge key={tag} className="bg-gray-100/80 text-gray-700 dark:bg-gray-800/30 dark:text-gray-300">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={handleAddToCourses}
              disabled={isInMyCourses(course.id)}
              className={`flex-1 ${
                course.isPaid 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' 
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
              } text-white`}
            >
              {isInMyCourses(course.id) ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Added to My Courses
                </>
              ) : course.isPaid ? (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Buy Course - ${course.price}
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add to My Courses
                </>
              )}
            </Button>
            <Button variant="outline" className="px-4">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Course Row Component
function CourseRow({ course, onPreview, onAddToMyCourses, isInMyCourses }: {
  course: Course;
  onPreview: (course: Course) => void;
  onAddToMyCourses: (course: Course) => void;
  isInMyCourses: (courseId: string) => boolean;
}) {
  const handleAddToCourses = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!course.isPaid) {
      onAddToMyCourses(course);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      onClick={() => onPreview(course)}
      className="p-4 bg-card border border-border rounded-xl hover:shadow-lg transition-all cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-20 h-14 rounded-lg object-cover"
          />
          {course.isPaid && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
              <Lock className="h-3 w-3 text-white" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-sm mb-1 truncate">{course.title}</h3>
          <p className="text-xs text-muted-foreground mb-2">By {course.instructor}</p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{course.rating}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{course.duration}</span>
            </div>
            <span>•</span>
            <Badge className="text-xs bg-purple-100/80 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
              {course.level}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {course.isPaid && (
            <div className="text-right">
              <div className="text-lg font-bold text-foreground">${course.price}</div>
            </div>
          )}
          
          <Button
            size="sm"
            onClick={handleAddToCourses}
            disabled={isInMyCourses(course.id) || course.isPaid}
            className={`${
              isInMyCourses(course.id) 
                ? 'bg-green-500/20 text-green-600 hover:bg-green-500/30' 
                : course.isPaid
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
            }`}
          >
            {isInMyCourses(course.id) ? (
              <Check className="h-3 w-3" />
            ) : course.isPaid ? (
              <Lock className="h-3 w-3" />
            ) : (
              <Plus className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export function CoursesPage({ onAddToMyCourses, isInMyCourses }: CoursesPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentCourse, setPaymentCourse] = useState<Course | null>(null);

  // Mock courses data with paid/free distinction
  const courses: Course[] = [
    {
      id: "1",
      title: "Complete React Developer Course",
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop",
      duration: "12h 30m",
      progress: 0,
      category: "Frontend",
      instructor: "John Smith",
      rating: 4.8,
      students: 15420,
      price: 49.99,
      isPaid: true,
      description: "Master React from basics to advanced concepts with hands-on projects and real-world applications.",
      level: "Intermediate",
      tags: ["React", "JavaScript", "Frontend"]
    },
    {
      id: "2",
      title: "JavaScript Fundamentals",
      thumbnail: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=250&fit=crop",
      duration: "8h 15m",
      progress: 0,
      category: "Programming",
      instructor: "Sarah Johnson",
      rating: 4.6,
      students: 12350,
      isPaid: false,
      description: "Learn JavaScript from the ground up with practical examples and exercises.",
      level: "Beginner",
      tags: ["JavaScript", "Programming", "Web Dev"]
    },
    {
      id: "3",
      title: "Advanced CSS & SCSS",
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
      duration: "6h 45m",
      progress: 0,
      category: "Frontend",
      instructor: "Mike Chen",
      rating: 4.7,
      students: 8900,
      price: 29.99,
      isPaid: true,
      description: "Deep dive into advanced CSS techniques, animations, and SCSS preprocessing.",
      level: "Advanced",
      tags: ["CSS", "SCSS", "Styling"]
    },
    {
      id: "4",
      title: "HTML Basics for Beginners",
      thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop",
      duration: "4h 20m",
      progress: 0,
      category: "Frontend",
      instructor: "Lisa Wong",
      rating: 4.9,
      students: 25600,
      isPaid: false,
      description: "Start your web development journey with HTML fundamentals and best practices.",
      level: "Beginner",
      tags: ["HTML", "Web Dev", "Basics"]
    },
    {
      id: "5",
      title: "Node.js Backend Development",
      thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop",
      duration: "15h 10m",
      progress: 0,
      category: "Backend",
      instructor: "David Kumar",
      rating: 4.5,
      students: 9800,
      price: 79.99,
      isPaid: true,
      description: "Build scalable backend applications with Node.js, Express, and databases.",
      level: "Intermediate",
      tags: ["Node.js", "Backend", "API"]
    },
    {
      id: "6",
      title: "Git & Version Control",
      thumbnail: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=250&fit=crop",
      duration: "3h 30m",
      progress: 0,
      category: "Tools",
      instructor: "Alex Rodriguez",
      rating: 4.8,
      students: 18700,
      isPaid: false,
      description: "Master Git version control system and collaborate effectively with teams.",
      level: "Beginner",
      tags: ["Git", "Version Control", "Collaboration"]
    }
  ];

  const categories = ['all', 'Frontend', 'Backend', 'Programming', 'Tools'];
  const levels = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const freeCourses = filteredCourses.filter(course => !course.isPaid);
  const paidCourses = filteredCourses.filter(course => course.isPaid);

  const handleCoursePreview = (course: Course) => {
    setSelectedCourse(course);
    setShowPreview(true);
  };

  const handlePaymentRequired = (course: Course) => {
    setPaymentCourse(course);
    setShowPayment(true);
    setShowPreview(false);
  };

  const handlePaymentSuccess = () => {
    if (paymentCourse) {
      onAddToMyCourses(paymentCourse);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 mb-12"
      >
        <div className="space-y-3">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent leading-normal pb-2"
          >
            Discover Amazing Courses 🚀
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Explore our comprehensive library of courses designed to accelerate your learning journey.
          </motion.p>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col md:flex-row gap-4 mb-8"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background/80 backdrop-blur-sm border border-border/50"
          />
        </div>

        <div className="flex gap-3">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[140px] bg-background/80 backdrop-blur-sm border border-border/50">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="w-[120px] bg-background/80 backdrop-blur-sm border border-border/50">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              {levels.map(level => (
                <SelectItem key={level} value={level}>
                  {level === 'all' ? 'All Levels' : level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex bg-muted/50 rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8 p-0"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Free Courses Section */}
      {freeCourses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <BookOpen className="h-5 w-5 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Free Courses</h2>
            <Badge className="bg-green-500/20 text-green-600 border-green-300/50">
              {freeCourses.length} available
            </Badge>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {freeCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="group cursor-pointer"
                  onClick={() => handleCoursePreview(course)}
                >
                  <Card className="overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300 bg-card">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Play className="h-12 w-12 text-white drop-shadow-lg" />
                      </div>
                      <Badge className="absolute top-3 right-3 bg-green-500/90 text-white border-0">
                        Free
                      </Badge>
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-sm mb-2 text-foreground line-clamp-2">{course.title}</h3>
                      <p className="text-xs text-muted-foreground mb-3">By {course.instructor}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {course.duration}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{course.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge className="text-xs bg-purple-100/80 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                          {course.level}
                        </Badge>
                        <Button 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToMyCourses(course);
                          }}
                          disabled={isInMyCourses(course.id)}
                          className={`text-xs ${
                            isInMyCourses(course.id) 
                              ? 'bg-green-500/20 text-green-600 hover:bg-green-500/30' 
                              : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                          }`}
                        >
                          {isInMyCourses(course.id) ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Plus className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {freeCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <CourseRow
                    course={course}
                    onPreview={handleCoursePreview}
                    onAddToMyCourses={onAddToMyCourses}
                    isInMyCourses={isInMyCourses}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Premium Courses Section */}
      {paidCourses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
              <Lock className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Premium Courses</h2>
            <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-orange-600 border-orange-300/50">
              {paidCourses.length} available
            </Badge>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paidCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="group cursor-pointer"
                  onClick={() => handleCoursePreview(course)}
                >
                  <Card className="overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300 bg-card relative">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Play className="h-12 w-12 text-white drop-shadow-lg" />
                      </div>
                      <Badge className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                        <Lock className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                      <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded-md text-sm font-bold">
                        ${course.price}
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-sm mb-2 text-foreground line-clamp-2">{course.title}</h3>
                      <p className="text-xs text-muted-foreground mb-3">By {course.instructor}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {course.duration}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{course.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge className="text-xs bg-purple-100/80 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                          {course.level}
                        </Badge>
                        <Button 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePaymentRequired(course);
                          }}
                          className="text-xs bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                        >
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          Buy
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {paidCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <CourseRow
                    course={course}
                    onPreview={handleCoursePreview}
                    onAddToMyCourses={onAddToMyCourses}
                    isInMyCourses={isInMyCourses}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {filteredCourses.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No courses found</h3>
          <p className="text-muted-foreground">Try adjusting your search criteria or browse different categories.</p>
        </motion.div>
      )}

      {/* Course Preview Modal */}
      <AnimatePresence>
        {showPreview && selectedCourse && (
          <CoursePreviewModal
            isOpen={showPreview}
            onClose={() => setShowPreview(false)}
            course={selectedCourse}
            onAddToMyCourses={onAddToMyCourses}
            isInMyCourses={isInMyCourses}
            onPaymentRequired={handlePaymentRequired}
          />
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPayment && paymentCourse && (
          <PaymentModal
            isOpen={showPayment}
            onClose={() => setShowPayment(false)}
            course={paymentCourse}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}