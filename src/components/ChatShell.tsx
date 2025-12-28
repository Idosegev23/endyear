'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { ImpactPanel } from './ImpactPanel';
import { BotResponse } from './visuals';
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

export function ChatShell() {
  const [input, setInput] = useState('');
  const [askedIntents, setAskedIntents] = useState<string[]>([]);
  const [userMessages, setUserMessages] = useState<string[]>([]);
  const [botResponse, setBotResponse] = useState<string>('');
  const [showVisual, setShowVisual] = useState(false);
  const [isTypingResponse, setIsTypingResponse] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    isTyping,
    setIsTyping,
    setCurrentVisual,
    currentVisual,
    mode,
    setMode,
    setDebugInfo,
    setScene
  } = useAppStore();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setUserMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    setBotResponse('');
    setShowVisual(false);
    setIsTypingResponse(false);

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

      setIsTyping(false);
      setIsTypingResponse(true);
      setBotResponse(data.answer_text);
      setCurrentVisual(data.visual_payload);
      setDebugInfo(data.intent_id, data.confidence);
      
      if (data.intent_id !== 'UNKNOWN' && data.intent_id !== 'ERROR') {
        setAskedIntents(prev => [...prev, data.intent_id]);
      }

    } catch (error) {
      console.error('Chat error:', error);
      setBotResponse('משהו השתבש. ננסה שוב?');
      setIsTyping(false);
      setIsTypingResponse(true);
    }
  };

  const handleTypingComplete = () => {
    setIsTypingResponse(false);
    setShowVisual(true);
  };

  // Check if visual should show alongside text or replace it
  const isTextOnlyVisual = currentVisual && 
    (currentVisual.type === 'FORMATTED_TEXT' || currentVisual.type === 'ANIMATED_LIST');

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header - Dark */}
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
            <span className={mode === 'admin' ? 'text-gold-main' : 'text-gray-500'}>
              Admin
            </span>
            <button
              onClick={() => setMode(mode === 'admin' ? 'show' : 'admin')}
              className={`w-8 h-4 rounded transition-colors ${
                mode === 'show' ? 'bg-gold-main' : 'bg-gray-600'
              }`}
            >
              <div className={`w-3 h-3 rounded bg-white shadow transform transition-transform ${
                mode === 'show' ? 'translate-x-0.5' : 'translate-x-4'
              }`} />
            </button>
            <span className={mode === 'show' ? 'text-gold-main' : 'text-gray-500'}>
              Show
            </span>
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
        <motion.div 
          layout
          className="w-[35%] flex flex-col bg-white border-l border-gray-200"
        >
          {/* Itamar's messages history */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide flex flex-col justify-end">
            <div className="space-y-4">
              {userMessages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 rounded-2xl px-5 py-4"
                >
                  <p className="text-gray-800 text-xl leading-relaxed">{msg}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="shrink-0 p-4 border-t border-gray-200">
            <form onSubmit={handleSubmit} className="relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="הקלד שאלה..."
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-lg focus:outline-none focus:border-gold-main focus:ring-2 focus:ring-gold-main/20 pl-14"
                disabled={isTyping || isTypingResponse}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping || isTypingResponse}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-gold-main flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gold-main/90 transition-colors"
              >
                <svg className="w-5 h-5 text-near-black rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </motion.div>

        {/* RIGHT SIDE - BLACK - Bot Response */}
        <motion.div 
          layout
          className="w-[65%] bg-deep-black flex flex-col overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {/* Loading state */}
            {isTyping && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex items-center justify-center"
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      className="w-3 h-3 rounded-full bg-gold-main"
                    />
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                      className="w-3 h-3 rounded-full bg-gold-main"
                    />
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                      className="w-3 h-3 rounded-full bg-gold-main"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Typing response */}
            {!isTyping && isTypingResponse && botResponse && (
              <motion.div
                key="typing-response"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full"
              >
                <BotResponse 
                  text={botResponse} 
                  speed={20}
                  onComplete={handleTypingComplete}
                />
              </motion.div>
            )}

            {/* Visual content after typing is complete */}
            {!isTyping && !isTypingResponse && showVisual && currentVisual && (
              <motion.div
                key="visual"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full"
              >
                <ImpactPanel expanded={true} />
              </motion.div>
            )}

            {/* Empty state */}
            {!isTyping && !isTypingResponse && !showVisual && !botResponse && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex items-center justify-center"
              >
                <motion.div
                  animate={{ opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-16 h-16 rounded-2xl bg-gold-main/10"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
