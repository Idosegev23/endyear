'use client';

import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';

interface VideoEmbedProps {
  url: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  color?: string;
}

export function VideoEmbed({ 
  url, 
  title, 
  description,
}: VideoEmbedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check if it's a local video file
  const isLocalVideo = url.startsWith('/') && (url.endsWith('.mp4') || url.endsWith('.mov') || url.endsWith('.webm'));
  const isInstagram = url.includes('instagram.com');

  useEffect(() => {
    if (videoRef.current && isLocalVideo) {
      videoRef.current.play().catch(() => {});
    }
  }, [url, isLocalVideo]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full"
    >
      {/* Video Container */}
      <div className="relative rounded-xl overflow-hidden bg-gray-900">
        {isLocalVideo ? (
          // Local video - autoplay inline
          <video
            ref={videoRef}
            src={url}
            className="w-full aspect-video object-contain bg-black"
            autoPlay
            muted
            loop
            playsInline
            controls
          />
        ) : isInstagram ? (
          <div className="aspect-video flex flex-col items-center justify-center bg-gray-900 text-white">
            <p className="text-xl mb-6">פתיחה באינסטגרם</p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 bg-gold-main text-near-black"
            >
              פתח באינסטגרם
            </a>
          </div>
        ) : (
          <iframe
            src={url.replace('watch?v=', 'embed/') + '?autoplay=1'}
            className="w-full aspect-video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}

        {/* Title overlay */}
        {title && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent"
          >
            <h3 className="text-white text-xl font-bold">{title}</h3>
            {description && (
              <p className="text-white/80 text-sm">{description}</p>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
