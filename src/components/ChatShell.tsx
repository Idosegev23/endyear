'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { ImpactPanel } from './ImpactPanel';
import type { FlowQuestion } from '@/lib/flowQuestions';
import type { VisualPayload } from '@/lib/responseComposer';

interface ChatApiResponse {
  answer_text: string;
  intent_id: string;
  confidence: number;
  visual_payload: VisualPayload;
  next_question: FlowQuestion | null;
  missing_fields: string[];
}

interface Message {
  id: number;
  role: 'user' | 'bot';
  text: string;
  visual?: VisualPayload;
  isTyping?: boolean;
}

export function ChatShell() {
  const [input, setInput] = useState('');
  const [askedIntents, setAskedIntents] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingMessageId, setTypingMessageId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    isTyping,
    setIsTyping,
    setCurrentVisual,
    mode,
    setMode,
    setDebugInfo,
    setScene
  } = useAppStore();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingMessageId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message
    const userMsgId = Date.now();
    setMessages(prev => [...prev, {
      id: userMsgId,
      role: 'user',
      text: userMessage
    }]);

    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          askedIntents
        })
      });

      const data: ChatApiResponse = await response.json();

      // Add bot message with typing animation
      const botMsgId = Date.now() + 1;
      setMessages(prev => [...prev, {
        id: botMsgId,
        role: 'bot',
        text: data.answer_text,
        visual: data.visual_payload,
        isTyping: true
      }]);
      
      setTypingMessageId(botMsgId);
      setCurrentVisual(data.visual_payload);
      setDebugInfo(data.intent_id, data.confidence);
      
      if (data.intent_id !== 'UNKNOWN' && data.intent_id !== 'ERROR') {
        setAskedIntents(prev => [...prev, data.intent_id]);
      }

    } catch (error) {
      console.error('Chat error:', error);
      const errorMsgId = Date.now() + 1;
      setMessages(prev => [...prev, {
        id: errorMsgId,
        role: 'bot',
        text: 'משהו השתבש. ננסה שוב?',
        isTyping: true
      }]);
      setTypingMessageId(errorMsgId);
    } finally {
      setIsTyping(false);
    }
  };

  const handleTypingComplete = (msgId: number) => {
    setTypingMessageId(null);
    setMessages(prev => prev.map(m => 
      m.id === msgId ? { ...m, isTyping: false } : m
    ));
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-near-black px-6 py-3 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setScene('lobby')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="LEADERS" className="h-5 w-auto" />
            <span className="font-bold text-sm text-white">LEADERS 2025</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className={mode === 'admin' ? 'text-gold-main' : 'text-gray-500'}>Admin</span>
            <button
              onClick={() => setMode(mode === 'admin' ? 'show' : 'admin')}
              className={`w-8 h-4 rounded transition-colors ${mode === 'show' ? 'bg-gold-main' : 'bg-gray-600'}`}
            >
              <div className={`w-3 h-3 rounded bg-white shadow transform transition-transform ${mode === 'show' ? 'translate-x-0.5' : 'translate-x-4'}`} />
            </button>
            <span className={mode === 'show' ? 'text-gold-main' : 'text-gray-500'}>Show</span>
          </div>
          <button
            onClick={() => setScene('vision2026')}
            className="px-3 py-1.5 text-xs font-medium bg-white/10 text-white rounded hover:bg-white/20 transition-colors"
          >
            2026
          </button>
        </div>
      </header>

      {/* Main Content - Two Panels */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT SIDE - WHITE - Itamar's Input */}
        <motion.div layout className="w-[35%] flex flex-col bg-white border-l border-gray-200">
          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide flex flex-col justify-end">
            <div className="space-y-4">
              {messages.filter(m => m.role === 'user').map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 rounded-2xl px-5 py-4"
                >
                  <p className="text-gray-800 text-xl leading-relaxed">{msg.text}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="shrink-0 p-4 border-t border-gray-200">
            <form onSubmit={handleSubmit} className="relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="הקלד שאלה..."
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-lg focus:outline-none focus:border-gold-main focus:ring-2 focus:ring-gold-main/20 pl-14"
                disabled={isTyping || typingMessageId !== null}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping || typingMessageId !== null}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-gold-main flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gold-main/90 transition-colors"
              >
                <svg className="w-5 h-5 text-near-black rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </motion.div>

        {/* RIGHT SIDE - BLACK - Bot Responses (Chat Style) */}
        <motion.div layout className="w-[65%] bg-deep-black flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            <div className="space-y-6">
              {messages.filter(m => m.role === 'bot').map((msg) => (
                <BotMessageBubble 
                  key={msg.id}
                  message={msg}
                  isTyping={msg.id === typingMessageId}
                  onTypingComplete={() => handleTypingComplete(msg.id)}
                />
              ))}
              
              {/* Loading indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3 px-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-gold-main/20 flex items-center justify-center">
                    <div className="flex gap-1">
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-gold-main" />
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }} className="w-1.5 h-1.5 rounded-full bg-gold-main" />
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-gold-main" />
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Bot Message Bubble Component
function BotMessageBubble({ 
  message, 
  isTyping, 
  onTypingComplete 
}: { 
  message: Message; 
  isTyping: boolean;
  onTypingComplete: () => void;
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [showVisual, setShowVisual] = useState(false);

  useEffect(() => {
    if (!isTyping) {
      setDisplayedText(message.text);
      setShowVisual(true);
      return;
    }

    setDisplayedText('');
    setShowVisual(false);
    let index = 0;
    
    const interval = setInterval(() => {
      if (index < message.text.length) {
        setDisplayedText(message.text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setShowVisual(true);
          onTypingComplete();
        }, 300);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [message.text, isTyping, onTypingComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Text bubble */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gold-main/20 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-gold-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="flex-1 bg-gray-900 rounded-2xl rounded-tr-sm px-5 py-4">
          <p className="text-white text-lg leading-relaxed whitespace-pre-line">
            {displayedText}
            {isTyping && (
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="inline-block w-0.5 h-5 bg-gold-main ml-1 align-middle"
              />
            )}
          </p>
        </div>
      </div>

      {/* Visual - appears after text is done */}
      <AnimatePresence>
        {showVisual && message.visual && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', bounce: 0.3 }}
            className="mr-13 rounded-2xl overflow-hidden bg-gray-900 border border-gray-800"
            style={{ marginRight: '52px' }}
          >
            <div className="h-[400px]">
              <ImpactPanel expanded={true} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
