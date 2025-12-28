'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FlowQuestion } from '@/lib/flowQuestions';

interface SuggestedQuestionsProps {
  questions: FlowQuestion[];
  onSelect: (question: FlowQuestion) => void;
  isVisible: boolean;
}

export function SuggestedQuestions({ questions, onSelect, isVisible }: SuggestedQuestionsProps) {
  const [phase, setPhase] = useState<'idle' | 'bot-typing' | 'show-button'>('idle');
  const [botText, setBotText] = useState('');
  
  const nextQuestion = questions[0];

  useEffect(() => {
    if (!isVisible || !nextQuestion) {
      setPhase('idle');
      setBotText('');
      return;
    }

    // התחל typing של הבוט
    const timer1 = setTimeout(() => {
      setPhase('bot-typing');
      let charIndex = 0;
      const intro = nextQuestion.botIntro;
      
      const typeInterval = setInterval(() => {
        if (charIndex <= intro.length) {
          setBotText(intro.slice(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typeInterval);
          setTimeout(() => setPhase('show-button'), 400);
        }
      }, 25);

      return () => clearInterval(typeInterval);
    }, 600);

    return () => clearTimeout(timer1);
  }, [isVisible, nextQuestion]);

  if (!isVisible || !nextQuestion) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mt-6 mb-4 space-y-4"
    >
      {/* Bot hosting message */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-start gap-3"
      >
        {/* Bot Avatar */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-main to-gold-secondary flex items-center justify-center shrink-0 shadow-lg"
        >
          <svg className="w-5 h-5 text-near-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </motion.div>

        {/* Bot message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 bg-gray-100 rounded-2xl rounded-tr-sm px-5 py-4"
        >
          <span className="text-base text-gray-800 leading-relaxed">
            {botText}
            {phase === 'bot-typing' && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="inline-block w-0.5 h-5 bg-gold-main mr-1 align-middle"
              />
            )}
          </span>
        </motion.div>
      </motion.div>

      {/* Itamar's response button */}
      <AnimatePresence>
        {phase === 'show-button' && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="flex justify-end pr-2"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(nextQuestion)}
              className="group flex items-center gap-3"
            >
              {/* Button */}
              <motion.div
                initial={{ x: 20 }}
                animate={{ x: 0 }}
                className="relative bg-near-black text-white px-6 py-3 rounded-2xl rounded-tl-sm font-medium text-base shadow-lg overflow-hidden"
              >
                {/* Shine effect */}
                <motion.div
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
                
                <span className="relative">{nextQuestion.question}</span>
              </motion.div>

              {/* Itamar Avatar */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-near-black to-gray-800 flex items-center justify-center text-white font-bold shrink-0 shadow-lg border-2 border-gold-main"
              >
                א
              </motion.div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Compact version for when visual panel is open
export function SuggestedQuestionsCompact({ questions, onSelect, isVisible }: SuggestedQuestionsProps) {
  const [showContent, setShowContent] = useState(false);
  const nextQuestion = questions[0];
  
  useEffect(() => {
    if (isVisible && nextQuestion) {
      const timer = setTimeout(() => setShowContent(true), 500);
      return () => clearTimeout(timer);
    }
    setShowContent(false);
  }, [isVisible, nextQuestion]);

  if (!isVisible || !nextQuestion) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="mt-4 space-y-2"
    >
      {/* Bot intro - compact */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2"
      >
        <div className="w-6 h-6 rounded-lg bg-gold-main/20 flex items-center justify-center shrink-0">
          <svg className="w-3.5 h-3.5 text-gold-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-sm text-gray-600 flex-1 line-clamp-2">{nextQuestion.botIntro}</p>
      </motion.div>

      {/* Response button */}
      {showContent && (
        <motion.button
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(nextQuestion)}
          className="flex items-center gap-2 w-full justify-end"
        >
          <div className="bg-near-black text-white px-4 py-2 rounded-xl text-sm font-medium shadow-md">
            {nextQuestion.question}
          </div>
          <div className="w-7 h-7 rounded-lg bg-near-black flex items-center justify-center text-white text-xs font-bold border border-gold-main">
            א
          </div>
        </motion.button>
      )}
    </motion.div>
  );
}
