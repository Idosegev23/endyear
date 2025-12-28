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
            {messages.length === 0 && suggestedQuestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full flex flex-col items-center justify-center px-4"
              >
                {/* Welcome */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center mb-10"
                >
                  <h3 className="text-2xl font-semibold mb-2">בוקר טוב</h3>
                  <p className="text-gray-500 text-sm">
                    מוכנים לסיכום השנה?
                  </p>
                </motion.div>

                {/* Bot and Itamar hosting together */}
                <motion.div className="w-full max-w-lg space-y-4">
                  {/* Bot message */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold-main to-gold-secondary flex items-center justify-center shrink-0 shadow-lg">
                      <svg className="w-6 h-6 text-near-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="flex-1 bg-gray-100 rounded-2xl rounded-tr-sm px-5 py-4"
                    >
                      <span className="text-base text-gray-800 leading-relaxed">
                        {suggestedQuestions[0].botIntro}
                      </span>
                    </motion.div>
                  </motion.div>

                  {/* Itamar's response */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
                    className="flex justify-end pr-2"
                  >
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleSuggestionClick(suggestedQuestions[0])}
                      className="group flex items-center gap-3"
                    >
                      {/* Button */}
                      <motion.div className="relative bg-near-black text-white px-6 py-3.5 rounded-2xl rounded-tl-sm font-medium text-base shadow-lg overflow-hidden">
                        {/* Shine effect */}
                        <motion.div
                          animate={{ x: ['-100%', '200%'] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        />
                        <span className="relative">{suggestedQuestions[0].question}</span>
                      </motion.div>

                      {/* Itamar Avatar */}
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-near-black to-gray-800 flex items-center justify-center text-white text-lg font-bold shrink-0 shadow-lg border-2 border-gold-main">
                        א
                      </div>
                    </motion.button>
                  </motion.div>
                </motion.div>
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
