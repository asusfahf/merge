import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Zap, Trophy, User, Library } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { NotificationsDropdown } from '@/components/NotificationsDropdown';
import { RafiqChatbot } from '@/components/RafiqChatbot';
import { Sidebar } from '@/components/Sidebar';
import { SidebarToggle } from '@/components/SidebarToggle';
import { DashboardPage } from '@/components/pages/DashboardPage';
import { CoursesPage } from '@/components/pages/CoursesPage';
import { MyCoursesPage } from '@/components/pages/MyCoursesPage';
import { StudyTrackerPage } from '@/components/pages/StudyTrackerPage';
import { AIAssistantPage } from '@/components/pages/AIAssistantPage';
import { MessagesPage } from '@/components/pages/MessagesPage';
import { CourseViewPage } from '@/components/pages/CourseViewPage';

interface Course {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  progress: number;
  category: string;
}

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const addToMyCourses = (course: Course) => {
    setMyCourses(prev => {
      // Check if course already exists
      if (prev.some(c => c.id === course.id)) {
        return prev;
      }
      return [...prev, course];
    });
  };

  const removeFromMyCourses = (courseId: string) => {
    setMyCourses(prev => prev.filter(course => course.id !== courseId));
  };

  const isInMyCourses = (courseId: string) => {
    return myCourses.some(course => course.id === courseId);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarNavigation = (section: string) => {
    setActiveTab(section);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleCourseView = (courseId: string) => {
    // Only allow course view for courses in My Courses
    if (isInMyCourses(courseId)) {
      setSelectedCourseId(courseId);
      setActiveTab('course-view');
    }
  };

  const handleBackFromCourse = () => {
    setSelectedCourseId(null);
    setActiveTab('my-courses');
  };

  // If viewing a specific course, show course view
  if (selectedCourseId && activeTab === 'course-view') {
    return (
      <CourseViewPage 
        courseId={selectedCourseId} 
        onBack={handleBackFromCourse}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50/80 to-blue-50/60 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={toggleSidebar} 
        onNavigate={handleSidebarNavigation}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {/* Sidebar Toggle - Now inline with Rafiq */}
            <SidebarToggle onClick={toggleSidebar} />
            
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Rafiq
                </h1>
                <p className="text-xs text-muted-foreground">Your Learning Companion</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <NotificationsDropdown />
            <ThemeSwitcher />
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex justify-center gap-4 mb-8 bg-transparent border-0 shadow-none">
            <TabsTrigger 
              value="dashboard" 
              className={`relative rounded-full px-8 py-4 transition-all duration-300 border-0 text-base ${
                activeTab === "dashboard" 
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25" 
                  : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30 hover:shadow-sm"
              }`}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-3"
              >
                <Zap className="h-5 w-5" />
                <span className="hidden sm:inline font-medium">Dashboard</span>
              </motion.div>
            </TabsTrigger>
            <TabsTrigger 
              value="courses" 
              className={`relative rounded-full px-8 py-4 transition-all duration-300 border-0 text-base ${
                activeTab === "courses" 
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25" 
                  : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30 hover:shadow-sm"
              }`}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-3"
              >
                <Library className="h-5 w-5" />
                <span className="hidden sm:inline font-medium">Courses</span>
              </motion.div>
            </TabsTrigger>
            <TabsTrigger 
              value="my-courses" 
              className={`relative rounded-full px-8 py-4 transition-all duration-300 border-0 text-base ${
                activeTab === "my-courses" 
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25" 
                  : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30 hover:shadow-sm"
              }`}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-3"
              >
                <User className="h-5 w-5" />
                <span className="hidden sm:inline font-medium">My Courses</span>
              </motion.div>
            </TabsTrigger>
            <TabsTrigger 
              value="tracker" 
              className={`relative rounded-full px-8 py-4 transition-all duration-300 border-0 text-base ${
                activeTab === "tracker" 
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25" 
                  : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30 hover:shadow-sm"
              }`}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-3"
              >
                <Trophy className="h-5 w-5" />
                <span className="hidden sm:inline font-medium">Tracker</span>
              </motion.div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardPage />
          </TabsContent>

          <TabsContent value="courses">
            <CoursesPage 
              onAddToMyCourses={addToMyCourses}
              isInMyCourses={isInMyCourses}
            />
          </TabsContent>

          <TabsContent value="my-courses">
            <MyCoursesPage 
              myCourses={myCourses}
              onRemoveCourse={removeFromMyCourses}
              onCourseView={handleCourseView}
            />
          </TabsContent>

          <TabsContent value="tracker">
            <StudyTrackerPage />
          </TabsContent>

          <TabsContent value="ai">
            <AIAssistantPage />
          </TabsContent>

          <TabsContent value="messages">
            <MessagesPage />
          </TabsContent>
        </Tabs>
      </div>

      {/* Rafiq Chatbot */}
      <RafiqChatbot />
    </div>
  );
}

export default App;