'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface BotResponseProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export function BotResponse({ 
  text, 
  speed = 25,
  onComplete 
}: BotResponseProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
    
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col p-8 overflow-y-auto bg-deep-black"
    >
      {/* Bot Avatar */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', bounce: 0.4 }}
        className="flex items-center gap-4 mb-6"
      >
        <div className="w-12 h-12 rounded-xl bg-gold-main/20 flex items-center justify-center">
          <svg className="w-6 h-6 text-gold-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <div className="text-gold-main font-bold text-sm">LEADERS AI</div>
          {!isComplete && (
            <div className="text-gray-500 text-xs">מקליד...</div>
          )}
        </div>
      </motion.div>

      {/* Text with typing effect */}
      <div className="flex-1">
        <div className="text-white text-xl leading-relaxed whitespace-pre-line">
          {displayedText}
          {/* Blinking cursor */}
          {!isComplete && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="inline-block w-0.5 h-6 bg-gold-main ml-1 align-middle"
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}


