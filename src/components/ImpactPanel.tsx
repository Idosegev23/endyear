'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import {
  KpiBigNumber,
  MiniChart,
  VideoEmbed,
  Leaderboard,
  QuoteCard,
  ValueCards,
  TimelineCard
} from './visuals';

interface ImpactPanelProps {
  expanded?: boolean;
}

export function ImpactPanel({ expanded = false }: ImpactPanelProps) {
  const currentVisual = useAppStore((state) => state.currentVisual);

  const renderVisual = () => {
    if (!currentVisual) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-full flex flex-col items-center justify-center text-center px-8 relative"
        >
          {/* Animated background pattern */}
          <motion.div 
            animate={{ 
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, #DDB258 1px, transparent 0)`,
              backgroundSize: '48px 48px'
            }}
          />

          {/* Floating shapes */}
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-20 left-20 w-24 h-24 rounded-3xl bg-gold-main/5"
          />
          <motion.div
            animate={{ 
              y: [0, 20, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-20 right-20 w-32 h-32 rounded-full bg-green-accent/5"
          />

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
            className="relative z-10"
          >
            {/* Icon */}
            <motion.div 
              animate={{ 
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-gold-main/20 to-gold-main/5 flex items-center justify-center"
            >
              <svg className="w-12 h-12 text-gold-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
              </svg>
            </motion.div>

            <h3 className="text-2xl font-bold mb-3">Impact Panel</h3>
            <p className="text-gray-500 max-w-sm text-lg">
              שאלו שאלה והנתונים יופיעו כאן עם גרפיקות מרהיבות
            </p>
          </motion.div>
        </motion.div>
      );
    }

    const { type, props } = currentVisual;

    switch (type) {
      case 'KPI_BIG_NUMBER':
        return <KpiBigNumber {...(props as unknown as React.ComponentProps<typeof KpiBigNumber>)} />;
      
      case 'MINI_CHART':
        return <MiniChart {...(props as unknown as React.ComponentProps<typeof MiniChart>)} />;
      
      case 'VIDEO_EMBED':
        return <VideoEmbed {...(props as unknown as React.ComponentProps<typeof VideoEmbed>)} />;
      
      case 'LEADERBOARD':
        return <Leaderboard {...(props as unknown as React.ComponentProps<typeof Leaderboard>)} />;
      
      case 'QUOTE_CARD':
        return <QuoteCard {...(props as unknown as React.ComponentProps<typeof QuoteCard>)} />;
      
      case 'VALUE_CARDS':
        return <ValueCards {...(props as unknown as React.ComponentProps<typeof ValueCards>)} />;
      
      case 'TIMELINE_CARD':
        return <TimelineCard {...(props as unknown as React.ComponentProps<typeof TimelineCard>)} />;
      
      default:
        return (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">סוג תצוגה לא מזוהה</p>
          </div>
        );
    }
  };

  return (
    <div className={`h-full relative overflow-hidden ${
      expanded 
        ? 'bg-gradient-to-br from-white via-gray-50 to-white' 
        : 'bg-white'
    }`}>
      {/* Subtle grain overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none grain-overlay" />

      {/* Header - only when not expanded */}
      {!expanded && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 py-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gold-main animate-pulse" />
            <h2 className="font-bold text-sm text-gray-600">Impact Panel</h2>
          </div>
        </motion.div>
      )}

      {/* Visual Content with slide-in animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentVisual?.type || 'empty'}
          initial={{ opacity: 0, x: 100, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -100, scale: 0.95 }}
          transition={{ 
            duration: 0.5, 
            type: 'spring',
            bounce: 0.2
          }}
          className={`${expanded ? 'h-full' : 'h-[calc(100%-57px)]'}`}
        >
          {renderVisual()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
