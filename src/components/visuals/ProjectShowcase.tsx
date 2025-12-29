'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRef, useEffect } from 'react';

interface ProjectShowcaseProps {
  title: string;
  screenshot?: string;
  screenshotCaption?: string;
  video?: string;
  videoTitle?: string;
}

export function ProjectShowcase({ 
  title, 
  screenshot, 
  screenshotCaption,
  video,
  videoTitle
}: ProjectShowcaseProps) {
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

      <div className="p-4 space-y-4">
        {/* Screenshot - Message */}
        {screenshot && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-start gap-4"
          >
            <div className="flex-1 flex flex-col items-center">
              <div className="relative w-full max-w-xs rounded-xl overflow-hidden bg-gray-900 shadow-lg">
                <Image
                  src={screenshot}
                  alt={screenshotCaption || 'Screenshot'}
                  width={300}
                  height={400}
                  className="w-full h-auto object-contain"
                />
              </div>
              {screenshotCaption && (
                <p className="text-sm text-gold-main mt-2 text-center">{screenshotCaption}</p>
              )}
            </div>
          </motion.div>
        )}

        {/* Video */}
        {video && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative rounded-xl overflow-hidden bg-gray-900"
          >
            <video
              ref={videoRef}
              src={video}
              className="w-full aspect-video object-contain bg-black"
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
        )}
      </div>
    </motion.div>
  );
}

