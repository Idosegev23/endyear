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

export function ChatShell() {
  const [input, setInput] = useState('');
  const [askedIntents, setAskedIntents] = useState<string[]>([]);
  const [userMessages, setUserMessages] = useState<string[]>([]);
  const [botResponse, setBotResponse] = useState<string>('');
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

      setBotResponse(data.answer_text);
      setCurrentVisual(data.visual_payload);
      setDebugInfo(data.intent_id, data.confidence);
      
      if (data.intent_id !== 'UNKNOWN' && data.intent_id !== 'ERROR') {
        setAskedIntents(prev => [...prev, data.intent_id]);
      }

    } catch (error) {
      console.error('Chat error:', error);
      setBotResponse('משהו השתבש. ננסה שוב?');
    } finally {
      setIsTyping(false);
    }
  };

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
          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            {userMessages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full flex flex-col items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 text-4xl font-bold"
                >
                  א
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">איתמר</h3>
                <p className="text-gray-500 text-center">
                  הקלד שאלה והתשובה תופיע בצד ימין
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {userMessages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 font-bold shrink-0">
                      א
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-2xl rounded-tr-sm px-4 py-3">
                      <p className="text-gray-800 text-lg leading-relaxed">{msg}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
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
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
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
          className="w-[65%] bg-deep-black flex flex-col"
        >
          {/* Bot response text - if there's also a visual */}
          {botResponse && currentVisual && currentVisual.type !== 'FORMATTED_TEXT' && currentVisual.type !== 'ANIMATED_LIST' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-8 py-6 border-b border-gray-800"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold-main/20 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-gold-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-white text-lg leading-relaxed whitespace-pre-line">{botResponse}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Visual / Main Content */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {isTyping ? (
                <motion.div
                  key="typing"
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
                    <span className="text-gray-400 text-lg">מעבד...</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <ImpactPanel expanded={true} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
