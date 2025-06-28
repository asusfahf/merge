import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  Plus, 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  Circle, 
  Edit3, 
  Trash2, 
  Filter,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Timer,
  Flag,
  BarChart3,
  Zap,
  Star,
  BookOpen,
  PlayCircle,
  PauseCircle,
  X,
  Play,
  Pause,
  SkipForward,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

interface Task {
  id: string;
  title: string;
  subject: string;
  startTime: string;
  endTime: string;
  date: string;
  duration: number; // minutes
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  type: 'study' | 'assignment' | 'exam' | 'review' | 'break';
  color: string;
  description?: string;
}

interface StudySession {
  id: string;
  taskId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // minutes
  completed: boolean;
}

interface PomodoroSession {
  id: string;
  type: 'work' | 'shortBreak' | 'longBreak';
  startTime: Date;
  endTime?: Date;
  duration: number; // seconds
  completed: boolean;
  taskId?: string;
}

export const StudyTrackerPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [activeSession, setActiveSession] = useState<StudySession | null>(null);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [sessionTimer, setSessionTimer] = useState(0);

  // Pomodoro state
  const [pomodoroSessions, setPomodoroSessions] = useState<PomodoroSession[]>([]);
  const [activePomodoroSession, setActivePomodoroSession] = useState<PomodoroSession | null>(null);
  const [pomodoroTimer, setPomodoroTimer] = useState(0);
  const [currentPomodoroType, setCurrentPomodoroType] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [isPomodoroActive, setIsPomodoroActive] = useState(false);
  const [pomodoroSettings, setPomodoroSettings] = useState({
    workDuration: 25 * 60, // 25 minutes in seconds
    shortBreakDuration: 5 * 60, // 5 minutes
    longBreakDuration: 15 * 60, // 15 minutes
    autoStartBreaks: true,
    autoStartWork: false,
    soundEnabled: true
  });

  // Form state for new/edit task
  const [taskForm, setTaskForm] = useState({
    title: '',
    subject: '',
    startTime: '',
    endTime: '',
    priority: 'medium' as Task['priority'],
    type: 'study' as Task['type'],
    description: ''
  });

  // Timer effect for active session
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeSession && !activeSession.endTime) {
      interval = setInterval(() => {
        setSessionTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeSession]);

  // Pomodoro timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPomodoroActive && activePomodoroSession) {
      interval = setInterval(() => {
        setPomodoroTimer(prev => {
          const newTime = prev + 1;
          const maxTime = pomodoroSettings[
            currentPomodoroType === 'work' ? 'workDuration' :
            currentPomodoroType === 'shortBreak' ? 'shortBreakDuration' : 'longBreakDuration'
          ];
          
          if (newTime >= maxTime) {
            completePomodoroSession();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPomodoroActive, activePomodoroSession, currentPomodoroType, pomodoroSettings]);

  // Initialize with some sample tasks
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const dayAfter = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    setTasks([
      {
        id: '1',
        title: 'React Hooks Deep Dive',
        subject: 'Web Development',
        startTime: '09:00',
        endTime: '10:30',
        date: today,
        duration: 90,
        completed: false,
        priority: 'high',
        type: 'study',
        color: '#8B5CF6',
        description: 'Focus on useState, useEffect, and custom hooks'
      },
      {
        id: '2',
        title: 'Math Assignment Review',
        subject: 'Mathematics',
        startTime: '11:00',
        endTime: '12:00',
        date: today,
        duration: 60,
        completed: true,
        priority: 'medium',
        type: 'assignment',
        color: '#06B6D4',
        description: 'Review calculus problems from chapter 5'
      },
      {
        id: '3',
        title: 'Physics Exam Prep',
        subject: 'Physics',
        startTime: '14:00',
        endTime: '16:00',
        date: tomorrow,
        duration: 120,
        completed: false,
        priority: 'high',
        type: 'exam',
        color: '#EF4444',
        description: 'Thermodynamics and quantum mechanics'
      },
      {
        id: '4',
        title: 'Break & Stretch',
        subject: 'Wellness',
        startTime: '10:30',
        endTime: '11:00',
        date: today,
        duration: 30,
        completed: false,
        priority: 'low',
        type: 'break',
        color: '#10B981',
        description: 'Quick break and physical exercise'
      },
      {
        id: '5',
        title: 'Algorithm Practice',
        subject: 'Computer Science',
        startTime: '15:00',
        endTime: '16:30',
        date: dayAfter,
        duration: 90,
        completed: false,
        priority: 'medium',
        type: 'study',
        color: '#8B5CF6',
        description: 'Binary search and sorting algorithms'
      },
      {
        id: '6',
        title: 'History Essay',
        subject: 'History',
        startTime: '13:00',
        endTime: '15:00',
        date: tomorrow,
        duration: 120,
        completed: false,
        priority: 'high',
        type: 'assignment',
        color: '#06B6D4',
        description: 'World War II impact analysis'
      }
    ]);
  }, []);

  const typeIcons = {
    study: BookOpen,
    assignment: Edit3,
    exam: Target,
    review: BarChart3,
    break: Timer
  };

  const typeColors = {
    study: '#8B5CF6',
    assignment: '#06B6D4', 
    exam: '#EF4444',
    review: '#F59E0B',
    break: '#10B981'
  };

  const priorityColors = {
    low: '#10B981',
    medium: '#F59E0B',
    high: '#EF4444'
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter(task => task.date === dateStr).sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const getWeekDates = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day; // Adjust to start from Sunday
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(startOfWeek);
      weekDate.setDate(startOfWeek.getDate() + i);
      week.push(weekDate);
    }
    return week;
  };

  const getMonthDates = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    const endDate = new Date(lastDay);
    
    // Adjust to show full weeks
    startDate.setDate(startDate.getDate() - startDate.getDay());
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    
    const dates = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };

  const startStudySession = (task: Task) => {
    const newSession: StudySession = {
      id: Date.now().toString(),
      taskId: task.id,
      startTime: new Date(),
      duration: 0,
      completed: false
    };
    setActiveSession(newSession);
    setSessionTimer(0);
  };

  const endStudySession = () => {
    if (activeSession) {
      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - activeSession.startTime.getTime()) / 1000);
      
      const completedSession = {
        ...activeSession,
        endTime,
        duration,
        completed: true
      };
      
      setStudySessions(prev => [...prev, completedSession]);
      setActiveSession(null);
      setSessionTimer(0);
    }
  };

  // Pomodoro functions
  const startPomodoroSession = (type: 'work' | 'shortBreak' | 'longBreak' = 'work', taskId?: string) => {
    const newSession: PomodoroSession = {
      id: Date.now().toString(),
      type,
      startTime: new Date(),
      duration: 0,
      completed: false,
      taskId
    };
    
    setActivePomodoroSession(newSession);
    setCurrentPomodoroType(type);
    setIsPomodoroActive(true);
    setPomodoroTimer(0);
  };

  const pausePomodoroSession = () => {
    setIsPomodoroActive(!isPomodoroActive);
  };

  const stopPomodoroSession = () => {
    if (activePomodoroSession) {
      setActivePomodoroSession(null);
      setIsPomodoroActive(false);
      setPomodoroTimer(0);
    }
  };

  const completePomodoroSession = () => {
    if (activePomodoroSession) {
      const completedSession = {
        ...activePomodoroSession,
        endTime: new Date(),
        duration: pomodoroTimer,
        completed: true
      };
      
      setPomodoroSessions(prev => [...prev, completedSession]);
      
      if (currentPomodoroType === 'work') {
        setPomodoroCount(prev => prev + 1);
        // Automatically start break based on settings
        if (pomodoroSettings.autoStartBreaks) {
          const breakType = pomodoroCount > 0 && (pomodoroCount + 1) % 4 === 0 ? 'longBreak' : 'shortBreak';
          startPomodoroSession(breakType);
        } else {
          setActivePomodoroSession(null);
          setIsPomodoroActive(false);
        }
      } else {
        // Break completed
        if (pomodoroSettings.autoStartWork) {
          startPomodoroSession('work');
        } else {
          setActivePomodoroSession(null);
          setIsPomodoroActive(false);
        }
      }
      
      setPomodoroTimer(0);
    }
  };

  const addTask = () => {
    if (!taskForm.title || !taskForm.startTime || !taskForm.endTime) return;

    const startTime = new Date(`2000-01-01T${taskForm.startTime}`);
    const endTime = new Date(`2000-01-01T${taskForm.endTime}`);
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 60000);

    const newTask: Task = {
      id: Date.now().toString(),
      title: taskForm.title,
      subject: taskForm.subject || 'General',
      startTime: taskForm.startTime,
      endTime: taskForm.endTime,
      date: selectedDate.toISOString().split('T')[0],
      duration,
      completed: false,
      priority: taskForm.priority,
      type: taskForm.type,
      color: typeColors[taskForm.type],
      description: taskForm.description
    };

    setTasks(prev => [...prev, newTask]);
    resetForm();
  };

  const updateTask = () => {
    if (!editingTask || !taskForm.title || !taskForm.startTime || !taskForm.endTime) return;

    const startTime = new Date(`2000-01-01T${taskForm.startTime}`);
    const endTime = new Date(`2000-01-01T${taskForm.endTime}`);
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 60000);

    const updatedTask: Task = {
      ...editingTask,
      title: taskForm.title,
      subject: taskForm.subject || 'General',
      startTime: taskForm.startTime,
      endTime: taskForm.endTime,
      duration,
      priority: taskForm.priority,
      type: taskForm.type,
      color: typeColors[taskForm.type],
      description: taskForm.description
    };

    setTasks(prev => prev.map(task => task.id === editingTask.id ? updatedTask : task));
    resetForm();
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const resetForm = () => {
    setTaskForm({
      title: '',
      subject: '',
      startTime: '',
      endTime: '',
      priority: 'medium',
      type: 'study',
      description: ''
    });
    setShowAddTask(false);
    setEditingTask(null);
  };

  const editTask = (task: Task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      subject: task.subject,
      startTime: task.startTime,
      endTime: task.endTime,
      priority: task.priority,
      type: task.type,
      description: task.description || ''
    });
    setShowAddTask(true);
  };

  // Calculate stats
  const todayTasks = getTasksForDate(new Date());
  const completedToday = todayTasks.filter(t => t.completed).length;
  const totalTimeToday = todayTasks.reduce((sum, task) => sum + task.duration, 0);
  const completedTimeToday = todayTasks.filter(t => t.completed).reduce((sum, task) => sum + task.duration, 0);

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setSelectedDate(newDate);
  };

  // Get schedule title based on view mode
  const getScheduleTitle = () => {
    switch (viewMode) {
      case 'week':
        return 'Weekly Schedule';
      case 'month':
        return 'Monthly Schedule';
      default:
        return 'Daily Schedule';
    }
  };

  // Calculate pomodoro progress
  const getCurrentSessionDuration = () => {
    return pomodoroSettings[
      currentPomodoroType === 'work' ? 'workDuration' :
      currentPomodoroType === 'shortBreak' ? 'shortBreakDuration' : 'longBreakDuration'
    ];
  };

  const getProgressPercentage = () => {
    const maxTime = getCurrentSessionDuration();
    return (pomodoroTimer / maxTime) * 100;
  };

  const getTodayPomodoroStats = () => {
    const today = new Date().toDateString();
    const todaySessions = pomodoroSessions.filter(session => 
      session.startTime.toDateString() === today && session.completed
    );
    
    const workSessions = todaySessions.filter(s => s.type === 'work').length;
    const totalFocusTime = todaySessions
      .filter(s => s.type === 'work')
      .reduce((sum, session) => sum + session.duration, 0);
    
    return { workSessions, totalFocusTime };
  };

  const { workSessions, totalFocusTime } = getTodayPomodoroStats();

  // Render task component
  const renderTask = (task: Task, isCompact = false) => {
    const Icon = typeIcons[task.type];
    return (
      <motion.div
        key={task.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="group relative mb-2"
      >
        <div
          className={`p-${isCompact ? '2' : '3'} rounded-xl border transition-all cursor-pointer ${
            task.completed 
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
              : 'bg-card border-border hover:shadow-md'
          }`}
          style={{ borderLeftColor: task.color, borderLeftWidth: '4px' }}
          onClick={() => toggleTaskCompletion(task.id)}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2 flex-1">
              <div className={`p-${isCompact ? '1' : '2'} rounded-lg`} style={{ backgroundColor: `${task.color}20` }}>
                <Icon className={`h-${isCompact ? '3' : '4'} w-${isCompact ? '3' : '4'}`} style={{ color: task.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium text-${isCompact ? 'xs' : 'sm'} ${
                  task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                } truncate`}>
                  {task.title}
                </h3>
                {!isCompact && <p className="text-xs text-muted-foreground">{task.subject}</p>}
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-${isCompact ? '2xs' : 'xs'} text-muted-foreground`}>
                    {formatTime(task.startTime)} - {formatTime(task.endTime)}
                  </span>
                  <Badge 
                    className={`text-${isCompact ? '2xs' : 'xs'} px-1`}
                    style={{ 
                      backgroundColor: `${priorityColors[task.priority]}20`,
                      color: priorityColors[task.priority],
                      borderColor: `${priorityColors[task.priority]}40`
                    }}
                  >
                    {task.priority}
                  </Badge>
                </div>
              </div>
            </div>
            {!isCompact && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!task.completed && (
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      startStudySession(task);
                    }}
                    disabled={!!activeSession}
                    className="h-7 w-7 p-0 bg-green-500 hover:bg-green-600 text-white"
                  >
                    <PlayCircle className="h-3 w-3" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    editTask(task);
                  }}
                  className="h-7 w-7 p-0"
                >
                  <Edit3 className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(task.id);
                  }}
                  className="h-7 w-7 p-0 text-red-500 hover:text-red-600"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Study Tracker
            </h1>
            <p className="text-muted-foreground">Plan, track, and optimize your study schedule</p>
          </div>
        </div>

        {/* Active Session Timer */}
        {activeSession && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-200 dark:border-red-800 rounded-xl"
          >
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-foreground">
              Session Active: {formatDuration(sessionTimer)}
            </span>
            <Button
              size="sm"
              onClick={endStudySession}
              className="bg-red-500 hover:bg-red-600 text-white h-7 px-3"
            >
              <PauseCircle className="h-3 w-3 mr-1" />
              End
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Enhanced Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          { 
            label: "Today's Tasks", 
            value: completedToday, 
            total: todayTasks.length,
            icon: Target, 
            color: "from-blue-500 to-cyan-500",
            bgColor: "bg-blue-500/10",
            textColor: "text-blue-600",
            displayValue: `${completedToday}/${todayTasks.length}`,
            progress: todayTasks.length > 0 ? (completedToday / todayTasks.length) * 100 : 0
          },
          { 
            label: "Time Planned", 
            value: Math.floor(totalTimeToday / 60), 
            total: totalTimeToday % 60,
            icon: Clock, 
            color: "from-green-500 to-emerald-500",
            bgColor: "bg-green-500/10",
            textColor: "text-green-600",
            displayValue: `${Math.floor(totalTimeToday / 60)}h ${totalTimeToday % 60}m`,
            progress: null
          },
          { 
            label: "Time Completed", 
            value: Math.floor(completedTimeToday / 60), 
            total: completedTimeToday % 60,
            icon: CheckCircle2, 
            color: "from-purple-500 to-pink-500",
            bgColor: "bg-purple-500/10",
            textColor: "text-purple-600",
            displayValue: `${Math.floor(completedTimeToday / 60)}h ${completedTimeToday % 60}m`,
            progress: totalTimeToday > 0 ? (completedTimeToday / totalTimeToday) * 100 : 0
          },
          { 
            label: "Productivity", 
            value: totalTimeToday > 0 ? Math.round((completedTimeToday / totalTimeToday) * 100) : 0, 
            total: null,
            icon: TrendingUp, 
            color: "from-orange-500 to-red-500",
            bgColor: "bg-orange-500/10",
            textColor: "text-orange-600",
            displayValue: `${totalTimeToday > 0 ? Math.round((completedTimeToday / totalTimeToday) * 100) : 0}%`,
            progress: totalTimeToday > 0 ? (completedTimeToday / totalTimeToday) * 100 : 0
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="group"
          >
            <Card className="relative overflow-hidden border border-border/50 shadow-md hover:shadow-lg transition-all duration-300 bg-card/80 backdrop-blur-sm h-32">
              <CardContent className="p-4 h-full">
                <div className="flex items-center justify-between h-full">
                  {/* Left side - Icon */}
                  <div className="flex flex-col items-center justify-center">
                    <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300 mb-2`}>
                      <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground text-center leading-tight">{stat.label}</span>
                  </div>
                  
                  {/* Right side - Value and Progress */}
                  <div className="flex flex-col items-end justify-center flex-1 ml-4">
                    <div className="text-right mb-2">
                      <div className="text-2xl font-bold text-foreground mb-1">
                        {stat.displayValue}
                      </div>
                      {stat.progress !== null && (
                        <div className="w-20 bg-muted rounded-full h-1.5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${stat.progress}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className={`bg-gradient-to-r ${stat.color} h-1.5 rounded-full`}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${stat.color}`} />
                      <span className="text-xs text-muted-foreground">
                        {stat.progress !== null ? `${Math.round(stat.progress)}%` : 'total'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Calendar Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate('prev')}
              className="h-9 w-9 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold text-foreground min-w-[200px] text-center">
              {viewMode === 'month' ? (
                selectedDate.toLocaleDateString('en-US', { 
                  year: 'numeric',
                  month: 'long'
                })
              ) : viewMode === 'week' ? (
                `Week of ${getWeekDates(selectedDate)[0].toLocaleDateString('en-US', { 
                  month: 'short',
                  day: 'numeric'
                })}`
              ) : (
                selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              )}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate('next')}
              className="h-9 w-9 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedDate(new Date())}
            className="text-sm"
          >
            Today
          </Button>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex bg-muted/50 rounded-lg p-1">
            {['day', 'week', 'month'].map((mode) => (
              <Button
                key={mode}
                variant={viewMode === mode ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode(mode as any)}
                className={`h-8 px-3 text-xs capitalize ${
                  viewMode === mode ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : ''
                }`}
              >
                {mode}
              </Button>
            ))}
          </div>

          <Button
            onClick={() => setShowAddTask(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schedule View */}
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {getScheduleTitle()}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[520px] overflow-y-auto">
              {/* Day View */}
              {viewMode === 'day' && (
                <div className="space-y-3">
                  {Array.from({ length: 24 }, (_, hour) => {
                    const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
                    const tasksInSlot = getTasksForDate(selectedDate).filter(task => {
                      const taskHour = parseInt(task.startTime.split(':')[0]);
                      return taskHour === hour;
                    });

                    return (
                      <div key={hour} className="flex gap-4 min-h-[60px]">
                        <div className="w-16 text-sm text-muted-foreground pt-2 text-right">
                          {formatTime(timeSlot)}
                        </div>
                        <div className="flex-1 border-l border-border pl-4 relative">
                          {tasksInSlot.map((task) => renderTask(task))}
                          {tasksInSlot.length === 0 && (
                            <div className="h-[60px] flex items-center justify-center text-muted-foreground/50 text-sm">
                              No tasks scheduled
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Week View */}
              {viewMode === 'week' && (
                <div className="grid grid-cols-7 gap-2 h-full">
                  {getWeekDates(selectedDate).map((date, index) => {
                    const dayTasks = getTasksForDate(date);
                    const isToday = date.toDateString() === new Date().toDateString();
                    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    
                    return (
                      <div key={index} className="flex flex-col h-full">
                        <div className={`text-center p-2 rounded-lg mb-2 ${
                          isToday 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                            : 'bg-muted/30 text-foreground'
                        }`}>
                          <div className="text-xs font-medium">{dayNames[index]}</div>
                          <div className="text-sm font-bold">{date.getDate()}</div>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-1">
                          {dayTasks.map((task) => renderTask(task, true))}
                          {dayTasks.length === 0 && (
                            <div className="text-xs text-muted-foreground/50 text-center p-2">
                              No tasks
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Month View */}
              {viewMode === 'month' && (
                <div className="h-full">
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1 h-[calc(100%-3rem)]">
                    {getMonthDates(selectedDate).map((date, index) => {
                      const dayTasks = getTasksForDate(date);
                      const isToday = date.toDateString() === new Date().toDateString();
                      const isCurrentMonth = date.getMonth() === selectedDate.getMonth();
                      
                      return (
                        <div
                          key={index}
                          className={`border border-border rounded-lg p-1 cursor-pointer transition-colors hover:bg-muted/30 ${
                            isToday ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-300' : ''
                          } ${!isCurrentMonth ? 'opacity-40' : ''}`}
                          onClick={() => {
                            setSelectedDate(date);
                            setViewMode('day');
                          }}
                        >
                          <div className={`text-xs font-medium text-center mb-1 ${
                            isToday ? 'text-purple-600 font-bold' : 'text-foreground'
                          }`}>
                            {date.getDate()}
                          </div>
                          <div className="space-y-1">
                            {dayTasks.slice(0, 3).map((task) => (
                              <div
                                key={task.id}
                                className="text-xs p-1 rounded truncate"
                                style={{ 
                                  backgroundColor: `${task.color}20`,
                                  color: task.color,
                                  borderLeft: `2px solid ${task.color}`
                                }}
                              >
                                {task.title}
                              </div>
                            ))}
                            {dayTasks.length > 3 && (
                              <div className="text-xs text-muted-foreground text-center">
                                +{dayTasks.length - 3} more
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => setShowAddTask(true)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Task
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedDate(new Date())}
                className="w-full"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Go to Today
              </Button>
            </CardContent>
          </Card>

          {/* Today's Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today's Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Tasks Completed</span>
                  <span>{completedToday}/{todayTasks.length}</span>
                </div>
                <Progress value={todayTasks.length > 0 ? (completedToday / todayTasks.length) * 100 : 0} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Time Progress</span>
                  <span>{Math.floor(completedTimeToday / 60)}h {completedTimeToday % 60}m</span>
                </div>
                <Progress value={totalTimeToday > 0 ? (completedTimeToday / totalTimeToday) * 100 : 0} className="h-2" />
              </div>

              <div className="pt-2 space-y-2">
                {todayTasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="flex items-center gap-2 text-sm">
                    {task.completed ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className={task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}>
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Smart Pomodoro Tracker - Moved to the end and made smaller */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8"
      >
        <Card className="overflow-hidden border border-border shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg">
                  <Timer className="h-4 w-4 text-white" />
                </div>
                Smart Pomodoro Tracker
              </CardTitle>
              <Badge className="bg-red-500/20 text-red-600 border-red-300/50">
                🍅 {workSessions} completed today
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Timer Display */}
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted/30"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 45}`}
                      strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgressPercentage() / 100)}`}
                      className={`transition-all duration-1000 ${
                        currentPomodoroType === 'work' 
                          ? 'text-red-500' 
                          : 'text-green-500'
                      }`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-lg font-bold text-foreground">
                        {formatDuration(getCurrentSessionDuration() - pomodoroTimer)}
                      </div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {currentPomodoroType === 'shortBreak' ? 'break' : 
                         currentPomodoroType === 'longBreak' ? 'long break' : 
                         currentPomodoroType}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center gap-2">
                  {!activePomodoroSession ? (
                    <Button
                      onClick={() => startPomodoroSession('work')}
                      className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-4 py-2"
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Start
                    </Button>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Button
                        onClick={pausePomodoroSession}
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        {isPomodoroActive ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                      </Button>
                      <Button
                        onClick={stopPomodoroSession}
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <Button
                        onClick={completePomodoroSession}
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <SkipForward className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-red-50/80 dark:bg-red-900/20 rounded-lg border border-red-200/60 dark:border-red-800/60">
                  <div className="text-xl font-bold text-red-600 dark:text-red-400">
                    {workSessions}
                  </div>
                  <p className="text-xs text-muted-foreground">Pomodoros</p>
                </div>
                
                <div className="text-center p-3 bg-orange-50/80 dark:bg-orange-900/20 rounded-lg border border-orange-200/60 dark:border-orange-800/60">
                  <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
                    {Math.floor(totalFocusTime / 60)}m
                  </div>
                  <p className="text-xs text-muted-foreground">Focus Time</p>
                </div>
                
                <div className="text-center p-3 bg-green-50/80 dark:bg-green-900/20 rounded-lg border border-green-200/60 dark:border-green-800/60">
                  <div className="text-xl font-bold text-green-600 dark:text-green-400">
                    {4 - (pomodoroCount % 4)}
                  </div>
                  <p className="text-xs text-muted-foreground">To Long Break</p>
                </div>
                
                <div className="text-center p-3 bg-purple-50/80 dark:bg-purple-900/20 rounded-lg border border-purple-200/60 dark:border-purple-800/60">
                  <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                    {Math.round((workSessions / 8) * 100)}%
                  </div>
                  <p className="text-xs text-muted-foreground">Daily Goal</p>
                </div>
              </div>

              {/* Task Suggestions */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground">Suggested Tasks</h4>
                <div className="space-y-2">
                  {todayTasks
                    .filter(task => !task.completed && task.type === 'study')
                    .slice(0, 2)
                    .map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-2 bg-muted/30 rounded-lg"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground truncate">
                            {task.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {task.subject}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => startPomodoroSession('work', task.id)}
                          disabled={!!activePomodoroSession}
                          className="h-6 px-2 text-xs bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
                        >
                          Start
                        </Button>
                      </div>
                    ))}
                  
                  {todayTasks.filter(task => !task.completed && task.type === 'study').length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-2">
                      No study tasks for today
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Add/Edit Task Modal - Fixed Background */}
      <AnimatePresence>
        {showAddTask && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[99999]"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              margin: 0,
              padding: '1rem',
              zIndex: 99999
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                resetForm();
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-xl border border-border shadow-2xl w-full max-w-[280px] max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
                <h2 className="text-base font-bold text-foreground">
                  {editingTask ? 'Edit' : 'New Task'}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetForm}
                  className="h-6 w-6 p-0 hover:bg-muted"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-3 space-y-3 max-h-[calc(90vh-120px)] overflow-y-auto">
                {/* Title */}
                <div>
                  <Input
                    placeholder="Task title"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm(prev => ({ ...prev, title: e.target.value }))}
                    className="h-8 text-sm"
                  />
                </div>

                {/* Subject */}
                <div>
                  <Input
                    placeholder="Subject"
                    value={taskForm.subject}
                    onChange={(e) => setTaskForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="h-8 text-sm"
                  />
                </div>

                {/* Time */}
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="time"
                    value={taskForm.startTime}
                    onChange={(e) => setTaskForm(prev => ({ ...prev, startTime: e.target.value }))}
                    className="h-8 text-sm"
                  />
                  <Input
                    type="time"
                    value={taskForm.endTime}
                    onChange={(e) => setTaskForm(prev => ({ ...prev, endTime: e.target.value }))}
                    className="h-8 text-sm"
                  />
                </div>

                {/* Type */}
                <div className="grid grid-cols-3 gap-1">
                  {Object.entries(typeIcons).slice(0, 3).map(([type, Icon]) => (
                    <Button
                      key={type}
                      variant={taskForm.type === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTaskForm(prev => ({ ...prev, type: type as Task['type'] }))}
                      className={`h-8 text-xs px-1 ${
                        taskForm.type === type ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : ''
                      }`}
                    >
                      <Icon className="h-3 w-3" />
                    </Button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {Object.entries(typeIcons).slice(3, 5).map(([type, Icon]) => (
                    <Button
                      key={type}
                      variant={taskForm.type === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTaskForm(prev => ({ ...prev, type: type as Task['type'] }))}
                      className={`h-8 text-xs px-1 ${
                        taskForm.type === type ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : ''
                      }`}
                    >
                      <Icon className="h-3 w-3" />
                    </Button>
                  ))}
                </div>

                {/* Priority */}
                <div className="grid grid-cols-3 gap-1">
                  {(['low', 'medium', 'high'] as const).map((priority) => (
                    <Button
                      key={priority}
                      variant={taskForm.priority === priority ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTaskForm(prev => ({ ...prev, priority }))}
                      className={`h-8 text-xs capitalize ${
                        taskForm.priority === priority
                          ? priority === 'high' ? 'bg-red-500 text-white hover:bg-red-600' :
                            priority === 'medium' ? 'bg-yellow-500 text-white hover:bg-yellow-600' :
                            'bg-green-500 text-white hover:bg-green-600'
                          : ''
                      }`}
                    >
                      {priority}
                    </Button>
                  ))}
                </div>

                {/* Description */}
                <textarea
                  value={taskForm.description}
                  onChange={(e) => setTaskForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Notes (optional)"
                  className="w-full p-2 border border-border rounded-lg bg-background text-foreground resize-none text-xs"
                  rows={2}
                />
              </div>

              {/* Footer */}
              <div className="flex gap-2 p-3 border-t border-border bg-muted/30">
                <Button
                  variant="outline"
                  onClick={resetForm}
                  className="flex-1 h-8 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  onClick={editingTask ? updateTask : addTask}
                  disabled={!taskForm.title || !taskForm.startTime || !taskForm.endTime}
                  className="flex-1 h-8 text-xs bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  {editingTask ? 'Update' : 'Add'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};