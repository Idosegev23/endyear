'use client';

import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';

interface TextWithVideoProps {
  title: string;
  description?: string;
  video: string;
  videoTitle?: string;
  kpiValue?: number | string;
  kpiLabel?: string;
  kpiSuffix?: string;
}

export function TextWithVideo({ 
  title, 
  description,
  video,
  videoTitle,
  kpiValue,
  kpiLabel,
  kpiSuffix = ''
}: TextWithVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [video]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-deep-black rounded-2xl overflow-hidden"
    >
      {/* Title */}
      <div className="p-4 border-b border-gray-800">
        <h3 className="text-xl font-bold text-gold-main text-center">{title}</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 p-4">
        {/* Left - Text & KPI */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col justify-center"
        >
          {kpiValue && (
            <div className="text-center mb-4">
              <span className="text-5xl font-bold text-gold-main">
                {typeof kpiValue === 'number' ? kpiValue.toLocaleString() : kpiValue}
              </span>
              {kpiSuffix && <span className="text-3xl text-gold-main/80">{kpiSuffix}</span>}
              {kpiLabel && (
                <p className="text-lg text-gray-400 mt-2">{kpiLabel}</p>
              )}
            </div>
          )}
          
          {description && (
            <p className="text-lg text-white/80 leading-relaxed text-center">{description}</p>
          )}
        </motion.div>

        {/* Right - Video */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="relative rounded-xl overflow-hidden bg-gray-900"
        >
          <video
            ref={videoRef}
            src={video}
            className="w-full h-full object-contain"
            autoPlay
            muted
            loop
            playsInline
            controls
          />
          {videoTitle && (
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-sm font-medium text-white">{videoTitle}</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

