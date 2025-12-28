'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';

const topics = [
  { id: 'goals', title: 'יעדים', subtitle: 'מה הצבנו ומה השגנו' },
  { id: 'milestones', title: 'אבני דרך', subtitle: 'פרויקטים משמעותיים' },
  { id: 'innovation', title: 'חדשנות', subtitle: 'ניסוי וטעייה' },
  { id: 'challenges', title: 'אתגרים', subtitle: 'התמודדויות' },
  { id: 'culture', title: 'תרבות ארגונית', subtitle: 'אנשים וחיבורים' },
  { id: 'growth', title: 'צמיחה', subtitle: 'התפתחות אישית' },
  { id: 'future', title: 'מבט קדימה', subtitle: '2026' },
];

export function TopicsScreen() {
  const setScene = useAppStore((state) => state.setScene);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
    >
      <div className="max-w-3xl w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="inline-block mb-8"
          >
            <img src="/logoblack.png" alt="LEADERS" className="h-10 w-auto mx-auto" />
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-near-black mb-4">
            על מה נדבר היום?
          </h2>
          <p className="text-lg text-gray-500">
            שנה שלמה בכמה דקות
          </p>
        </motion.div>

        {/* Topics List - Elegant Typography */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-1 mb-16"
        >
          {topics.map((topic, index) => (
            <motion.div
              key={topic.id}
              variants={itemVariants}
              className="group flex items-center justify-between py-4 border-b border-gray-200 hover:border-gold-main transition-colors cursor-default"
            >
              <div className="flex items-center gap-6">
                <span className="text-sm text-gray-400 font-mono w-6">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-2xl md:text-3xl font-semibold text-near-black group-hover:text-gold-main transition-colors">
                  {topic.title}
                </span>
              </div>
              <span className="text-gray-400 text-sm md:text-base">
                {topic.subtitle}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA - Same bubble style as lobby */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setScene('chat')}
            className="relative group"
          >
            <svg 
              viewBox="0 0 220 70" 
              className="w-60 h-20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M4 4 H200 V50 H30 L20 66 L20 50 H4 Z"
                stroke="currentColor"
                strokeWidth="3"
                fill="transparent"
                className="text-near-black group-hover:fill-gray-50 transition-colors"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center pb-4 pr-4 text-xl font-bold text-near-black">
              בואו נתחיל
            </span>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
