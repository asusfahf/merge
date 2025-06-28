import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Play, Clock, Star, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Course {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  progress: number;
  category: string;
}

interface MyCoursesPageProps {
  myCourses: Course[];
  onRemoveCourse: (courseId: string) => void;
  onCourseView: (courseId: string) => void;
}

export const MyCoursesPage: React.FC<MyCoursesPageProps> = ({ myCourses, onRemoveCourse, onCourseView }) => {
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
            My Learning Journey 🎯
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Your personalized collection of courses and learning progress.
          </motion.p>
        </div>
      </motion.div>

      {myCourses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center py-20"
        >
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-12 w-12 text-purple-500" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">Start Your Learning Journey</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Browse our course library and add courses that interest you to create your personalized learning path.
            </p>
            <div className="p-4 bg-gradient-to-r from-purple-50/80 to-pink-50/80 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200/60 dark:border-purple-700/60">
              <p className="text-sm text-muted-foreground">
                💡 Tip: Visit the <strong>Courses</strong> tab to explore available courses and add them to your collection.
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-purple-500" />
              <h2 className="text-2xl font-bold text-foreground">My Courses</h2>
              <Badge className="bg-purple-100/80 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-300/50">
                {myCourses.length} {myCourses.length === 1 ? 'Course' : 'Courses'}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group"
              >
                <Card className="overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300 bg-card relative">
                  <div 
                    className="relative aspect-video overflow-hidden cursor-pointer"
                    onClick={() => onCourseView(course.id)}
                  >
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Play className="h-12 w-12 text-white drop-shadow-lg" />
                    </div>
                    <Badge className="absolute top-3 right-3 bg-gradient-to-r from-purple-500/90 to-pink-500/90 text-white border-0">
                      {course.category}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveCourse(course.id);
                      }}
                      className="absolute top-3 left-3 h-8 w-8 p-0 bg-red-500/80 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm mb-2 text-foreground line-clamp-2">{course.title}</h3>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {course.duration}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>4.8</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium text-foreground">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-1.5" />
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => onCourseView(course.id)}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                      >
                        <Play className="h-3 w-3 mr-1" />
                        {course.progress > 0 ? 'Continue' : 'Start Course'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Course Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Card className="p-6 text-center bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/60 dark:border-green-700/60">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {myCourses.filter(course => course.progress === 100).length}
              </div>
              <p className="text-sm text-muted-foreground">Completed Courses</p>
            </Card>
            
            <Card className="p-6 text-center bg-gradient-to-br from-blue-50/80 to-sky-50/80 dark:from-blue-900/20 dark:to-sky-900/20 border-blue-200/60 dark:border-blue-700/60">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {myCourses.filter(course => course.progress > 0 && course.progress < 100).length}
              </div>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </Card>
            
            <Card className="p-6 text-center bg-gradient-to-br from-purple-50/80 to-pink-50/80 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200/60 dark:border-purple-700/60">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {Math.round(myCourses.reduce((sum, course) => sum + course.progress, 0) / myCourses.length) || 0}%
              </div>
              <p className="text-sm text-muted-foreground">Average Progress</p>
            </Card>
          </motion.div>
        </>
      )}
    </div>
  );
};