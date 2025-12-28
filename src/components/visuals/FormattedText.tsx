'use client';

import { motion } from 'framer-motion';

interface Section {
  title: string;
  content: string[];
}

interface FormattedTextProps {
  title?: string;
  sections: Section[];
  color?: string;
}

export function FormattedText({ 
  title, 
  sections, 
  color = '#C9A04A' 
}: FormattedTextProps) {
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col p-8 overflow-y-auto bg-deep-black text-white scrollbar-hide"
    >
      {/* Main Title */}
      {title && (
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-center mb-8 pb-4 border-b border-gray-800"
          style={{ color }}
        >
          {title}
        </motion.h2>
      )}

      {/* Sections */}
      <div className="flex-1 space-y-6">
        {sections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              delay: index * 0.15,
              duration: 0.4,
              type: 'spring',
              stiffness: 100
            }}
            className="group"
          >
            {/* Section Title */}
            <motion.div
              className="flex items-center gap-3 mb-3"
            >
              <span 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                style={{ 
                  backgroundColor: `${color}20`,
                  color: color
                }}
              >
                {index + 1}
              </span>
              <h3 
                className="text-lg font-bold"
                style={{ color }}
              >
                {section.title}
              </h3>
            </motion.div>

            {/* Section Content */}
            <div className="pr-11 space-y-1">
              {section.content.map((line, lineIndex) => (
                <motion.p
                  key={lineIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.15 + lineIndex * 0.05 + 0.2 }}
                  className="text-gray-300 leading-relaxed"
                >
                  {line}
                </motion.p>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: sections.length * 0.15 + 0.5 }}
        className="mt-8 pt-4 border-t border-gray-800 text-center"
      >
        <p className="text-gray-500 text-sm">
          אם תרצה - אני יכול לבנות מצגת סיכום או לחדד לסגנון אחר
        </p>
      </motion.div>
    </motion.div>
  );
}

