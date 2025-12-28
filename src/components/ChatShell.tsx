'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { ChatMessage, TypingIndicator } from './ChatMessage';
import { ImpactPanel } from './ImpactPanel';
import { getNextQuestions, getOpeningQuestions, FlowQuestion } from '@/lib/flowQuestions';
import { SuggestedQuestions, SuggestedQuestionsCompact } from './SuggestedQuestions';
import type { VisualPayload } from '@/lib/responseComposer';

interface ChatApiResponse {
  answer_text: string;
  intent_id: string;
  confidence: number;
  visual_payload: VisualPayload;
  missing_fields: string[];
  internal_debug?: {
    rationale: string;
    facts_used: string[];
  };
}

export function ChatShell() {
  const [input, setInput] = useState('');
  const [hasVisual, setHasVisual] = useState(false);
  const [askedIntents, setAskedIntents] = useState<string[]>([]);
  const [suggestedQuestions, setSuggestedQuestions] = useState<FlowQuestion[]>([]);
  const [lastIntentId, setLastIntentId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    messages,
    addMessage,
    isTyping,
    setIsTyping,
    setCurrentVisual,
    currentVisual,
    mode,
    setMode,
    setDebugInfo,
    setScene
  } = useAppStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    inputRef.current?.focus();
    // הצג שאלות פתיחה
    setSuggestedQuestions(getOpeningQuestions());
  }, []);

  // עדכן שאלות מוצעות אחרי כל תשובה
  useEffect(() => {
    if (lastIntentId && !isTyping) {
      const nextQuestions = getNextQuestions(lastIntentId, askedIntents);
      setSuggestedQuestions(nextQuestions);
    }
  }, [lastIntentId, askedIntents, isTyping]);

  useEffect(() => {
    setHasVisual(!!currentVisual && currentVisual.type !== 'QUOTE_CARD');
  }, [currentVisual]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    
    addMessage({
      role: 'user',
      text: userMessage
    });

    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          mode,
          current_scene: 'chat'
        })
      });

      const data: ChatApiResponse = await response.json();

      addMessage({
        role: 'bot',
        text: data.answer_text,
        intentId: data.intent_id,
        visualPayload: data.visual_payload
      });

      setCurrentVisual(data.visual_payload);
      setDebugInfo(data.intent_id, data.confidence);
      
      // שמור את ה-intent ועדכן שאלות מוצעות
      if (data.intent_id !== 'UNKNOWN' && data.intent_id !== 'ERROR') {
        setLastIntentId(data.intent_id);
        setAskedIntents(prev => [...prev, data.intent_id]);
      }

    } catch (error) {
      console.error('Chat error:', error);
      addMessage({
        role: 'bot',
        text: 'משהו השתבש. ננסה שוב?'
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = async (question: FlowQuestion) => {
    if (isTyping) return;
    
    // Add user message immediately
    addMessage({
      role: 'user',
      text: question.question
    });

    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: question.question,
          mode,
          current_scene: 'chat'
        })
      });

      const data: ChatApiResponse = await response.json();

      addMessage({
        role: 'bot',
        text: data.answer_text,
        intentId: data.intent_id,
        visualPayload: data.visual_payload
      });

      setCurrentVisual(data.visual_payload);
      setDebugInfo(data.intent_id, data.confidence);
      
      if (data.intent_id !== 'UNKNOWN' && data.intent_id !== 'ERROR') {
        setLastIntentId(data.intent_id);
        setAskedIntents(prev => [...prev, data.intent_id]);
      }

    } catch (error) {
      console.error('Chat error:', error);
      addMessage({
        role: 'bot',
        text: 'משהו השתבש. ננסה שוב?'
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-bg-base">
      {/* Header */}
      <header className="glass px-6 py-3 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setScene('lobby')}
            className="text-gray-500 hover:text-near-black transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-3">
            <img src="/logoblack.png" alt="LEADERS" className="h-5 w-auto" />
            <span className="font-bold text-sm">LEADERS 2025</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Mode Toggle */}
          <div className="flex items-center gap-2 text-xs">
            <span className={mode === 'admin' ? 'text-gold-main' : 'text-gray-400'}>
              Admin
            </span>
            <button
              onClick={() => setMode(mode === 'admin' ? 'show' : 'admin')}
              className={`w-8 h-4 rounded transition-colors ${
                mode === 'show' ? 'bg-gold-main' : 'bg-gray-300'
              }`}
            >
              <div className={`w-3 h-3 rounded bg-white shadow transform transition-transform ${
                mode === 'show' ? 'translate-x-0.5' : 'translate-x-4'
              }`} />
            </button>
            <span className={mode === 'show' ? 'text-gold-main' : 'text-gray-400'}>
              Show
            </span>
          </div>

          <button
            onClick={() => setScene('vision2026')}
            className="px-3 py-1.5 text-xs font-medium bg-white rounded border border-gray-200 hover:border-gold-main transition-colors"
          >
            2026
          </button>
        </div>
      </header>

      {/* Main Content - Visual takes priority */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Area - Shrinks when visual is present */}
        <motion.div 
          layout
          className={`flex flex-col min-w-0 transition-all duration-500 ${
            hasVisual ? 'w-[35%]' : 'w-full lg:w-[50%]'
          }`}
        >
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide">
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full flex flex-col items-center justify-center text-center px-4"
              >
                <div className="w-12 h-12 mb-4 rounded-lg bg-gold-main/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-gold-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">בוקר טוב</h3>
                <p className="text-gray-500 text-sm mb-6 max-w-xs">
                  שאלו אותי על הכנסות, קמפיינים, אנשים, חדשנות
                </p>
                <div className="flex flex-col gap-2 w-full max-w-sm">
                  {suggestedQuestions.slice(0, 3).map((q, index) => (
                    <motion.button
                      key={q.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: -5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSuggestionClick(q)}
                      className="group relative px-5 py-3.5 bg-white rounded-xl text-sm text-gray-700 hover:text-near-black transition-all shadow-sm hover:shadow-md text-right border-2 border-transparent hover:border-gold-main/50 overflow-hidden"
                    >
                      {/* Shimmer */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-main/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      
                      <span className="relative font-medium">{q.question}</span>
                      
                      {/* Arrow */}
                      <motion.span
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-main opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            <AnimatePresence>
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} compact={hasVisual} />
              ))}
              {isTyping && <TypingIndicator />}
            </AnimatePresence>

            {/* Suggested Questions - Itamar style */}
            {hasVisual ? (
              <SuggestedQuestionsCompact
                questions={suggestedQuestions}
                onSelect={handleSuggestionClick}
                isVisible={!isTyping && messages.length > 0}
              />
            ) : (
              <SuggestedQuestions
                questions={suggestedQuestions}
                onSelect={handleSuggestionClick}
                isVisible={!isTyping && messages.length > 0}
              />
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="shrink-0 px-4 py-3 border-t border-gray-200 bg-white">
            <form onSubmit={handleSubmit} className="relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="שאלו משהו..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold-main focus:ring-1 focus:ring-gold-main/20 pl-12"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-gold-main flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gold-main/90 transition-colors"
              >
                <svg className="w-4 h-4 text-near-black rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </motion.div>

        {/* Impact Panel - Expands when visual is present */}
        <motion.div 
          layout
          className={`border-r border-gray-200 bg-white transition-all duration-500 ${
            hasVisual ? 'w-[65%]' : 'hidden lg:block lg:w-[50%]'
          }`}
        >
          <ImpactPanel expanded={hasVisual} />
        </motion.div>
      </div>
    </div>
  );
}
