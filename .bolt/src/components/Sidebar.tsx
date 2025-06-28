import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  Bot, 
  Settings, 
  MessageCircle, 
  Wifi, 
  WifiOff,
  User,
  Bell,
  Palette,
  Shield,
  Expand,
  Minimize2,
  Send,
  Clock,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  id: string;
  from: string;
  content: string;
  timestamp: Date;
  read: boolean;
  avatar?: string;
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: (section: string) => void;
}

const moodEmojis = [
  { emoji: "😊", label: "Happy", color: "text-yellow-500" },
  { emoji: "😢", label: "Sad", color: "text-blue-500" },
  { emoji: "😴", label: "Tired", color: "text-purple-500" },
  { emoji: "😤", label: "Frustrated", color: "text-red-500" },
  { emoji: "🤔", label: "Confused", color: "text-orange-500" },
  { emoji: "😎", label: "Confident", color: "text-green-500" },
  { emoji: "😰", label: "Stressed", color: "text-pink-500" },
  { emoji: "🤩", label: "Excited", color: "text-cyan-500" }
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, onNavigate }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected'>('connected');
  const [lastSync, setLastSync] = useState(new Date());
  const [currentMood, setCurrentMood] = useState<typeof moodEmojis[0] | null>(moodEmojis[0]);
  const [moodLastUpdated, setMoodLastUpdated] = useState(new Date());

  // Parent names - Simple list of connected parents
  const parentNames = ['Ahmed Fawzy', 'Youssef Mohamed'];

  const [messages] = useState<Message[]>([
    {
      id: '1',
      from: 'Mom',
      content: 'How was your study session today?',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616c041f7da?w=32&h=32&fit=crop&crop=face'
    },
    {
      id: '2',
      from: 'Dad',
      content: 'Great job on your math homework!',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
    },
    {
      id: '3',
      from: 'Teacher Ms. Johnson',
      content: 'Assignment due tomorrow - don\'t forget!',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      read: true
    }
  ]);

  const unreadCount = messages.filter(m => !m.read).length;

  // Simulate connection status changes
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate occasional disconnections
      if (Math.random() > 0.98) {
        setConnectionStatus(prev => prev === 'connected' ? 'disconnected' : 'connected');
        setLastSync(new Date());
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleMoodChange = (mood: typeof moodEmojis[0]) => {
    setCurrentMood(mood);
    setMoodLastUpdated(new Date());
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const handleSectionClick = (sectionId: string) => {
    if (sectionId === 'ai' || sectionId === 'messages') {
      onNavigate(sectionId);
      onToggle(); // Close sidebar on mobile after navigation
    } else {
      setActiveSection(activeSection === sectionId ? null : sectionId);
    }
  };

  const sidebarSections = [
    {
      id: 'ai',
      title: 'AI Assistant',
      icon: Bot,
      badge: null,
      badgeColor: 'bg-blue-500/20 text-blue-600',
      navigable: true
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: Settings,
      badge: null,
      navigable: false
    },
    {
      id: 'messages',
      title: 'Messages',
      icon: MessageCircle,
      badge: unreadCount > 0 ? unreadCount.toString() : null,
      badgeColor: 'bg-red-500 text-white',
      navigable: true
    },
    {
      id: 'connection',
      title: 'Parent Connection',
      icon: connectionStatus === 'connected' ? Wifi : WifiOff,
      badge: connectionStatus,
      badgeColor: connectionStatus === 'connected' ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-600',
      navigable: false
    },
    {
      id: 'mood',
      title: 'Mood Tracker',
      icon: Heart,
      badge: currentMood?.emoji,
      badgeColor: 'bg-pink-500/20 text-pink-600',
      navigable: false
    }
  ];

  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case 'settings':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Settings</h3>
            <div className="space-y-3">
              {[
                { icon: User, label: 'Profile', desc: 'Manage your account' },
                { icon: Bell, label: 'Notifications', desc: 'Alert preferences' },
                { icon: Palette, label: 'Appearance', desc: 'Theme & display' },
                { icon: Shield, label: 'Privacy', desc: 'Data & security' }
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-xl cursor-pointer transition-colors">
                  <div className="p-2 bg-muted rounded-lg">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'connection':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Parent Connection</h3>
              <div className={`w-3 h-3 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
              } animate-pulse`} />
            </div>

            {/* Simple Connection Status */}
            <Card className={`p-4 ${
              connectionStatus === 'connected' 
                ? 'bg-green-500/5 border-green-200 dark:border-green-800' 
                : 'bg-red-500/5 border-red-200 dark:border-red-800'
            }`}>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground mb-2">
                  {connectionStatus === 'connected' ? (
                    <>This account is connected to</>
                  ) : (
                    <>Connection lost with</>
                  )}
                </p>
                <p className="text-lg font-bold text-foreground">
                  {parentNames.join(' & ')}
                </p>
                <p className={`text-xs mt-2 ${
                  connectionStatus === 'connected' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {connectionStatus === 'connected' ? (
                    <>🟢 Active connection</>
                  ) : (
                    <>🔴 Reconnecting...</>
                  )}
                </p>
              </div>
            </Card>

            {/* Last Sync */}
            <div className="p-3 bg-muted/30 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Last sync</span>
                </div>
                <span className="text-sm font-medium text-foreground">{formatTimeAgo(lastSync)}</span>
              </div>
            </div>
          </div>
        );

      case 'mood':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Mood Tracker</h3>
            
            {currentMood && (
              <Card className="p-4 bg-gradient-to-r from-pink-500/5 to-purple-500/5 border-pink-200 dark:border-pink-800">
                <div className="text-center">
                  <div className="text-3xl mb-2">{currentMood.emoji}</div>
                  <p className="text-sm font-medium text-foreground">{currentMood.label}</p>
                  <p className="text-xs text-muted-foreground">Updated {formatTimeAgo(moodLastUpdated)}</p>
                </div>
              </Card>
            )}

            <div>
              <p className="text-sm font-medium text-foreground mb-3">How are you feeling?</p>
              <div className="grid grid-cols-4 gap-2">
                {moodEmojis.map((mood) => (
                  <button
                    key={mood.label}
                    onClick={() => handleMoodChange(mood)}
                    className={`p-3 rounded-xl border transition-all hover:scale-110 ${
                      currentMood?.label === mood.label
                        ? 'bg-pink-500/10 border-pink-300 dark:border-pink-700'
                        : 'bg-muted/30 border-border hover:bg-muted/50'
                    }`}
                  >
                    <div className="text-2xl">{mood.emoji}</div>
                    <div className="text-xs text-muted-foreground mt-1">{mood.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-muted/30 rounded-xl">
              <p className="text-xs text-muted-foreground">
                💡 Your mood is automatically shared with {parentNames.join(' & ')} to help them understand how you're feeling.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-full w-80 bg-card border-r border-border shadow-2xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Rafiq Dashboard</h2>
                <p className="text-xs text-muted-foreground">Learning Hub</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="h-8 w-8 p-0 hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-2">
            {sidebarSections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              
              return (
                <div key={section.id}>
                  {/* Section Button */}
                  <motion.button
                    onClick={() => handleSectionClick(section.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                      isActive 
                        ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200 dark:border-purple-800' 
                        : 'hover:bg-muted/50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`p-2 rounded-lg ${
                      isActive ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-muted'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{section.title}</p>
                      {section.navigable && (
                        <p className="text-xs text-muted-foreground">Click to open</p>
                      )}
                    </div>
                    {section.badge && (
                      <Badge className={`text-xs ${section.badgeColor || 'bg-muted text-muted-foreground'}`}>
                        {section.badge}
                      </Badge>
                    )}
                  </motion.button>

                  {/* Inline Expanded Content */}
                  <AnimatePresence>
                    {isActive && !section.navigable && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 mx-3 p-4 bg-muted/10 rounded-xl border border-border/50">
                          {renderSectionContent(activeSection)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </>
  );
};