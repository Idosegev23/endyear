'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import CountUp from 'react-countup';

interface VideoWithKpiProps {
  url: string;
  value: number | string;
  label: string;
  suffix?: string;
  prefix?: string;
  subtext?: string;
}

export function VideoWithKpi({ url, value, label, suffix = '', prefix = '', subtext }: VideoWithKpiProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showKpi, setShowKpi] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const handlePlayClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.muted = false;
        videoRef.current.play();
        setShowKpi(false);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const numericValue = typeof value === 'string' ? parseFloat(value) : value;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', bounce: 0.3 }}
      className="relative overflow-hidden rounded-2xl bg-deep-black"
    >
      <div className="relative aspect-video w-full">
        <video
          ref={videoRef}
          src={url}
          className="w-full h-full object-cover"
          loop
          playsInline
          muted
          onClick={handlePlayClick}
        />
        
        {showKpi && (
          <motion.div 
            className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-8 cursor-pointer"
            onClick={handlePlayClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', bounce: 0.4 }}
              className="text-center"
            >
              <div className="text-6xl font-black text-gold-main mb-4">
                {prefix}
                <CountUp end={numericValue} duration={2} separator="," decimals={value.toString().includes('.') ? 2 : 0} />
                {suffix}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{label}</h3>
              {subtext && (
                <p className="text-base text-gray-400">{subtext}</p>
              )}
              <div className="mt-6 flex items-center justify-center gap-2 text-gold-main">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span className="text-sm">לחץ לצפייה</span>
              </div>
            </motion.div>
          </motion.div>
        )}

        {!showKpi && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-black/60 flex items-center justify-center"
            onClick={handlePlayClick}
          >
            {isPlaying ? (
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}



