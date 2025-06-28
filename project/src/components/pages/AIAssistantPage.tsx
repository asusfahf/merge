import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Plus, 
  Copy, 
  Check, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  MessageSquare,
  Bot,
  User,
  Sparkles,
  ArrowUp,
  Paperclip,
  Mic,
  Square,
  Image,
  FileText,
  Camera
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'image' | 'document';
  fileUrl?: string;
  fileName?: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  lastUpdated: Date;
}

export const AIAssistantPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'React Hooks Explanation',
      messages: [
        {
          id: '1',
          content: 'Can you explain React hooks to me?',
          sender: 'user',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          id: '2',
          content: 'React Hooks are functions that let you "hook into" React state and lifecycle features from function components. They were introduced in React 16.8 and allow you to use state and other React features without writing a class.\n\n**Most commonly used hooks:**\n\n• **useState** - Manages component state\n• **useEffect** - Handles side effects and lifecycle events\n• **useContext** - Accesses React context\n• **useReducer** - Manages complex state logic\n\nWould you like me to explain any specific hook in detail?',
          sender: 'ai',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
        }
      ],
      lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '2',
      title: 'Study Schedule Help',
      messages: [
        {
          id: '3',
          content: 'Help me create a study schedule for next week',
          sender: 'user',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      ],
      lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ]);

  const [activeConversationId, setActiveConversationId] = useState<string>('1');
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const messages = activeConversation?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [inputValue]);

  const generateAIResponse = (userInput: string, messageType: 'text' | 'image' | 'document' = 'text'): string => {
    if (messageType === 'image') {
      return "I can see the image you've shared! 📸\n\nI'd be happy to help you with:\n\n• **Analyzing diagrams** - Explaining scientific concepts, math problems, or flowcharts\n• **Reading text** - Extracting and explaining text from images\n• **Study materials** - Helping you understand visual learning materials\n• **Problem solving** - Working through math problems or equations shown in images\n\nWhat specific help do you need with this image?";
    }
    
    if (messageType === 'document') {
      return "I've received your document! 📄\n\nI can help you with:\n\n• **Document analysis** - Summarizing key points and concepts\n• **Study guides** - Creating study materials from your documents\n• **Question generation** - Making practice questions based on the content\n• **Concept explanation** - Breaking down complex topics from your materials\n• **Note taking** - Organizing information for better understanding\n\nHow would you like me to help you with this document?";
    }

    const input = userInput.toLowerCase();
    
    if (input.includes('react') || input.includes('hooks')) {
      return "Great question about React! 🚀\n\nReact hooks are a powerful way to add state and lifecycle methods to functional components. Here are the key concepts:\n\n**useState Hook:**\n```javascript\nconst [count, setCount] = useState(0);\n```\n\n**useEffect Hook:**\n```javascript\nuseEffect(() => {\n  // Side effect logic\n}, [dependencies]);\n```\n\n**Custom Hooks:**\nYou can create your own hooks to share stateful logic between components.\n\nWould you like me to dive deeper into any specific hook or show you a practical example?";
    } else if (input.includes('study') || input.includes('schedule') || input.includes('plan')) {
      return "I'd be happy to help you create an effective study schedule! 📚\n\n**Here's a proven approach:**\n\n**1. Time Blocking**\n• Morning (9-11 AM): Focus on challenging subjects\n• Afternoon (2-4 PM): Review and practice\n• Evening (7-9 PM): Light reading and review\n\n**2. The Pomodoro Technique**\n• 25 minutes of focused study\n• 5-minute break\n• Repeat 4 times, then take a longer break\n\n**3. Weekly Structure**\n• Monday-Wednesday: New material\n• Thursday-Friday: Practice and problem-solving\n• Weekend: Review and catch up\n\nWhat subjects are you focusing on? I can help create a more specific schedule!";
    } else if (input.includes('math') || input.includes('calculus') || input.includes('algebra')) {
      return "Mathematics is all about understanding patterns and logical thinking! 📐\n\n**Key Study Strategies:**\n\n**Practice Regularly**\n• Work through problems daily\n• Start with easier problems, then increase difficulty\n• Review mistakes to understand where you went wrong\n\n**Understand Concepts**\n• Don't just memorize formulas\n• Understand the 'why' behind each step\n• Connect new concepts to what you already know\n\n**Common Areas:**\n• **Algebra**: Variables, equations, functions\n• **Geometry**: Shapes, angles, proofs\n• **Calculus**: Limits, derivatives, integrals\n\nWhat specific math topic would you like help with?";
    } else {
      return "I'm here to help with your studies! 🎓\n\nAs your AI study assistant, I can help you with:\n\n• **Subject explanations** - Break down complex topics\n• **Study planning** - Create effective schedules\n• **Problem solving** - Work through challenging questions\n• **Exam preparation** - Review strategies and practice\n• **Learning techniques** - Memory and comprehension tips\n\nWhat would you like to work on today? Feel free to ask about any subject or study challenge you're facing!";
    }
  };

  const handleSendMessage = async (messageType: 'text' | 'image' | 'document' = 'text', fileData?: { url: string; name: string }) => {
    if (!inputValue.trim() && !fileData) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: fileData ? `Shared ${messageType}: ${fileData.name}` : inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
      type: messageType,
      fileUrl: fileData?.url,
      fileName: fileData?.name
    };

    // Add user message
    setConversations(prev => prev.map(conv => 
      conv.id === activeConversationId 
        ? { 
            ...conv, 
            messages: [...conv.messages, userMessage],
            lastUpdated: new Date(),
            title: conv.messages.length === 0 ? (fileData ? `${messageType} shared` : inputValue.trim().slice(0, 30) + '...') : conv.title
          }
        : conv
    ));

    setInputValue('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(inputValue, messageType),
        sender: 'ai',
        timestamp: new Date()
      };

      setConversations(prev => prev.map(conv => 
        conv.id === activeConversationId 
          ? { 
              ...conv, 
              messages: [...conv.messages, aiResponse],
              lastUpdated: new Date()
            }
          : conv
      ));

      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create a mock URL for demo purposes
    const fileUrl = URL.createObjectURL(file);
    const messageType = file.type.startsWith('image/') ? 'image' : 'document';
    
    handleSendMessage(messageType, {
      url: fileUrl,
      name: file.name
    });

    setShowUploadMenu(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleVoiceRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      // Simulate voice message
      setInputValue("This is a voice message that was transcribed to text. You can speak naturally and I'll help you with your studies!");
    } else {
      // Start recording
      setIsRecording(true);
      // Simulate recording for demo
      setTimeout(() => {
        setIsRecording(false);
        setInputValue("This is a voice message that was transcribed to text. You can speak naturally and I'll help you with your studies!");
      }, 3000);
    }
  };

  const copyToClipboard = async (messageId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [],
      lastUpdated: new Date()
    };

    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
  };

  const deleteConversation = (convId: string) => {
    setConversations(prev => prev.filter(c => c.id !== convId));
    if (activeConversationId === convId) {
      const remaining = conversations.filter(c => c.id !== convId);
      setActiveConversationId(remaining.length > 0 ? remaining[0].id : '');
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Now';
  };

  const renderMarkdown = (content: string) => {
    // Simple markdown rendering
    return content
      .split('\n')
      .map((line, index) => {
        // Code blocks
        if (line.startsWith('```')) {
          return null; // Handle in a more complex way if needed
        }
        
        // Headers
        if (line.startsWith('**') && line.endsWith('**')) {
          return (
            <p key={index} className="font-semibold text-foreground mt-3 mb-1">
              {line.slice(2, -2)}
            </p>
          );
        }
        
        // Bullet points
        if (line.startsWith('• ')) {
          return (
            <p key={index} className="ml-4 mb-1 text-muted-foreground">
              {line}
            </p>
          );
        }
        
        // Code inline
        const codeRegex = /`([^`]+)`/g;
        const parts = line.split(codeRegex);
        const rendered = parts.map((part, i) => 
          i % 2 === 1 ? (
            <code key={i} className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">
              {part}
            </code>
          ) : part
        );
        
        return line.trim() ? (
          <p key={index} className="mb-2 text-muted-foreground leading-relaxed">
            {rendered}
          </p>
        ) : (
          <br key={index} />
        );
      });
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf,.doc,.docx,.txt"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Sidebar */}
      <div className="w-64 bg-muted/30 border-r border-border flex flex-col">
        {/* New Chat Button */}
        <div className="p-3 border-b border-border">
          <Button
            onClick={createNewConversation}
            className="w-full flex items-center gap-2 bg-card hover:bg-muted text-foreground border border-border shadow-sm"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {conversations.map((conversation) => (
              <motion.button
                key={conversation.id}
                onClick={() => setActiveConversationId(conversation.id)}
                className={`group w-full text-left p-3 rounded-lg transition-all ${
                  activeConversationId === conversation.id
                    ? 'bg-card shadow-sm border border-border'
                    : 'hover:bg-muted/50'
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="h-3 w-3 text-muted-foreground" />
                      <p className="text-sm font-medium text-foreground truncate">
                        {conversation.title}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatTime(conversation.lastUpdated)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conversation.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-muted-foreground hover:text-red-500"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">AI Study Assistant</h1>
              <p className="text-sm text-muted-foreground">Your intelligent learning companion</p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                  {/* Avatar */}
                  <div className={`flex items-end gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'user' 
                        ? 'bg-blue-500' 
                        : 'bg-gradient-to-r from-purple-500 to-pink-500'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-white" />
                      )}
                    </div>
                    
                    {/* Message Bubble */}
                    <div className={`group relative rounded-2xl px-4 py-3 ${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-card border border-border text-foreground shadow-sm'
                    }`}>
                      {/* File attachments */}
                      {message.type === 'image' && message.fileUrl && (
                        <div className="mb-3">
                          <img 
                            src={message.fileUrl} 
                            alt={message.fileName}
                            className="max-w-xs rounded-lg"
                          />
                        </div>
                      )}
                      
                      {message.type === 'document' && message.fileName && (
                        <div className="mb-3 flex items-center gap-2 p-2 bg-muted rounded-lg">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">{message.fileName}</span>
                        </div>
                      )}

                      <div className="text-sm leading-relaxed">
                        {message.sender === 'ai' ? renderMarkdown(message.content) : message.content}
                      </div>
                      
                      {/* Copy Button for AI messages */}
                      {message.sender === 'ai' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(message.id, message.content)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                        >
                          {copiedMessageId === message.id ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Timestamp */}
                  <p className={`text-xs text-muted-foreground mt-1 ${
                    message.sender === 'user' ? 'text-right mr-11' : 'text-left ml-11'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-end gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-card border border-border rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Enhanced Input Area */}
        <div className="p-4 border-t border-border bg-card">
          <div className="relative max-w-4xl mx-auto">
            {/* Upload Menu */}
            <AnimatePresence>
              {showUploadMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-16 left-2 bg-card border border-border rounded-xl shadow-lg p-2 z-10"
                >
                  <div className="space-y-1 min-w-[180px]">
                    <button
                      onClick={() => {
                        fileInputRef.current?.click();
                        setShowUploadMenu(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition-colors text-left"
                    >
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <Image className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Upload Image</p>
                        <p className="text-xs text-muted-foreground">JPG, PNG, GIF up to 10MB</p>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => {
                        fileInputRef.current?.click();
                        setShowUploadMenu(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition-colors text-left"
                    >
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Upload Document</p>
                        <p className="text-xs text-muted-foreground">PDF, DOC, TXT up to 25MB</p>
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Voice Recording Indicator */}
            {isRecording && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg"
              >
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-sm font-medium">Recording...</span>
              </motion.div>
            )}

            {/* Main Input Container */}
            <div className="flex items-end gap-2 bg-card border border-border rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 transition-all">
              {/* Upload Button */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUploadMenu(!showUploadMenu)}
                  className="m-2 h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
                  disabled={isTyping}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
              </div>

              {/* Text Input */}
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Message AI Study Assistant..."
                className="flex-1 resize-none border-0 bg-transparent px-2 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none min-h-[24px] max-h-[200px]"
                rows={1}
                disabled={isTyping}
              />

              {/* Voice Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleVoiceRecording}
                className={`m-2 h-8 w-8 p-0 rounded-lg transition-all ${
                  isRecording 
                    ? 'text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                disabled={isTyping}
              >
                {isRecording ? (
                  <Square className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>

              {/* Send Button */}
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isTyping}
                className="m-2 h-8 w-8 p-0 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:from-muted disabled:to-muted transition-all"
              >
                <ArrowUp className="h-4 w-4 text-white" />
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground mt-2 text-center">
              AI Study Assistant can make mistakes. Consider checking important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};