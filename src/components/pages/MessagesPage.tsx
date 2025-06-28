import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Search, Filter, MoreVertical, Reply, Heart, Archive, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FullScreenChat } from "@/components/FullScreenChat";

interface Message {
  id: string;
  from: string;
  subject: string;
  content: string;
  timestamp: Date;
  read: boolean;
  important: boolean;
  avatar?: string;
  category: 'family' | 'teacher' | 'friend' | 'system';
}

export const MessagesPage = () => {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'family' | 'teacher' | 'friend' | 'system'>('all');
  const [fullScreenChatOpen, setFullScreenChatOpen] = useState(false);
  const [chatContact, setChatContact] = useState<{ name: string; avatar?: string; initialMessage?: { content: string; timestamp: Date } } | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      from: 'Mom',
      subject: 'How was your study session today?',
      content: 'Hi sweetie! I hope your React course is going well. Remember to take breaks and don\'t push yourself too hard. Let me know if you need any help with your homework. Love you! 💕',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
      important: true,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616c041f7da?w=64&h=64&fit=crop&crop=face',
      category: 'family'
    },
    {
      id: '2',
      from: 'Dad',
      subject: 'Great job on your math homework!',
      content: 'I saw your progress report and I\'m really proud of how well you\'re doing in mathematics. Keep up the excellent work! Maybe we can work on some advanced problems together this weekend?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      important: false,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
      category: 'family'
    },
    {
      id: '3',
      from: 'Ms. Johnson',
      subject: 'Assignment due tomorrow - don\'t forget!',
      content: 'Hi Alex, just a friendly reminder that your computer science project is due tomorrow. Make sure to submit it through the portal before 11:59 PM. If you have any last-minute questions, feel free to reach out.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      read: true,
      important: true,
      category: 'teacher'
    },
    {
      id: '4',
      from: 'Sarah',
      subject: 'Study group this weekend?',
      content: 'Hey! Want to join our study group this Saturday? We\'re planning to review for the upcoming chemistry test. It\'ll be at the library from 2-5 PM. Let me know if you can make it!',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      read: true,
      important: false,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face',
      category: 'friend'
    },
    {
      id: '5',
      from: 'Rafiq System',
      subject: 'Weekly progress report available',
      content: 'Your weekly learning progress report is now available. You\'ve completed 3 courses this week and earned 250 XP points! Check out your achievements in the dashboard.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: true,
      important: false,
      category: 'system'
    },
    {
      id: '6',
      from: 'Mr. Thompson',
      subject: 'Excellent work on your essay!',
      content: 'Alex, I just finished reading your essay on renewable energy. Your research was thorough and your arguments were well-structured. You\'ve earned an A+ on this assignment. Keep up the fantastic work!',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      read: false,
      important: true,
      category: 'teacher'
    }
  ]);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'family': return 'bg-pink-500/20 text-pink-600 border-pink-300/50';
      case 'teacher': return 'bg-blue-500/20 text-blue-600 border-blue-300/50';
      case 'friend': return 'bg-green-500/20 text-green-600 border-green-300/50';
      case 'system': return 'bg-purple-500/20 text-purple-600 border-purple-300/50';
      default: return 'bg-gray-500/20 text-gray-600 border-gray-300/50';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'family': return '👨‍👩‍👧‍👦';
      case 'teacher': return '👩‍🏫';
      case 'friend': return '👫';
      case 'system': return '🤖';
      default: return '📧';
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || message.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const unreadCount = messages.filter(m => !m.read).length;

  const markAsRead = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, read: true } : msg
    ));
  };

  const toggleImportant = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, important: !msg.important } : msg
    ));
  };

  const deleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(null);
    }
  };

  const handleMessageClick = (message: Message) => {
    // Mark as read
    if (!message.read) markAsRead(message.id);
    
    // Open full-screen chat
    setChatContact({
      name: message.from,
      avatar: message.avatar,
      initialMessage: {
        content: message.content,
        timestamp: message.timestamp
      }
    });
    setFullScreenChatOpen(true);
  };

  const handleCloseChat = () => {
    setFullScreenChatOpen(false);
    setChatContact(null);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg">
            <MessageCircle className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Messages
            </h1>
            <p className="text-muted-foreground">Stay connected with family and teachers</p>
          </div>
        </div>
        
        {unreadCount > 0 && (
          <Badge className="bg-red-500 text-white px-3 py-1">
            {unreadCount} unread
          </Badge>
        )}
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          {['all', 'family', 'teacher', 'friend', 'system'].map((category) => (
            <Button
              key={category}
              variant={filterCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterCategory(category as any)}
              className={`capitalize ${filterCategory === category ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : ''}`}
            >
              {getCategoryIcon(category)} {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages List */}
        <Card className="flex flex-col h-full">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Inbox</h2>
              <span className="text-sm text-muted-foreground">
                {filteredMessages.length} messages
              </span>
            </div>
            
            <div className="space-y-3 overflow-y-auto max-h-[600px]">
              <AnimatePresence>
                {filteredMessages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleMessageClick(message)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                      message.read 
                        ? 'bg-card border-border' 
                        : 'bg-blue-50/80 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                    } ${selectedMessage?.id === message.id ? 'ring-2 ring-purple-500' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        {message.avatar ? (
                          <AvatarImage src={message.avatar} alt={message.from} />
                        ) : (
                          <AvatarFallback className="text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                            {message.from.charAt(0)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground truncate">{message.from}</p>
                            {!message.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                            {message.important && (
                              <div className="text-red-500">⭐</div>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">{formatTimeAgo(message.timestamp)}</span>
                        </div>
                        
                        <p className="text-sm font-medium text-foreground mb-1 line-clamp-1">{message.subject}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">{message.content}</p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <Badge className={`text-xs ${getCategoryColor(message.category)}`}>
                            {message.category}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 h-6 px-2 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMessageClick(message);
                            }}
                          >
                            Chat
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {filteredMessages.length === 0 && (
                <div className="text-center py-12">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No messages found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Message Detail */}
        <Card className="flex flex-col h-full">
          <CardContent className="p-6">
            {selectedMessage ? (
              <div className="h-full flex flex-col">
                {/* Message Header */}
                <div className="flex items-start justify-between mb-6 pb-4 border-b border-border">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      {selectedMessage.avatar ? (
                        <AvatarImage src={selectedMessage.avatar} alt={selectedMessage.from} />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          {selectedMessage.from.charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">{selectedMessage.from}</h3>
                      <p className="text-sm text-muted-foreground">{formatTimeAgo(selectedMessage.timestamp)}</p>
                      <Badge className={`text-xs mt-1 ${getCategoryColor(selectedMessage.category)}`}>
                        {selectedMessage.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleImportant(selectedMessage.id)}
                      className={selectedMessage.important ? 'text-red-500' : 'text-muted-foreground'}
                    >
                      <Heart className={`h-4 w-4 ${selectedMessage.important ? 'fill-current' : ''}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMessage(selectedMessage.id)}
                      className="text-muted-foreground hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Message Subject */}
                <h2 className="text-xl font-bold text-foreground mb-4">{selectedMessage.subject}</h2>

                {/* Message Content */}
                <div className="flex-1 overflow-y-auto">
                  <div className="prose prose-sm max-w-none text-foreground">
                    <p className="leading-relaxed whitespace-pre-wrap">{selectedMessage.content}</p>
                  </div>
                </div>

                {/* Reply Button */}
                <div className="mt-6 pt-4 border-t border-border">
                  <Button 
                    onClick={() => handleMessageClick(selectedMessage)}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  >
                    <Reply className="h-4 w-4 mr-2" />
                    Open Chat with {selectedMessage.from}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center">
                <div>
                  <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Select a message</h3>
                  <p className="text-muted-foreground">Choose a message from the list to read it or start a chat</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Full Screen Chat */}
      <FullScreenChat
        isOpen={fullScreenChatOpen}
        onClose={handleCloseChat}
        contactName={chatContact?.name || ''}
        contactAvatar={chatContact?.avatar}
        initialMessage={chatContact?.initialMessage}
      />
    </div>
  );
};