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
  const [showQuestions, setShowQuestions] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const prompts = [
    'רוצה לשאול עוד משהו?',
    'בוא נמשיך...',
    'מה עוד מעניין אותך?',
    'יש לי עוד כמה דברים מעניינים...'
  ];

  useEffect(() => {
    if (!isVisible || questions.length === 0) {
      setShowQuestions(false);
      setTypingText('');
      return;
    }

    // Start typing animation after delay
    const timer = setTimeout(() => {
      const prompt = prompts[Math.floor(Math.random() * prompts.length)];
      let charIndex = 0;
      
      const typeInterval = setInterval(() => {
        if (charIndex <= prompt.length) {
          setTypingText(prompt.slice(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typeInterval);
          setTimeout(() => setShowQuestions(true), 300);
        }
      }, 40);

      return () => clearInterval(typeInterval);
    }, 800);

    return () => clearTimeout(timer);
  }, [isVisible, questions]);

  if (!isVisible || questions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mt-6 mb-4"
    >
      {/* Itamar's suggestion bubble */}
      <div className="flex items-start gap-3 mb-4">
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-main to-gold-secondary flex items-center justify-center text-white text-sm font-bold shrink-0"
        >
          א
        </motion.div>

        {/* Bubble with typing */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: -10 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          className="bg-gray-100 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[200px]"
        >
          <span className="text-sm text-gray-700">
            {typingText}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="inline-block w-0.5 h-4 bg-gray-400 mr-0.5 align-middle"
            />
          </span>
        </motion.div>
      </div>

      {/* Question cards - slide in from different directions */}
      <AnimatePresence>
        {showQuestions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2 pr-11"
          >
            {questions.map((q, index) => (
              <motion.button
                key={q.id}
                initial={{ 
                  opacity: 0, 
                  x: index % 2 === 0 ? -50 : 50,
                  scale: 0.8
                }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  scale: 1
                }}
                transition={{ 
                  delay: index * 0.15,
                  type: 'spring',
                  stiffness: 200,
                  damping: 20
                }}
                whileHover={{ 
                  scale: 1.02,
                  x: -5,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(q)}
                className="group relative w-full text-right"
              >
                {/* Card */}
                <div className="relative bg-white border-2 border-gray-200 rounded-xl px-4 py-3 transition-all group-hover:border-gold-main group-hover:shadow-lg group-hover:shadow-gold-main/10 overflow-hidden">
                  {/* Shimmer effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-main/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  
                  {/* Question text */}
                  <div className="relative flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 group-hover:text-near-black transition-colors">
                      {q.question}
                    </span>
                    
                    {/* Arrow */}
                    <motion.div
                      initial={{ x: 0, opacity: 0.5 }}
                      whileHover={{ x: -3, opacity: 1 }}
                      className="text-gold-main mr-auto"
                    >
                      <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.div>
                  </div>

                  {/* Number badge */}
                  <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-gray-100 text-[10px] flex items-center justify-center text-gray-400 font-mono group-hover:bg-gold-main/20 group-hover:text-gold-main transition-colors">
                    {index + 1}
                  </div>
                </div>
              </motion.button>
            ))}

            {/* Skip hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xs text-gray-400 text-center mt-3"
            >
              או הקלידו שאלה משלכם
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Compact version for when visual panel is open
export function SuggestedQuestionsCompact({ questions, onSelect, isVisible }: SuggestedQuestionsProps) {
  if (!isVisible || questions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-wrap gap-1.5 mt-3"
    >
      {questions.slice(0, 2).map((q, index) => (
        <motion.button
          key={q.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 + index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(q)}
          className="px-3 py-1.5 bg-gold-main/10 border border-gold-main/30 rounded-full text-xs text-gold-main hover:bg-gold-main/20 transition-colors truncate max-w-[180px]"
        >
          {q.question}
        </motion.button>
      ))}
    </motion.div>
  );
}

