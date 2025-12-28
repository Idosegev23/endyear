'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface ImageCardProps {
  src: string;
  title?: string;
  description?: string;
}

export function ImageCard({ src, title, description }: ImageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', bounce: 0.3 }}
      className="relative overflow-hidden rounded-2xl bg-deep-black"
    >
      <div className="relative aspect-video w-full">
        <Image
          src={src}
          alt={title || 'Image'}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>
      
      {(title || description) && (
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {title && (
            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-white mb-2"
            >
              {title}
            </motion.h3>
          )}
          {description && (
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-gray-300"
            >
              {description}
            </motion.p>
          )}
        </div>
      )}
    </motion.div>
  );
}

