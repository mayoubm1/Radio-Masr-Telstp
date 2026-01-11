import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { MessageCircle, Send, Smile, Shield, X, User, Bot, Heart, ThumbsUp, Laugh, Sparkles } from 'lucide-react';

interface ChatMessage {
  id: string;
  room_id: string;
  user_id: string | null;
  user_name: string;
  user_avatar: string | null;
  content: string;
  message_type: string;
  is_ai_response: boolean;
  is_moderated: boolean;
  reactions: Record<string, number>;
  created_at: string;
}

interface LiveChatProps {
  roomId?: string;
  programName?: string;
  isMinimized?: boolean;
  onToggle?: () => void;
}

const LiveChat: React.FC<LiveChatProps> = ({ 
  roomId = 'main', 
  programName = 'Main Broadcast',
  isMinimized = false,
  onToggle 
}) => {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const emojis = ['👍', '❤️', '😂', '🔥', '👏', '🎉', '💡', '🙏'];
  const reactions = [
    { icon: Heart, label: 'love', color: 'text-red-400' },
    { icon: ThumbsUp, label: 'like', color: 'text-blue-400' },
    { icon: Laugh, label: 'haha', color: 'text-yellow-400' },
    { icon: Sparkles, label: 'wow', color: 'text-purple-400' }
  ];

  // Initialize with demo messages
  useEffect(() => {
    const demoMessages: ChatMessage[] = [
      {
        id: '1',
        room_id: roomId,
        user_id: null,
        user_name: 'Dr. Amira Hassan',
        user_avatar: 'https://d64gsuwffb70l.cloudfront.net/68bf9d4eab4ef54ccf5391b5_1757388176912_a4783b35.webp',
        content: 'Welcome to today\'s broadcast! We\'re discussing the latest breakthroughs in gene therapy.',
        message_type: 'text',
        is_ai_response: true,
        is_moderated: false,
        reactions: { love: 12, like: 8 },
        created_at: new Date(Date.now() - 300000).toISOString()
      },
      {
        id: '2',
        room_id: roomId,
        user_id: 'user1',
        user_name: 'Ahmed M.',
        user_avatar: null,
        content: 'This is fascinating! Can you tell us more about CRISPR applications?',
        message_type: 'text',
        is_ai_response: false,
        is_moderated: false,
        reactions: { like: 3 },
        created_at: new Date(Date.now() - 240000).toISOString()
      },
      {
        id: '3',
        room_id: roomId,
        user_id: null,
        user_name: 'Dr. Amira Hassan',
        user_avatar: 'https://d64gsuwffb70l.cloudfront.net/68bf9d4eab4ef54ccf5391b5_1757388176912_a4783b35.webp',
        content: 'Great question, Ahmed! CRISPR technology has revolutionized genetic research...',
        message_type: 'text',
        is_ai_response: true,
        is_moderated: false,
        reactions: { love: 5, wow: 7 },
        created_at: new Date(Date.now() - 180000).toISOString()
      },
      {
        id: '4',
        room_id: roomId,
        user_id: 'user2',
        user_name: 'Sarah K.',
        user_avatar: null,
        content: 'Listening from Germany! Love this show 🇩🇪',
        message_type: 'text',
        is_ai_response: false,
        is_moderated: false,
        reactions: { love: 8, like: 4 },
        created_at: new Date(Date.now() - 120000).toISOString()
      }
    ];
    setMessages(demoMessages);
    setIsConnected(true);
  }, [roomId]);

  // Subscribe to realtime messages
  useEffect(() => {
    const channel = supabase
      .channel(`chat:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          setMessages(prev => [...prev, newMsg]);
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageContent = newMessage.trim();
    setNewMessage('');

    // Create optimistic message
    const optimisticMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      room_id: roomId,
      user_id: user?.id || null,
      user_name: profile?.display_name || user?.email?.split('@')[0] || 'Guest',
      user_avatar: profile?.avatar_url || null,
      content: messageContent,
      message_type: 'text',
      is_ai_response: false,
      is_moderated: false,
      reactions: {},
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, optimisticMessage]);

    // Try to save to database
    if (user) {
      try {
        await supabase.from('chat_messages').insert({
          room_id: roomId,
          user_id: user.id,
          user_name: profile?.display_name || user.email?.split('@')[0] || 'User',
          user_avatar: profile?.avatar_url,
          content: messageContent,
          message_type: 'text',
          is_ai_response: false
        });
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }

    // Simulate AI response for certain keywords
    if (messageContent.toLowerCase().includes('?')) {
      setTimeout(() => {
        const aiResponse: ChatMessage = {
          id: `ai-${Date.now()}`,
          room_id: roomId,
          user_id: null,
          user_name: 'Dr. Amira Hassan',
          user_avatar: 'https://d64gsuwffb70l.cloudfront.net/68bf9d4eab4ef54ccf5391b5_1757388176912_a4783b35.webp',
          content: 'That\'s a great question! Let me address that in our next segment. Stay tuned!',
          message_type: 'text',
          is_ai_response: true,
          is_moderated: false,
          reactions: {},
          created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 2000);
    }
  };

  const handleReaction = (messageId: string, reactionType: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const currentCount = msg.reactions[reactionType] || 0;
        return {
          ...msg,
          reactions: {
            ...msg.reactions,
            [reactionType]: currentCount + 1
          }
        };
      }
      return msg;
    }));
  };

  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isMinimized) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-4 rounded-full shadow-lg shadow-cyan-500/30 hover:scale-110 transition-transform z-50"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
          {messages.length}
        </span>
      </button>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-blue-900/30 to-gray-900 rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 overflow-hidden flex flex-col h-[500px]">
      {/* Header */}
      <div className="bg-black/40 px-4 py-3 border-b border-cyan-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <MessageCircle className="w-5 h-5 text-cyan-400" />
            <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Live Chat</h3>
            <p className="text-gray-400 text-xs">{programName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{messages.length} messages</span>
          {onToggle && (
            <button onClick={onToggle} className="text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.is_ai_response ? 'bg-cyan-500/10 -mx-4 px-4 py-3' : ''}`}
          >
            {/* Avatar */}
            <div className="flex-shrink-0">
              {message.user_avatar ? (
                <img
                  src={message.user_avatar}
                  alt={message.user_name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`font-medium text-sm ${message.is_ai_response ? 'text-cyan-400' : 'text-white'}`}>
                  {message.user_name}
                </span>
                {message.is_ai_response && (
                  <span className="flex items-center gap-1 text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full">
                    <Bot className="w-3 h-3" />
                    AI Host
                  </span>
                )}
                <span className="text-xs text-gray-500">{formatTime(message.created_at)}</span>
              </div>
              <p className="text-gray-300 text-sm break-words">{message.content}</p>
              
              {/* Reactions */}
              {Object.keys(message.reactions).length > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  {Object.entries(message.reactions).map(([type, count]) => (
                    <button
                      key={type}
                      onClick={() => handleReaction(message.id, type)}
                      className="flex items-center gap-1 bg-black/30 hover:bg-black/50 px-2 py-1 rounded-full text-xs transition-colors"
                    >
                      {reactions.find(r => r.label === type)?.icon && (
                        React.createElement(reactions.find(r => r.label === type)!.icon, {
                          className: `w-3 h-3 ${reactions.find(r => r.label === type)?.color}`
                        })
                      )}
                      <span className="text-gray-400">{count}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Quick Reactions */}
              <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {reactions.map((reaction) => (
                  <button
                    key={reaction.label}
                    onClick={() => handleReaction(message.id, reaction.label)}
                    className="p-1 hover:bg-black/30 rounded transition-colors"
                  >
                    <reaction.icon className={`w-4 h-4 ${reaction.color}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <div className="px-4 py-2 text-xs text-gray-400">
          {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
        </div>
      )}

      {/* Input */}
      <div className="bg-black/40 p-4 border-t border-cyan-500/20">
        {!user ? (
          <p className="text-center text-gray-400 text-sm">
            Sign in to join the conversation
          </p>
        ) : (
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="text-gray-400 hover:text-cyan-400 transition-colors p-2"
              >
                <Smile className="w-5 h-5" />
              </button>
              
              {showEmojiPicker && (
                <div className="absolute bottom-full mb-2 left-0 bg-gray-800 rounded-lg p-2 shadow-xl border border-gray-700 flex gap-1">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => addEmoji(emoji)}
                      className="text-xl hover:bg-gray-700 p-1 rounded transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 bg-black/30 border border-gray-700 rounded-lg py-2 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors text-sm"
            />

            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveChat;
