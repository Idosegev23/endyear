'use client';

import { motion } from 'framer-motion';

interface TimelineStep {
  title: string;
  description: string;
  highlight?: boolean;
  date?: string;
}

interface TimelineCardProps {
  steps: TimelineStep[];
  title: string;
  color?: string;
}

export function TimelineCard({ steps, title, color = '#DDB258' }: TimelineCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col p-8 overflow-y-auto"
    >
      {/* Title - slides from right */}
      <motion.h3
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold text-center mb-10"
      >
        {title}
      </motion.h3>

      {/* Timeline */}
      <div className="flex-1 relative">
        {/* Vertical line */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: '100%' }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute right-6 top-0 w-0.5 bg-gradient-to-b from-transparent via-gray-200 to-transparent"
        />

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                delay: 0.3 + index * 0.2, 
                duration: 0.6,
                type: 'spring',
                bounce: 0.3
              }}
              className="relative flex items-start gap-6 pr-14"
            >
              {/* Dot with pulse effect */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.2, type: 'spring' }}
                className="absolute right-4 top-2"
              >
                {/* Pulse ring */}
                {step.highlight && (
                  <motion.div
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeOut'
                    }}
                    className="absolute inset-0 w-5 h-5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                )}
                
                {/* Main dot */}
                <div 
                  className={`w-5 h-5 rounded-full border-4 border-white shadow-lg relative z-10 ${
                    step.highlight ? '' : 'bg-gray-300'
                  }`}
                  style={{ 
                    backgroundColor: step.highlight ? color : undefined,
                    boxShadow: step.highlight ? `0 0 20px ${color}60` : undefined
                  }}
                />
              </motion.div>

              {/* Content card */}
              <motion.div
                whileHover={{ x: -5, scale: 1.02 }}
                className={`flex-1 p-6 rounded-2xl transition-all ${
                  step.highlight 
                    ? 'bg-white shadow-lg' 
                    : 'bg-gray-50'
                }`}
                style={{
                  borderRight: step.highlight ? `4px solid ${color}` : undefined
                }}
              >
                {/* Date badge */}
                {step.date && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.2 }}
                    className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3"
                    style={{ 
                      backgroundColor: `${color}15`,
                      color
                    }}
                  >
                    {step.date}
                  </motion.div>
                )}

                {/* Title */}
                <motion.h4
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 + index * 0.2 }}
                  className={`font-bold text-lg mb-2 ${
                    step.highlight ? '' : 'text-gray-700'
                  }`}
                  style={{ color: step.highlight ? color : undefined }}
                >
                  {step.title}
                </motion.h4>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.2 }}
                  className="text-gray-600 leading-relaxed"
                >
                  {step.description}
                </motion.p>

                {/* Decorative arrow for highlighted */}
                {step.highlight && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.2 }}
                    className="mt-4 flex items-center gap-2 text-sm font-medium"
                    style={{ color }}
                  >
                    <span>נקודת מפנה</span>
                    <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
