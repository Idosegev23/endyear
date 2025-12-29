'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import {
  KpiBigNumber,
  MiniChart,
  VideoEmbed,
  Leaderboard,
  QuoteCard,
  ValueCards,
  TimelineCard,
  AnimatedList,
  FormattedText,
  ImageCard,
  ImageWithKpi,
  VideoWithKpi,
  VideoGallery,
  ComparisonTable,
  ConsultantCards,
  AudioPlayer,
  LeaderboardWithVideos,
  ClosingSlide
} from './visuals';
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
  const [showClosingSlide, setShowClosingSlide] = useState(false);
  const [showFinishButton, setShowFinishButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const botMessagesEndRef = useRef<HTMLDivElement>(null);
  const botContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    isTyping,
    setIsTyping,
    mode,
    setMode,
    setDebugInfo,
    setScene
  } = useAppStore();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Scroll user messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Scroll bot messages
  useEffect(() => {
    botMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingMessageId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    
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

      const botMsgId = Date.now() + 1;
      setMessages(prev => [...prev, {
        id: botMsgId,
        role: 'bot',
        text: data.answer_text,
        visual: data.visual_payload,
        isTyping: true
      }]);
      
      setTypingMessageId(botMsgId);
      setDebugInfo(data.intent_id, data.confidence);
      
      if (data.intent_id !== 'UNKNOWN' && data.intent_id !== 'ERROR') {
        setAskedIntents(prev => [...prev, data.intent_id]);
      }
      
      // Show finish button after DEMO_INFLUENCERS
      if (data.intent_id === 'DEMO_INFLUENCERS') {
        setTimeout(() => setShowFinishButton(true), 2000);
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
          <button onClick={() => setScene('lobby')} className="text-gray-400 hover:text-white transition-colors">
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
          <button onClick={() => setScene('vision2026')} className="px-3 py-1.5 text-xs font-medium bg-white/10 text-white rounded hover:bg-white/20 transition-colors">
            2026
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT - Itamar */}
        <div className="w-[35%] flex flex-col bg-white border-l border-gray-200">
          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            <div className="space-y-4 min-h-full flex flex-col justify-end">
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
              <div ref={messagesEndRef} />
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
        </div>

        {/* RIGHT - Bot */}
        <div className="w-[65%] bg-deep-black flex flex-col overflow-hidden">
          <div ref={botContainerRef} className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            <div className="space-y-8 pb-8">
              {messages.filter(m => m.role === 'bot').map((msg) => (
                <BotMessageBubble 
                  key={msg.id}
                  message={msg}
                  isTyping={msg.id === typingMessageId}
                  onTypingComplete={() => handleTypingComplete(msg.id)}
                  scrollRef={botContainerRef}
                />
              ))}
              
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 px-4">
                  <div className="w-10 h-10 rounded-xl bg-gold-main/20 flex items-center justify-center">
                    <div className="flex gap-1">
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-gold-main" />
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }} className="w-1.5 h-1.5 rounded-full bg-gold-main" />
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-gold-main" />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={botMessagesEndRef} />
              
              {/* Finish Button */}
              <AnimatePresence>
                {showFinishButton && !showClosingSlide && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex justify-center mt-8"
                  >
                    <button
                      onClick={() => setShowClosingSlide(true)}
                      className="px-8 py-4 bg-gold-main text-near-black font-bold text-xl rounded-2xl hover:bg-gold-main/90 transition-colors shadow-lg"
                    >
                      שנסיים?
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      
      {/* Fullscreen Closing Slide */}
      <AnimatePresence>
        {showClosingSlide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-deep-black flex flex-col items-center justify-center"
          >
            {/* Background glow */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-main/20 rounded-full blur-3xl"
              />
            </div>

            {/* Logo */}
            <motion.img
              src="/logo.png"
              alt="LEADERS"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring', bounce: 0.4 }}
              className="relative z-10 h-24 mb-12"
            />

            {/* Title */}
            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="relative z-10 text-5xl md:text-7xl font-bold text-gold-main text-center mb-6"
            >
              שתהיה לנו 2026 מדהימה!
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="relative z-10 text-2xl text-white/80 text-center"
            >
              אנשים שיוצרים הזדמנויות
            </motion.p>

            {/* Decorative line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-main to-transparent"
            />

            {/* Back button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              onClick={() => setShowClosingSlide(false)}
              className="absolute top-6 left-6 text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Visual Renderer
function VisualRenderer({ visual }: { visual: VisualPayload }) {
  const { type, props } = visual;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = props as any;

  switch (type) {
    case 'KPI_BIG_NUMBER':
      return <KpiBigNumber {...p} />;
    case 'MINI_CHART':
      return <MiniChart {...p} />;
    case 'VIDEO_EMBED':
      return <VideoEmbed {...p} />;
    case 'LEADERBOARD':
      return <Leaderboard {...p} />;
    case 'QUOTE_CARD':
      return <QuoteCard {...p} />;
    case 'VALUE_CARDS':
      return <ValueCards {...p} />;
    case 'TIMELINE_CARD':
      return <TimelineCard {...p} />;
    case 'ANIMATED_LIST':
      return <AnimatedList {...p} />;
    case 'FORMATTED_TEXT':
      return <FormattedText {...p} />;
    case 'IMAGE_CARD':
      return <ImageCard {...p} />;
    case 'IMAGE_WITH_KPI':
      return <ImageWithKpi {...p} />;
    case 'VIDEO_WITH_KPI':
      return <VideoWithKpi {...p} />;
    case 'VIDEO_GALLERY':
      return <VideoGallery {...p} />;
    case 'COMPARISON_TABLE':
      return <ComparisonTable {...p} />;
    case 'CONSULTANT_CARDS':
      return <ConsultantCards {...p} />;
    case 'AUDIO_PLAYER':
      return <AudioPlayer {...p} />;
    case 'LEADERBOARD_WITH_VIDEOS':
      return <LeaderboardWithVideos {...p} />;
    case 'CLOSING_SLIDE':
      return <ClosingSlide {...p} />;
    default:
      return null;
  }
}

// Bot Message Bubble
function BotMessageBubble({ 
  message, 
  isTyping, 
  onTypingComplete,
  scrollRef
}: { 
  message: Message; 
  isTyping: boolean;
  onTypingComplete: () => void;
  scrollRef?: React.RefObject<HTMLDivElement>;
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [showVisual, setShowVisual] = useState(false);
  const bubbleRef = useRef<HTMLDivElement>(null);

  // גלילה הדרגתית בזמן ההקלדה
  const scrollToBottom = () => {
    if (scrollRef?.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    if (!isTyping) {
      setDisplayedText(message.text);
      setShowVisual(true);
      return;
    }

    setDisplayedText('');
    setShowVisual(false);
    let index = 0;
    let scrollCounter = 0;
    
    const interval = setInterval(() => {
      if (index < message.text.length) {
        setDisplayedText(message.text.slice(0, index + 1));
        index++;
        scrollCounter++;
        
        // גולל כל 10 תווים או בכל שורה חדשה
        if (scrollCounter >= 10 || message.text[index - 1] === '\n') {
          scrollToBottom();
          scrollCounter = 0;
        }
      } else {
        clearInterval(interval);
        scrollToBottom();
        setTimeout(() => {
          setShowVisual(true);
          onTypingComplete();
          scrollToBottom();
        }, 300);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [message.text, isTyping, onTypingComplete]);

  // Check if visual should replace text entirely
  const isFullVisual = message.visual && 
    (message.visual.type === 'FORMATTED_TEXT' || message.visual.type === 'ANIMATED_LIST');

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

      {/* Visual - only after text is done, and only if it's not a "full visual" type */}
      <AnimatePresence>
        {showVisual && message.visual && !isFullVisual && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', bounce: 0.3 }}
            className="rounded-2xl overflow-hidden bg-gray-900 border border-gray-800"
            style={{ marginRight: '52px' }}
          >
            <VisualRenderer visual={message.visual} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full visual (replaces nothing, just shows after) */}
      <AnimatePresence>
        {showVisual && message.visual && isFullVisual && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', bounce: 0.3 }}
            style={{ marginRight: '52px' }}
          >
            <VisualRenderer visual={message.visual} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
