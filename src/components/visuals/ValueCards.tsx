'use client';

import { motion } from 'framer-motion';
import CountUp from 'react-countup';

interface ValueCard {
  title: string;
  description: string;
  value?: number;
  suffix?: string;
  icon?: string;
  change?: number;
}

interface ValueCardsProps {
  cards: ValueCard[];
  title?: string;
  color?: string;
}

export function ValueCards({ cards, title, color = '#DDB258' }: ValueCardsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col p-8"
    >
      {/* Title */}
      {title && (
        <motion.h3
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-2xl font-bold text-center mb-8 text-white"
        >
          {title}
        </motion.h3>
      )}

      {/* Cards Grid */}
      <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: 0.1 + index * 0.1, 
              duration: 0.6, 
              type: 'spring',
              bounce: 0.3
            }}
            whileHover={{ 
              y: -8, 
              scale: 1.02,
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
            }}
            className="relative p-6 rounded-2xl overflow-hidden cursor-default bg-white/10 backdrop-blur-sm border border-white/10 group"
            style={{ 
              borderRight: `4px solid ${color}`
            }}
          >
            {/* Background glow on hover */}
            <motion.div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ 
                background: `radial-gradient(circle at top right, ${color}15 0%, transparent 70%)`
              }}
            />

            {/* Index number */}
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.08, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="absolute top-3 left-3 text-5xl font-black"
              style={{ color }}
            >
              {String(index + 1).padStart(2, '0')}
            </motion.div>

            {/* Icon */}
            {card.icon && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1, type: 'spring' }}
                className="text-4xl mb-4"
              >
                {card.icon}
              </motion.div>
            )}

            {/* Value with CountUp */}
            {card.value !== undefined && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="text-4xl font-black mb-2"
                style={{ color }}
              >
                <CountUp end={card.value} duration={2} separator="," />
                {card.suffix && <span className="text-2xl">{card.suffix}</span>}
              </motion.div>
            )}

            {/* Change indicator */}
            {card.change !== undefined && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold mb-2 ${
                  card.change >= 0 
                    ? 'bg-green-accent/10 text-green-accent' 
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {card.change >= 0 ? '+' : ''}{card.change}%
              </motion.div>
            )}

            {/* Title */}
            <motion.h4 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="font-bold text-lg mb-2"
              style={{ color }}
            >
              {card.title}
            </motion.h4>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="text-gray-400 text-sm leading-relaxed relative z-10"
            >
              {card.description}
            </motion.p>

            {/* Decorative corner */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="absolute bottom-0 left-0 w-16 h-16"
              style={{
                background: `linear-gradient(135deg, transparent 50%, ${color}10 50%)`
              }}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
