'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface ClosingSlideProps {
  title: string;
  subtitle: string;
  logo?: string;
}

export function ClosingSlide({ title, subtitle, logo = '/logo.png' }: ClosingSlideProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-[400px] flex flex-col items-center justify-center p-12 bg-gradient-to-br from-deep-black via-near-black to-deep-black rounded-2xl overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-main/20 rounded-full blur-3xl"
        />
      </div>

      {/* Logo */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', bounce: 0.4 }}
        className="relative z-10 mb-8"
      >
        <Image
          src={logo}
          alt="LEADERS"
          width={200}
          height={80}
          className="object-contain"
        />
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 text-4xl md:text-5xl font-bold text-gold-main text-center mb-4"
      >
        {title}
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="relative z-10 text-xl text-white/80 text-center"
      >
        {subtitle}
      </motion.p>

      {/* Decorative elements */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-main to-transparent"
      />
    </motion.div>
  );
}


