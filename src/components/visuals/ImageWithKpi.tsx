'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import CountUp from 'react-countup';

interface ImageWithKpiProps {
  src: string;
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  subtext?: string;
}

export function ImageWithKpi({ src, value, label, suffix = '', prefix = '', subtext }: ImageWithKpiProps) {
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
          alt={label}
          fill
          className="object-cover opacity-40"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', bounce: 0.4 }}
          className="text-center"
        >
          <div className="text-7xl font-black text-gold-main mb-4">
            {prefix}
            <CountUp end={value} duration={2} separator="," />
            {suffix}
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">{label}</h3>
          {subtext && (
            <p className="text-lg text-gray-400">{subtext}</p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

