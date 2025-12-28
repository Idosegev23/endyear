'use client';

import { motion } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  timestamp: Date;
  intentId?: string;
}

interface ChatMessageProps {
  message: Message;
  compact?: boolean;
}

export function ChatMessage({ message, compact = false }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.4, 
        type: 'spring',
        bounce: 0.3
      }}
      className={`flex ${isUser ? 'justify-start' : 'justify-end'} mb-4`}
    >
      <motion.div
        initial={{ filter: 'blur(8px)' }}
        animate={{ filter: 'blur(0px)' }}
        transition={{ duration: 0.3 }}
        className={`${compact ? 'max-w-full' : 'max-w-[85%]'} ${
          isUser
            ? 'bg-near-black text-white rounded-2xl rounded-tr-md shadow-lg'
            : 'bg-white border border-gray-100 rounded-2xl rounded-tl-md shadow-md'
        } ${compact ? 'px-4 py-3' : 'px-5 py-4'}`}
        style={{
          boxShadow: isUser 
            ? '0 4px 20px rgba(0,0,0,0.15)' 
            : '0 4px 20px rgba(0,0,0,0.05)'
        }}
      >
        {/* Sender Label */}
        <motion.div 
          initial={{ opacity: 0, x: isUser ? -10 : 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className={`text-xs mb-2 font-medium ${
            isUser ? 'text-gray-400' : 'text-gold-main'
          }`}
        >
          {isUser ? 'איתמר' : 'LEADERS AI'}
        </motion.div>

        {/* Message Text - word by word reveal for bot */}
        <div className={`${compact ? 'text-sm' : 'text-[15px]'} leading-relaxed`}>
          {!isUser ? (
            message.text.split(' ').map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.02, duration: 0.2 }}
                className="inline-block ml-1"
              >
                {word}
              </motion.span>
            ))
          ) : (
            <span className="whitespace-pre-wrap">{message.text}</span>
          )}
        </div>

        {/* Timestamp */}
        {!compact && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`text-[11px] mt-3 ${
              isUser ? 'text-gray-500' : 'text-gray-400'
            }`}
          >
            {formatTime(message.timestamp)}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="flex justify-end mb-4"
    >
      <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-md px-5 py-4 shadow-md">
        <div className="text-xs text-gold-main mb-2 font-medium">LEADERS AI</div>
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2.5 h-2.5 rounded-md bg-gold-main"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.4, 1, 0.4],
                y: [0, -4, 0]
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('he-IL', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}
