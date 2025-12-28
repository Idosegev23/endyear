'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number; // מילישניות בין תווים
  onComplete?: () => void;
}

export function TypewriterText({ 
  text, 
  speed = 30,
  onComplete 
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Reset when text changes
    setDisplayedText('');
    setCurrentIndex(0);
    setIsComplete(false);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (currentIndex === text.length && text.length > 0 && !isComplete) {
      setIsComplete(true);
      onComplete?.();
    }
  }, [currentIndex, text, speed, onComplete, isComplete]);

  return (
    <div className="relative">
      <span className="whitespace-pre-line leading-relaxed">
        {displayedText}
      </span>
      {/* Cursor */}
      {!isComplete && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block w-0.5 h-6 bg-gold-main ml-1 align-middle"
        />
      )}
    </div>
  );
}

