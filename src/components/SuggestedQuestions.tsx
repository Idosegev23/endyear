'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FlowQuestion } from '@/lib/flowQuestions';

interface SuggestedQuestionsProps {
  questions: FlowQuestion[];
  onSelect: (question: FlowQuestion) => void;
  isVisible: boolean;
}

// משפטים שהבוט אומר לאיתמר - כמו שני מנחים
const botToItamarPrompts = [
  { bot: 'איתמר, מה אם נשאל עכשיו:', prefix: '' },
  { bot: 'בוא נמשיך עם משהו מעניין -', prefix: 'איתמר שואל:' },
  { bot: 'יש לי רעיון, תשאל אותי:', prefix: '' },
  { bot: 'איתמר, הנה השאלה הבאה:', prefix: '' },
  { bot: 'מה דעתך לשאול על זה?', prefix: 'איתמר:' },
  { bot: 'בוא נראה מה יש לי על:', prefix: '' },
  { bot: 'איתמר, תן לי להראות לכולם:', prefix: '' },
];

export function SuggestedQuestions({ questions, onSelect, isVisible }: SuggestedQuestionsProps) {
  const [phase, setPhase] = useState<'idle' | 'bot-typing' | 'show-question'>('idle');
  const [botText, setBotText] = useState('');
  const [questionPrefix, setQuestionPrefix] = useState('');
  const [prompt, setPrompt] = useState({ bot: '', prefix: '' });
  
  const nextQuestion = questions[0];

  useEffect(() => {
    if (!isVisible || !nextQuestion) {
      setPhase('idle');
      setBotText('');
      return;
    }

    // בחר prompt רנדומלי
    const randomPrompt = botToItamarPrompts[Math.floor(Math.random() * botToItamarPrompts.length)];
    setPrompt(randomPrompt);
    setQuestionPrefix(randomPrompt.prefix);

    // שלב 1: הבוט מתחיל לכתוב
    const timer1 = setTimeout(() => {
      setPhase('bot-typing');
      let charIndex = 0;
      
      const typeInterval = setInterval(() => {
        if (charIndex <= randomPrompt.bot.length) {
          setBotText(randomPrompt.bot.slice(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typeInterval);
          setTimeout(() => setPhase('show-question'), 300);
        }
      }, 40);

      return () => clearInterval(typeInterval);
    }, 800);

    return () => clearTimeout(timer1);
  }, [isVisible, nextQuestion]);

  if (!isVisible || !nextQuestion) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mt-6 mb-4 space-y-3"
    >
      {/* Bot speaks to Itamar */}
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
          className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-main to-gold-secondary flex items-center justify-center shrink-0 shadow-md"
        >
          <svg className="w-5 h-5 text-near-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </motion.div>

        {/* Bot message bubble */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-100 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[280px]"
        >
          <span className="text-sm text-gray-700">
            {botText}
            {phase === 'bot-typing' && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="inline-block w-0.5 h-4 bg-gray-400 mr-0.5 align-middle"
              />
            )}
          </span>
        </motion.div>
      </motion.div>

      {/* Itamar's question - appears after bot */}
      <AnimatePresence>
        {phase === 'show-question' && (
          <motion.div
            initial={{ opacity: 0, x: 20, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="flex items-start gap-3 justify-end pr-2"
          >
            {/* Question bubble - clickable */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onSelect(nextQuestion)}
              className="group relative max-w-[320px] text-right"
            >
              {/* Prefix if exists */}
              {questionPrefix && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-gray-400 mb-1 pr-1"
                >
                  {questionPrefix}
                </motion.p>
              )}

              <div className="relative bg-white border-2 border-near-black rounded-2xl rounded-tl-sm px-5 py-3.5 transition-all group-hover:border-gold-main group-hover:shadow-xl group-hover:shadow-gold-main/10 overflow-hidden">
                {/* Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-main/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                
                {/* Question */}
                <span className="relative text-base font-medium text-near-black">
                  {nextQuestion.question}
                </span>

                {/* Click pulse */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gold-main"
                />
              </div>
            </motion.button>

            {/* Itamar Avatar */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-near-black to-gray-800 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-md"
            >
              א
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint */}
      {phase === 'show-question' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-[11px] text-gray-400 text-center"
        >
          לחצו על השאלה להמשיך
        </motion.p>
      )}
    </motion.div>
  );
}

// Compact version for when visual panel is open
export function SuggestedQuestionsCompact({ questions, onSelect, isVisible }: SuggestedQuestionsProps) {
  const nextQuestion = questions[0];
  
  if (!isVisible || !nextQuestion) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="mt-3 space-y-2"
    >
      {/* Bot mini prompt */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center gap-2 text-xs text-gray-400"
      >
        <div className="w-5 h-5 rounded-md bg-gold-main/20 flex items-center justify-center">
          <svg className="w-3 h-3 text-gold-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <span>איתמר, מה דעתך על:</span>
      </motion.div>

      {/* Question button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelect(nextQuestion)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-near-black rounded-xl text-sm text-near-black hover:border-gold-main hover:shadow-lg transition-all w-full text-right"
      >
        <span className="w-6 h-6 rounded-lg bg-near-black text-white text-xs flex items-center justify-center font-bold shrink-0">
          א
        </span>
        <span className="flex-1 font-medium truncate">{nextQuestion.question}</span>
        <motion.div
          animate={{ x: [-2, 2, -2] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <svg className="w-4 h-4 text-gold-main rotate-180 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.div>
      </motion.button>
    </motion.div>
  );
}
