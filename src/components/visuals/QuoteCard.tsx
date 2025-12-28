'use client';

import { motion } from 'framer-motion';

interface QuoteCardProps {
  quote: string;
  author?: string;
  role?: string;
  color?: string;
  size?: 'normal' | 'large';
}

export function QuoteCard({ 
  quote, 
  author, 
  role, 
  color = '#DDB258',
  size = 'normal'
}: QuoteCardProps) {
  const isLarge = size === 'large';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col items-center justify-center p-12 relative overflow-hidden"
    >
      {/* Animated background pattern */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.03 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, ${color} 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Floating shapes */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="absolute top-20 right-20 w-32 h-32 rounded-full"
        style={{ backgroundColor: color }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.05, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute bottom-20 left-20 w-48 h-48 rounded-full"
        style={{ backgroundColor: color }}
      />

      {/* Large quote mark - animated */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
        animate={{ opacity: 0.15, scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
        className="absolute top-8 right-16 font-serif leading-none"
        style={{ 
          color,
          fontSize: isLarge ? '250px' : '180px'
        }}
      >
        ״
      </motion.div>

      {/* Quote text - words appear one by one effect */}
      <motion.blockquote
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className={`relative z-10 font-bold text-center leading-relaxed max-w-3xl ${
          isLarge ? 'text-5xl md:text-6xl' : 'text-3xl md:text-4xl'
        }`}
      >
        {quote.split(' ').map((word, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.05, duration: 0.4 }}
            className="inline-block mr-3"
          >
            {word}
          </motion.span>
        ))}
      </motion.blockquote>

      {/* Author section */}
      {author && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 + (quote.split(' ').length * 0.03), duration: 0.5 }}
          className="mt-10 flex items-center gap-5"
        >
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: 'spring', bounce: 0.4 }}
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl"
            style={{ 
              backgroundColor: color,
              boxShadow: `0 8px 30px ${color}40`
            }}
          >
            {author.charAt(0)}
          </motion.div>

          <div className="text-right">
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
              className="font-bold text-xl"
            >
              {author}
            </motion.div>
            {role && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
                className="text-gray-500"
              >
                {role}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {/* Decorative accent line */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 120 }}
        transition={{ delay: 1.3, duration: 0.6 }}
        className="h-1.5 mt-10 rounded-full"
        style={{ backgroundColor: color }}
      />
    </motion.div>
  );
}
