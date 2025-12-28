'use client';

import { motion } from 'framer-motion';
import CountUp from 'react-countup';

interface LeaderboardItem {
  rank: number;
  name: string;
  value: string | number;
  subtitle?: string;
}

interface LeaderboardProps {
  items: LeaderboardItem[];
  title: string;
  color?: string;
}

export function Leaderboard({ items, title, color = '#DDB258' }: LeaderboardProps) {
  const podiumColors = ['#DDB258', '#C0C0C0', '#CD7F32']; // Gold, Silver, Bronze
  const podiumHeights = [280, 220, 180];
  const podiumOrder = [1, 0, 2]; // Display order: 2nd, 1st, 3rd

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col p-8 overflow-hidden"
    >
      {/* Title - slides from right */}
      <motion.h3
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-3xl font-bold text-center mb-8"
      >
        {title}
      </motion.h3>

      {/* Epic Podium */}
      <div className="flex-1 flex items-end justify-center gap-6 pb-8">
        {podiumOrder.map((actualIndex, displayIndex) => {
          const item = items[actualIndex];
          if (!item) return null;

          const height = podiumHeights[actualIndex];
          const podiumColor = podiumColors[actualIndex];
          const isFirst = actualIndex === 0;

          return (
            <motion.div
              key={item.rank}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.3 + displayIndex * 0.2, 
                duration: 0.8, 
                type: 'spring',
                bounce: 0.3
              }}
              className="flex flex-col items-center"
              style={{ order: displayIndex }}
            >
              {/* Crown for #1 */}
              {isFirst && (
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1.2, duration: 0.5, type: 'spring' }}
                  className="text-5xl mb-2"
                >
                  
                </motion.div>
              )}

              {/* Avatar/Initial */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 + displayIndex * 0.15, duration: 0.4, type: 'spring' }}
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mb-3 ${
                  isFirst ? 'w-20 h-20 text-3xl' : ''
                }`}
                style={{ 
                  backgroundColor: podiumColor,
                  boxShadow: `0 10px 40px ${podiumColor}40`
                }}
              >
                {item.name.charAt(0)}
              </motion.div>

              {/* Name */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 + displayIndex * 0.1 }}
                className={`font-bold text-center mb-1 ${isFirst ? 'text-xl' : 'text-lg'}`}
              >
                {item.name}
              </motion.div>

              {/* Value with CountUp */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + displayIndex * 0.1, duration: 0.4, type: 'spring' }}
                className={`font-black mb-2 ${isFirst ? 'text-3xl' : 'text-2xl'}`}
                style={{ color: podiumColor }}
              >
                {typeof item.value === 'number' ? (
                  <CountUp end={item.value} duration={2} separator="," />
                ) : item.value}
              </motion.div>

              {/* Subtitle */}
              {item.subtitle && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 + displayIndex * 0.1 }}
                  className="text-xs text-gray-500 text-center max-w-24 mb-3"
                >
                  {item.subtitle}
                </motion.div>
              )}

              {/* Podium Block */}
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height, opacity: 1 }}
                transition={{ 
                  delay: 0.5 + displayIndex * 0.15, 
                  duration: 0.8, 
                  ease: 'easeOut' 
                }}
                className={`w-28 rounded-t-2xl flex flex-col items-center justify-start pt-6 relative overflow-hidden ${
                  isFirst ? 'w-32' : ''
                }`}
                style={{ 
                  background: `linear-gradient(180deg, ${podiumColor}30 0%, ${podiumColor}10 100%)`,
                  borderTop: `4px solid ${podiumColor}`
                }}
              >
                {/* Rank number */}
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.4 + displayIndex * 0.1, type: 'spring' }}
                  className={`font-black ${isFirst ? 'text-6xl' : 'text-5xl'}`}
                  style={{ color: podiumColor }}
                >
                  {actualIndex + 1}
                </motion.span>

                {/* Shine effect */}
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ delay: 1.5 + displayIndex * 0.2, duration: 0.8 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                />
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Rest of the list */}
      {items.length > 3 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.5 }}
          className="space-y-3 mt-4"
        >
          {items.slice(3).map((item, index) => (
            <motion.div
              key={item.rank}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2 + index * 0.1, duration: 0.4 }}
              className="flex items-center justify-between py-4 px-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <span 
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm"
                  style={{ backgroundColor: color }}
                >
                  {item.rank}
                </span>
                <span className="font-semibold">{item.name}</span>
              </div>
              <span className="font-bold text-lg" style={{ color }}>
                {typeof item.value === 'number' 
                  ? item.value.toLocaleString('he-IL')
                  : item.value
                }
              </span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
