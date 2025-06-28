import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Phone, Video, MoreVertical, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'contact';
  timestamp: Date;
}

interface FullScreenChatProps {
  isOpen: boolean;
  onClose: () => void;
  contactName: string;
  contactAvatar?: string;
  initialMessage?: {
    content: string;
    timestamp: Date;
  };
}

export const FullScreenChat: React.FC<FullScreenChatProps> = ({
  isOpen,
  onClose,
  contactName,
  contactAvatar,
  initialMessage
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with the original message when chat opens
  useEffect(() => {
    if (isOpen && initialMessage) {
      setMessages([
        {
          id: '1',
          content: initialMessage.content,
          sender: 'contact',
          timestamp: initialMessage.timestamp
        }
      ]);
    }
  }, [isOpen, initialMessage]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate contact response
    setTimeout(() => {
      const contactResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: generateContactResponse(content, contactName),
        sender: 'contact',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, contactResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 2000);
  };

  const generateContactResponse = (userInput: string, contactName: string): string => {
    const input = userInput.toLowerCase();
    
    if (contactName === 'Mom') {
      if (input.includes('study') || input.includes('homework')) {
        return "That's wonderful! I'm so proud of how dedicated you are to your studies. Remember to take breaks and stay hydrated! 💕";
      } else if (input.includes('tired') || input.includes('stressed')) {
        return "Oh sweetie, don't push yourself too hard. Maybe take a little break and have some tea? I'm always here if you need to talk. ❤️";
      } else {
        return "Love you too, honey! Keep up the great work and don't forget to eat something healthy! 🥰";
      }
    } else if (contactName === 'Dad') {
      if (input.includes('math') || input.includes('problem')) {
        return "Great job tackling those problems! Remember, every challenge is just a puzzle waiting to be solved. You've got this! 💪";
      } else if (input.includes('project') || input.includes('assignment')) {
        return "That sounds like an interesting project! If you need any help brainstorming or want to discuss your ideas, I'm here. 👍";
      } else {
        return "Keep up the excellent work! I'm really impressed with your dedication. Let me know if you need any help with anything.";
      }
    } else if (contactName.includes('Ms.') || contactName.includes('Mr.')) {
      if (input.includes('question') || input.includes('help')) {
        return "Of course! I'm always happy to help clarify any concepts. Feel free to ask specific questions and I'll explain them step by step.";
      } else if (input.includes('assignment') || input.includes('homework')) {
        return "Good question about the assignment. Make sure to follow the rubric carefully and don't hesitate to ask if you need clarification on any requirements.";
      } else {
        return "Thank you for reaching out! Keep up the good work in class. Remember, my office hours are always open if you need additional support.";
      }
    } else {
      // Friends or other contacts
      if (input.includes('study')) {
        return "Yes! We should definitely study together. It's always more fun and productive when we can help each other out! 📚";
      } else if (input.includes('hang out') || input.includes('meet')) {
        return "Sounds great! When are you free? We could grab some coffee and catch up on everything! ☕";
      } else {
        return "Hey! Thanks for texting. I'm doing well, just keeping busy with school stuff. How about you? 😊";
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
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

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-background flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card shadow-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-10 w-10 p-0 rounded-full hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <Avatar className="h-10 w-10">
            {contactAvatar ? (
              <AvatarImage src={contactAvatar} alt={contactName} />
            ) : (
              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                {contactName.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>
          
          <div>
            <h2 className="font-semibold text-foreground">{contactName}</h2>
            <p className="text-sm text-green-600">Online</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-full">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-full">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-full">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex items-end gap-2 max-w-[80%]">
                {message.sender === 'contact' && (
                  <Avatar className="h-8 w-8">
                    {contactAvatar ? (
                      <AvatarImage src={contactAvatar} alt={contactName} />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                        {contactName.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                )}
                
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-md'
                      : 'bg-muted text-foreground rounded-bl-md'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-2 ${
                    message.sender === 'user' ? 'text-white/70' : 'text-muted-foreground'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-end gap-2">
              <Avatar className="h-8 w-8">
                {contactAvatar ? (
                  <AvatarImage src={contactAvatar} alt={contactName} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                    {contactName.charAt(0)}
                  </AvatarFallback>
                )}
              </Avatar>
              
              <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
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

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-card">
        <div className="relative">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Message ${contactName}...`}
            className="w-full resize-none rounded-2xl border border-border bg-background px-6 py-4 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 max-h-32 min-h-[3rem] placeholder:text-muted-foreground"
            rows={1}
            disabled={isTyping}
          />
          <Button
            onClick={() => handleSendMessage(inputValue)}
            disabled={!inputValue.trim() || isTyping}
            className="absolute right-2 top-2 h-10 w-10 p-0 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};