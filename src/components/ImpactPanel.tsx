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
  TimelineCard,
  AnimatedList,
  FormattedText
} from './visuals';

interface ImpactPanelProps {
  expanded?: boolean;
}

export function ImpactPanel({ expanded = false }: ImpactPanelProps) {
  const currentVisual = useAppStore((state) => state.currentVisual);

  const renderVisual = () => {
    if (!currentVisual) {
      return (
        <div className="h-full flex items-center justify-center">
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-16 h-16 rounded-2xl bg-gold-main/20 flex items-center justify-center"
          >
            <div className="w-8 h-8 rounded-xl bg-gold-main/40" />
          </motion.div>
        </div>
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
      
      case 'ANIMATED_LIST':
        return <AnimatedList {...(props as unknown as React.ComponentProps<typeof AnimatedList>)} />;
      
      case 'FORMATTED_TEXT':
        return <FormattedText {...(props as unknown as React.ComponentProps<typeof FormattedText>)} />;
      
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
        ? 'bg-gradient-to-br from-near-black via-dark-900 to-near-black' 
        : 'bg-near-black'
    }`}>
      {/* Subtle grain overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none grain-overlay" />

      {/* Header - only when not expanded */}
      {!expanded && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 py-4 border-b border-gray-800 bg-near-black/90 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gold-main animate-pulse" />
            <h2 className="font-bold text-sm text-gray-400">Impact Panel</h2>
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
