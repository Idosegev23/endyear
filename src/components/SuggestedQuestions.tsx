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
  const [showQuestion, setShowQuestion] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [questionTyping, setQuestionTyping] = useState('');
  
  const nextQuestion = questions[0]; // תמיד לוקחים את הראשונה - לפי הסדר

  useEffect(() => {
    if (!isVisible || !nextQuestion) {
      setShowQuestion(false);
      setTypingText('');
      setQuestionTyping('');
      return;
    }

    // שלב 1: הבוט מציע
    const timer1 = setTimeout(() => {
      const prompts = [
        'ואיתמר ממשיך...',
        'השאלה הבאה:',
        'בואו נמשיך עם...',
        'ועכשיו...'
      ];
      const prompt = prompts[Math.floor(Math.random() * prompts.length)];
      let charIndex = 0;
      
      const typeInterval = setInterval(() => {
        if (charIndex <= prompt.length) {
          setTypingText(prompt.slice(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typeInterval);
          
          // שלב 2: השאלה של איתמר מופיעה
          setTimeout(() => {
            setShowQuestion(true);
            let qCharIndex = 0;
            const questionText = nextQuestion.question;
            
            const questionTypeInterval = setInterval(() => {
              if (qCharIndex <= questionText.length) {
                setQuestionTyping(questionText.slice(0, qCharIndex));
                qCharIndex++;
              } else {
                clearInterval(questionTypeInterval);
              }
            }, 30);
          }, 400);
        }
      }, 50);

      return () => clearInterval(typeInterval);
    }, 1000);

    return () => clearTimeout(timer1);
  }, [isVisible, nextQuestion]);

  if (!isVisible || !nextQuestion) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mt-6 mb-4"
    >
      {/* Bot suggesting */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2 mb-3 text-gray-400 text-sm"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-gold-main animate-pulse" />
        <span>{typingText}</span>
      </motion.div>

      {/* Itamar's next question - looks like he's typing */}
      <AnimatePresence>
        {showQuestion && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="flex items-start gap-3"
          >
            {/* Itamar Avatar */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-near-black to-gray-800 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-lg"
            >
              א
            </motion.div>

            {/* Question bubble - clickable */}
            <motion.button
              whileHover={{ scale: 1.01, x: -3 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onSelect(nextQuestion)}
              className="group relative flex-1 text-right"
            >
              <div className="relative bg-white border-2 border-gray-200 rounded-2xl rounded-tr-sm px-5 py-4 transition-all group-hover:border-gold-main group-hover:shadow-xl group-hover:shadow-gold-main/10 overflow-hidden">
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-main/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                {/* Question text with typing effect */}
                <div className="relative">
                  <span className="text-base font-medium text-gray-800 group-hover:text-near-black transition-colors">
                    {questionTyping}
                  </span>
                  <motion.span
                    animate={{ opacity: questionTyping.length < nextQuestion.question.length ? [1, 0] : 0 }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block w-0.5 h-5 bg-gold-main mr-1 align-middle"
                  />
                </div>

                {/* Click indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-main opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <motion.div
                    animate={{ x: [-2, 2, -2] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                </motion.div>
              </div>

              {/* Subtle hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
                className="text-[11px] text-gray-400 mt-1.5 pr-2"
              >
                לחצו להמשך או הקלידו שאלה אחרת
              </motion.p>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
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
      className="mt-3"
    >
      <motion.button
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelect(nextQuestion)}
        className="flex items-center gap-2 px-4 py-2 bg-gold-main/10 border border-gold-main/30 rounded-xl text-sm text-near-black hover:bg-gold-main/20 transition-colors w-full text-right"
      >
        <span className="w-6 h-6 rounded-lg bg-near-black text-white text-xs flex items-center justify-center font-bold shrink-0">
          א
        </span>
        <span className="flex-1 truncate">{nextQuestion.question}</span>
        <svg className="w-4 h-4 text-gold-main rotate-180 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>
    </motion.div>
  );
}
