import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Flame, Trophy, TrendingUp, Target, Play, Plus, Check, X, Clock, Calendar, Star, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  course: string;
  priority: 'low' | 'medium' | 'high';
  dueTime?: string;
  estimatedMinutes: number;
  xpReward: number;
  category: string;
}

export const DashboardPage = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([
    { 
      id: "1", 
      title: "Complete React Hooks chapter", 
      completed: false, 
      course: "React Mastery",
      priority: 'high',
      dueTime: '2:00 PM',
      estimatedMinutes: 45,
      xpReward: 75,
      category: 'Study'
    },
    { 
      id: "2", 
      title: "Practice JavaScript algorithms", 
      completed: true, 
      course: "JS Fundamentals",
      priority: 'medium',
      estimatedMinutes: 30,
      xpReward: 50,
      category: 'Practice'
    },
    { 
      id: "3", 
      title: "Review CSS Grid layout", 
      completed: false, 
      course: "CSS Advanced",
      priority: 'medium',
      dueTime: '4:30 PM',
      estimatedMinutes: 25,
      xpReward: 40,
      category: 'Review'
    },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCourse, setNewTaskCourse] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);
  const [totalXPEarned, setTotalXPEarned] = useState(125); // XP from completed tasks

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newCompleted = !task.completed;
        if (newCompleted && !task.completed) {
          // Task just completed - add XP
          setTotalXPEarned(prev => prev + task.xpReward);
        } else if (!newCompleted && task.completed) {
          // Task uncompleted - subtract XP
          setTotalXPEarned(prev => prev - task.xpReward);
        }
        return { ...task, completed: newCompleted };
      }
      return task;
    }));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => {
      const taskToDelete = prev.find(t => t.id === taskId);
      if (taskToDelete?.completed) {
        setTotalXPEarned(prevXP => prevXP - taskToDelete.xpReward);
      }
      return prev.filter(t => t.id !== taskId);
    });
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      course: newTaskCourse.trim() || 'General',
      completed: false,
      priority: 'medium',
      estimatedMinutes: 30,
      xpReward: 50,
      category: 'Study'
    };
    
    setTasks(prev => [...prev, newTask]);
    setNewTaskTitle('');
    setNewTaskCourse('');
    setShowAddTask(false);
  };

  const getTaskIcon = (task: Task) => {
    if (task.completed) return "🏆";
    switch (task.priority) {
      case 'high': return "🔥";
      case 'medium': return "⭐";
      case 'low': return "📝";
      default: return "🎯";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800';
      case 'medium': return 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'low': return 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-800';
      default: return 'border-border bg-muted/60';
    }
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-cyan-900/20 backdrop-blur-xl border border-purple-500/20 shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-cyan-500/5 animate-pulse" />
        <div className="relative z-10">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-normal pb-1"
          >
            Ready to Level Up, Alex? 🚀
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-muted-foreground mb-4 leading-relaxed"
          >
            Time to earn some wins and unlock new achievements
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-400/30">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-purple-800 dark:text-purple-200">Level 12 Scholar</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 rounded-full border border-cyan-400/30">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-cyan-800 dark:text-cyan-200">7 Day Streak</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "XP Today", value: `${totalXPEarned}`, change: `+${totalXPEarned}`, icon: Zap, color: "from-yellow-500 to-orange-500" },
          { label: "Tasks Done", value: `${completedTasks}/${totalTasks}`, change: `${completionRate}%`, icon: Target, color: "from-green-500 to-emerald-500" },
          { label: "Fire Streak", value: "7", change: "+1", icon: Flame, color: "from-orange-500 to-red-500" },
          { label: "Achievements", value: "12", change: "+1", icon: Trophy, color: "from-purple-500 to-pink-500" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            onHoverStart={() => setHoveredCard(stat.label)}
            onHoverEnd={() => setHoveredCard(null)}
            className="relative group cursor-pointer"
          >
            <div className="p-6 rounded-2xl bg-card backdrop-blur-xl border border-border shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-green-600 font-medium">{stat.change}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative"
      >
        <div className="p-6 rounded-3xl bg-card backdrop-blur-xl border border-border shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500">
                <Target className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Today's Quests</h2>
              <div className="px-3 py-1 bg-blue-500/20 rounded-full border border-blue-400/30">
                <span className="text-xs text-blue-600">{tasks.filter(t => !t.completed).length} remaining</span>
              </div>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Quest
                </Button>
              </DialogTrigger>
              <DialogContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Quest Title</label>
                    <Input
                      placeholder="e.g., Complete React chapter 5"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTask()}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Course</label>
                    <Input
                      placeholder="e.g., React Mastery"
                      value={newTaskCourse}
                      onChange={(e) => setNewTaskCourse(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTask()}
                    />
                  </div>
                  <Button 
                    onClick={addTask}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Quest
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="space-y-3">
            <AnimatePresence>
              {tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className={`group relative p-4 rounded-xl transition-all duration-300 cursor-pointer border ${
                    task.completed 
                      ? 'bg-green-50 dark:bg-green-900/30 border-green-300/50' 
                      : `${getPriorityColor(task.priority)} hover:shadow-md`
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleTask(task.id)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all duration-300 ${
                        task.completed 
                          ? 'bg-green-500/20 hover:bg-green-500/30' 
                          : 'bg-purple-500/20 hover:bg-purple-500/30 hover:shadow-lg'
                      }`}
                    >
                      {task.completed ? <Check className="h-5 w-5 text-green-600" /> : getTaskIcon(task)}
                    </motion.button>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className={`font-medium transition-all duration-300 ${
                          task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                        }`}>
                          {task.title}
                        </p>
                        <Badge className={`text-xs ${
                          task.priority === 'high' ? 'bg-red-500/20 text-red-600' :
                          task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-600' :
                          'bg-green-500/20 text-green-600'
                        }`}>
                          {task.priority}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {task.course}
                        </span>
                        {task.dueTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.dueTime}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Zap className="h-3 w-3 text-yellow-500" />
                          {task.xpReward} XP
                        </span>
                        <span>{task.estimatedMinutes}m</span>
                      </div>
                      
                      {!task.completed && (
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '33%' }}
                          className="mt-2 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                        />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {task.completed && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="px-3 py-1 bg-green-500/20 rounded-full border border-green-400/30"
                        >
                          <span className="text-xs text-green-600 font-medium">+{task.xpReward} XP</span>
                        </motion.div>
                      )}
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 rounded-lg hover:bg-red-500/20 text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {tasks.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No quests yet!</h3>
                <p className="text-muted-foreground mb-4">Add your first quest to start earning XP</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Quest
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Quest Title</label>
                        <Input
                          placeholder="e.g., Complete React chapter 5"
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addTask()}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Course</label>
                        <Input
                          placeholder="e.g., React Mastery"
                          value={newTaskCourse}
                          onChange={(e) => setNewTaskCourse(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addTask()}
                        />
                      </div>
                      <Button 
                        onClick={addTask}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Quest
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        whileHover={{ scale: 1.02, y: -5 }}
        className="group cursor-pointer"
      >
        <div className="relative overflow-hidden p-6 rounded-3xl bg-card backdrop-blur-xl border border-border shadow-2xl hover:border-green-400/60 transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
              <Play className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Continue Your Journey</h2>
          </div>
          
          <div className="flex items-center gap-6 p-4 bg-muted/80 rounded-2xl border border-border group-hover:border-green-400/50 transition-all duration-300">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=60&fit=crop"
                alt="Course thumbnail"
                className="w-20 h-14 rounded-xl object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl" />
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Play className="h-3 w-3 text-white ml-0.5" />
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-foreground mb-1">Advanced React Patterns</h3>
              <p className="text-sm text-muted-foreground mb-3">Chapter 3: Custom Hooks</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="text-green-600 font-medium">65% • 2h 15m left</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '65%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                  />
                </div>
              </div>
            </div>
            
            <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl px-6 py-3 font-medium shadow-lg transition-all duration-300">
              Resume
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};