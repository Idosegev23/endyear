'use client';

import { motion } from 'framer-motion';

interface AnimatedListProps {
  title?: string;
  items: string[];
  color?: string;
}

export function AnimatedList({ 
  title, 
  items, 
  color = '#C9A04A' 
}: AnimatedListProps) {
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col p-8 overflow-hidden bg-deep-black text-white"
    >
      {/* Title */}
      {title && (
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center mb-8"
          style={{ color }}
        >
          {title}
        </motion.h2>
      )}

      {/* Animated Items List */}
      <div className="flex-1 flex flex-col justify-center gap-3 max-w-2xl mx-auto w-full">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              delay: index * 0.3,
              duration: 0.5,
              type: 'spring',
              stiffness: 100
            }}
            className="flex items-center gap-4 group"
          >
            {/* Number Circle */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                delay: index * 0.3 + 0.1,
                type: 'spring',
                stiffness: 200
              }}
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 font-bold text-lg"
              style={{ 
                backgroundColor: `${color}20`,
                color: color,
                border: `2px solid ${color}40`
              }}
            >
              {index + 1}
            </motion.div>

            {/* Item Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.3 + 0.2 }}
              className="flex-1 py-3 px-4 rounded-xl bg-gray-900/50 border border-gray-800 group-hover:border-gray-700 transition-colors"
            >
              <span className="text-lg leading-relaxed">{item}</span>
            </motion.div>

            {/* Checkmark that appears after item settles */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: index * 0.3 + 0.4,
                type: 'spring',
                stiffness: 300
              }}
              className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${color}30` }}
            >
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke={color} 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Bottom accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: items.length * 0.3 + 0.5, duration: 0.5 }}
        className="h-1 rounded-full mt-8 origin-right"
        style={{ backgroundColor: color }}
      />
    </motion.div>
  );
}

