'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface Consultant {
  name: string;
  role: string;
  description?: string;
  image?: string;
}

interface ConsultantCardsProps {
  consultants: Consultant[];
  title?: string;
}

export function ConsultantCards({ consultants, title }: ConsultantCardsProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      }
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="bg-deep-black rounded-2xl p-6"
    >
      {title && (
        <h3 className="text-2xl font-bold text-gold-main text-center mb-8">{title}</h3>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        {consultants.map((consultant, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className="bg-gray-900 rounded-xl p-6 flex flex-col items-center text-center"
          >
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-gold-main/50">
              {consultant.image ? (
                <Image
                  src={consultant.image}
                  alt={consultant.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gold-main to-gold-main/50 flex items-center justify-center">
                  <span className="text-2xl font-bold text-near-black">
                    {consultant.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <h4 className="text-2xl font-bold text-white mb-2">{consultant.name}</h4>
            <p className="text-lg text-gold-main mb-3">{consultant.role}</p>
            {consultant.description && (
              <p className="text-sm text-gray-400 line-clamp-4">{consultant.description}</p>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}


