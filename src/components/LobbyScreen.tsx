'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';

export function LobbyScreen() {
  const setScene = useAppStore((state) => state.setScene);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #000 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>
      
      {/* Decorative Elements */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.06 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-lg bg-gold-main blur-[120px]"
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10"
        >
          <img 
            src="/logoblack.png" 
            alt="LEADERS" 
            className="h-12 w-auto mx-auto"
          />
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-display-xl mb-4"
        >
          סיכום שנה
        </motion.h1>

        {/* Year */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-10"
        >
          <span className="text-display-lg text-gold-main">
            2025
          </span>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-lg text-gray-600 mb-12 leading-relaxed"
        >
          שקף פתיחה - מחכים שכולם יתכנסו
        </motion.p>

        {/* CTA Button - Chat Bubble Style like LEADERS logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setScene('topics')}
            className="relative group"
          >
            {/* Chat bubble SVG with tail on right side (RTL) */}
            <svg 
              viewBox="0 0 200 70" 
              className="w-56 h-20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Main bubble shape with tail on right */}
              <path 
                d="M4 4 H180 V50 H30 L20 66 L20 50 H4 Z"
                stroke="currentColor"
                strokeWidth="3"
                fill="transparent"
                className="text-near-black group-hover:fill-gray-50 transition-colors"
              />
            </svg>
            {/* Text overlay */}
            <span className="absolute inset-0 flex items-center justify-center pb-4 pr-6 text-2xl font-bold text-near-black">
              מתחילים
            </span>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
