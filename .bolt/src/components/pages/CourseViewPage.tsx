import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Volume2, 
  Maximize2, 
  Download, 
  FileText, 
  CheckCircle, 
  Clock,
  Award,
  BookOpen,
  PenTool,
  Upload,
  Send,
  Star,
  Users,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CourseViewPageProps {
  courseId: string;
  onBack: () => void;
}

interface Lecture {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  description: string;
  completed: boolean;
  materials: Material[];
}

interface Material {
  id: string;
  title: string;
  type: 'pdf' | 'document' | 'slides' | 'code';
  url: string;
  size: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit: number;
  attempts: number;
  bestScore?: number;
}

interface Question {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: string;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  maxScore: number;
  submissionType: 'file' | 'text' | 'both';
  submitted?: boolean;
  score?: number;
  feedback?: string;
}

export const CourseViewPage: React.FC<CourseViewPageProps> = ({ courseId, onBack }) => {
  const [activeTab, setActiveTab] = useState<'lectures' | 'materials' | 'quizzes' | 'assignments'>('lectures');
  const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [assignmentSubmission, setAssignmentSubmission] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  // Mock course data
  const course = {
    id: courseId,
    title: "Complete React Developer Course",
    instructor: "Dr. Sarah Johnson",
    rating: 4.8,
    students: 15420,
    duration: "12h 30m",
    description: "Master React from basics to advanced concepts with hands-on projects and real-world applications.",
    progress: 65,
    lectures: [
      {
        id: '1',
        title: 'Introduction to React',
        duration: '15:30',
        videoUrl: 'https://example.com/video1.mp4',
        description: 'Learn the fundamentals of React and why it\'s revolutionary for web development.',
        completed: true,
        materials: [
          { id: '1', title: 'React Basics Slides', type: 'slides' as const, url: '/slides1.pdf', size: '2.3 MB' },
          { id: '2', title: 'Starter Code', type: 'code' as const, url: '/code1.zip', size: '1.1 MB' }
        ]
      },
      {
        id: '2',
        title: 'Components and JSX',
        duration: '22:45',
        videoUrl: 'https://example.com/video2.mp4',
        description: 'Dive deep into React components and JSX syntax.',
        completed: true,
        materials: [
          { id: '3', title: 'JSX Reference', type: 'pdf' as const, url: '/jsx-ref.pdf', size: '1.8 MB' }
        ]
      },
      {
        id: '3',
        title: 'State and Props',
        duration: '28:15',
        videoUrl: 'https://example.com/video3.mp4',
        description: 'Understanding data flow in React applications.',
        completed: false,
        materials: [
          { id: '4', title: 'State Management Guide', type: 'document' as const, url: '/state-guide.pdf', size: '3.2 MB' }
        ]
      },
      {
        id: '4',
        title: 'React Hooks',
        duration: '35:20',
        videoUrl: 'https://example.com/video4.mp4',
        description: 'Modern React development with hooks.',
        completed: false,
        materials: []
      }
    ] as Lecture[],
    quizzes: [
      {
        id: '1',
        title: 'React Fundamentals Quiz',
        description: 'Test your understanding of React basics and components.',
        timeLimit: 15,
        attempts: 3,
        bestScore: 85,
        questions: [
          {
            id: '1',
            question: 'What is JSX?',
            type: 'multiple-choice' as const,
            options: [
              'A JavaScript library',
              'A syntax extension for JavaScript',
              'A database query language',
              'A CSS framework'
            ],
            correctAnswer: 'A syntax extension for JavaScript'
          },
          {
            id: '2',
            question: 'React components must return a single parent element.',
            type: 'true-false' as const,
            options: ['True', 'False'],
            correctAnswer: 'True'
          }
        ]
      },
      {
        id: '2',
        title: 'State and Props Assessment',
        description: 'Evaluate your knowledge of React state management and props.',
        timeLimit: 20,
        attempts: 2,
        questions: [
          {
            id: '3',
            question: 'Explain the difference between state and props in React.',
            type: 'short-answer' as const,
            correctAnswer: 'State is internal component data that can change, props are external data passed from parent components.'
          }
        ]
      }
    ] as Quiz[],
    assignments: [
      {
        id: '1',
        title: 'Build a Todo App',
        description: 'Create a fully functional todo application using React hooks. Include add, delete, and toggle functionality.',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxScore: 100,
        submissionType: 'both' as const,
        submitted: false
      },
      {
        id: '2',
        title: 'Component Refactoring',
        description: 'Refactor the provided code to use modern React patterns and hooks.',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        maxScore: 80,
        submissionType: 'file' as const,
        submitted: true,
        score: 75,
        feedback: 'Good work! Consider using more descriptive variable names and add error handling.'
      }
    ] as Assignment[]
  };

  useEffect(() => {
    if (course.lectures.length > 0) {
      setCurrentLecture(course.lectures[0]);
    }
  }, []);

  const handleLectureSelect = (lecture: Lecture) => {
    setCurrentLecture(lecture);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleQuizSubmit = (quiz: Quiz) => {
    // Calculate score
    let correct = 0;
    quiz.questions.forEach(question => {
      if (quizAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    const score = Math.round((correct / quiz.questions.length) * 100);
    alert(`Quiz submitted! Score: ${score}%`);
    setSelectedQuiz(null);
    setQuizAnswers({});
  };

  const handleAssignmentSubmit = (assignment: Assignment) => {
    alert('Assignment submitted successfully!');
    setSelectedAssignment(null);
    setAssignmentSubmission('');
  };

  const completedLectures = course.lectures.filter(l => l.completed).length;
  const totalLectures = course.lectures.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50/80 to-blue-50/60 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="h-10 w-10 p-0 rounded-full hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{course.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
            </div>
          </div>

          <div className="text-right">
            <div className="text-lg font-bold text-purple-600">{course.progress}%</div>
            <div className="text-sm text-muted-foreground">Complete</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={course.progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>{completedLectures} of {totalLectures} lectures completed</span>
            <span>{course.duration} total</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { id: 'lectures', label: 'Lectures', icon: Play },
            { id: 'materials', label: 'Materials', icon: FileText },
            { id: 'quizzes', label: 'Quizzes', icon: Award },
            { id: 'assignments', label: 'Assignments', icon: PenTool }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                onClick={() => setActiveTab(tab.id as any)}
                className={activeTab === tab.id ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : ''}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'lectures' && (
              <div className="space-y-6">
                {/* Video Player */}
                {currentLecture && (
                  <Card className="overflow-hidden">
                    <div className="relative aspect-video bg-black">
                      <video
                        ref={videoRef}
                        className="w-full h-full"
                        poster="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop"
                        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                      >
                        <source src={currentLecture.videoUrl} type="video/mp4" />
                      </video>
                      
                      {/* Video Controls Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <div className="flex items-center gap-4 text-white">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={togglePlay}
                            className="text-white hover:bg-white/20"
                          >
                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                          
                          <div className="flex-1">
                            <Progress 
                              value={duration > 0 ? (currentTime / duration) * 100 : 0} 
                              className="h-1 bg-white/20" 
                            />
                          </div>
                          
                          <span className="text-sm">
                            {formatTime(currentTime)} / {formatTime(duration)}
                          </span>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/20"
                          >
                            <Volume2 className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/20"
                          >
                            <Maximize2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <h2 className="text-xl font-bold text-foreground mb-2">{currentLecture.title}</h2>
                      <p className="text-muted-foreground">{currentLecture.description}</p>
                      
                      {/* Lecture Materials */}
                      {currentLecture.materials.length > 0 && (
                        <div className="mt-6">
                          <h3 className="font-semibold text-foreground mb-3">Lecture Materials</h3>
                          <div className="space-y-2">
                            {currentLecture.materials.map(material => (
                              <div key={material.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <FileText className="h-4 w-4 text-purple-500" />
                                  <div>
                                    <p className="font-medium text-foreground">{material.title}</p>
                                    <p className="text-xs text-muted-foreground">{material.type} • {material.size}</p>
                                  </div>
                                </div>
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === 'materials' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Course Materials
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {course.lectures.flatMap(lecture => lecture.materials).map(material => (
                      <div key={material.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-500/10 rounded-lg">
                            <FileText className="h-5 w-5 text-purple-500" />
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground">{material.title}</h3>
                            <p className="text-sm text-muted-foreground capitalize">{material.type} • {material.size}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'quizzes' && !selectedQuiz && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Course Quizzes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {course.quizzes.map(quiz => (
                      <div key={quiz.id} className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-foreground">{quiz.title}</h3>
                            <p className="text-sm text-muted-foreground">{quiz.description}</p>
                          </div>
                          {quiz.bestScore && (
                            <Badge className="bg-green-500/20 text-green-600">
                              Best: {quiz.bestScore}%
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {quiz.timeLimit} minutes
                            </span>
                            <span>{quiz.questions.length} questions</span>
                            <span>{quiz.attempts} attempts remaining</span>
                          </div>
                          <Button 
                            onClick={() => setSelectedQuiz(quiz)}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                          >
                            Take Quiz
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedQuiz && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{selectedQuiz.title}</CardTitle>
                    <Button variant="ghost" onClick={() => setSelectedQuiz(null)}>
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {selectedQuiz.questions.map((question, index) => (
                      <div key={question.id} className="p-4 bg-muted/30 rounded-lg">
                        <h3 className="font-medium text-foreground mb-3">
                          {index + 1}. {question.question}
                        </h3>
                        
                        {question.type === 'multiple-choice' && question.options && (
                          <div className="space-y-2">
                            {question.options.map(option => (
                              <label key={option} className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name={question.id}
                                  value={option}
                                  onChange={(e) => setQuizAnswers(prev => ({ ...prev, [question.id]: e.target.value }))}
                                  className="text-purple-500"
                                />
                                <span className="text-foreground">{option}</span>
                              </label>
                            ))}
                          </div>
                        )}
                        
                        {question.type === 'true-false' && (
                          <div className="space-y-2">
                            {['True', 'False'].map(option => (
                              <label key={option} className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name={question.id}
                                  value={option}
                                  onChange={(e) => setQuizAnswers(prev => ({ ...prev, [question.id]: e.target.value }))}
                                  className="text-purple-500"
                                />
                                <span className="text-foreground">{option}</span>
                              </label>
                            ))}
                          </div>
                        )}
                        
                        {question.type === 'short-answer' && (
                          <textarea
                            className="w-full p-3 border border-border rounded-lg bg-background text-foreground resize-none"
                            rows={3}
                            placeholder="Type your answer here..."
                            onChange={(e) => setQuizAnswers(prev => ({ ...prev, [question.id]: e.target.value }))}
                          />
                        )}
                      </div>
                    ))}
                    
                    <Button 
                      onClick={() => handleQuizSubmit(selectedQuiz)}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                    >
                      Submit Quiz
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'assignments' && !selectedAssignment && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PenTool className="h-5 w-5" />
                    Course Assignments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {course.assignments.map(assignment => (
                      <div key={assignment.id} className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-foreground">{assignment.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{assignment.description}</p>
                          </div>
                          {assignment.submitted ? (
                            assignment.score ? (
                              <Badge className="bg-green-500/20 text-green-600">
                                Score: {assignment.score}/{assignment.maxScore}
                              </Badge>
                            ) : (
                              <Badge className="bg-blue-500/20 text-blue-600">
                                Submitted
                              </Badge>
                            )
                          ) : (
                            <Badge className="bg-red-500/20 text-red-600">
                              Not Submitted
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Due: {assignment.dueDate.toLocaleDateString()}
                            </span>
                            <span>Max Score: {assignment.maxScore}</span>
                          </div>
                          
                          {!assignment.submitted && (
                            <Button 
                              onClick={() => setSelectedAssignment(assignment)}
                              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                            >
                              Submit Assignment
                            </Button>
                          )}
                        </div>
                        
                        {assignment.feedback && (
                          <div className="mt-3 p-3 bg-blue-50/80 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">Instructor Feedback:</h4>
                            <p className="text-sm text-blue-700 dark:text-blue-300">{assignment.feedback}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedAssignment && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{selectedAssignment.title}</CardTitle>
                    <Button variant="ghost" onClick={() => setSelectedAssignment(null)}>
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h3 className="font-medium text-foreground mb-2">Assignment Description</h3>
                      <p className="text-muted-foreground">{selectedAssignment.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                        <span>Due: {selectedAssignment.dueDate.toLocaleDateString()}</span>
                        <span>Max Score: {selectedAssignment.maxScore}</span>
                      </div>
                    </div>
                    
                    {(selectedAssignment.submissionType === 'text' || selectedAssignment.submissionType === 'both') && (
                      <div>
                        <Label htmlFor="text-submission" className="text-foreground">Text Submission</Label>
                        <textarea
                          id="text-submission"
                          className="w-full mt-2 p-3 border border-border rounded-lg bg-background text-foreground resize-none"
                          rows={8}
                          placeholder="Enter your solution here..."
                          value={assignmentSubmission}
                          onChange={(e) => setAssignmentSubmission(e.target.value)}
                        />
                      </div>
                    )}
                    
                    {(selectedAssignment.submissionType === 'file' || selectedAssignment.submissionType === 'both') && (
                      <div>
                        <Label className="text-foreground">File Upload</Label>
                        <div className="mt-2 border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-muted/30 transition-colors cursor-pointer">
                          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">Click to upload files or drag and drop</p>
                          <p className="text-xs text-muted-foreground mt-1">Supports: PDF, DOC, ZIP files (Max 10MB)</p>
                        </div>
                      </div>
                    )}
                    
                    <Button 
                      onClick={() => handleAssignmentSubmit(selectedAssignment)}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Submit Assignment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-1">{course.progress}%</div>
                  <p className="text-sm text-muted-foreground">Complete</p>
                </div>
                <Progress value={course.progress} className="h-2" />
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-foreground">{completedLectures}</div>
                    <p className="text-xs text-muted-foreground">Lectures Done</p>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-foreground">{totalLectures}</div>
                    <p className="text-xs text-muted-foreground">Total Lectures</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lecture List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Course Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {course.lectures.map((lecture, index) => (
                    <button
                      key={lecture.id}
                      onClick={() => handleLectureSelect(lecture)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        currentLecture?.id === lecture.id
                          ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200 dark:border-purple-800'
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          lecture.completed 
                            ? 'bg-green-500 text-white' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {lecture.completed ? <CheckCircle className="h-3 w-3" /> : index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm truncate">{lecture.title}</p>
                          <p className="text-xs text-muted-foreground">{lecture.duration}</p>
                        </div>
                        <Play className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};