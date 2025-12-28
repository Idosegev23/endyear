'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

interface VideoItem {
  url: string;
  title?: string;
  description?: string;
}

interface VideoGalleryProps {
  videos: VideoItem[];
  title?: string;
}

export function VideoGallery({ videos, title }: VideoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [activeIndex]);

  const currentVideo = videos[activeIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-deep-black rounded-2xl overflow-hidden"
    >
      {title && (
        <div className="p-4 border-b border-gray-800">
          <h3 className="text-xl font-bold text-gold-main">{title}</h3>
        </div>
      )}
      
      {/* Main Video */}
      <div className="relative aspect-video">
        <video
          ref={videoRef}
          src={currentVideo.url}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
        {currentVideo.title && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <h4 className="text-lg font-bold text-white">{currentVideo.title}</h4>
            {currentVideo.description && (
              <p className="text-sm text-gray-300">{currentVideo.description}</p>
            )}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {videos.length > 1 && (
        <div className="flex gap-2 p-4 overflow-x-auto scrollbar-hide">
          {videos.map((video, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveIndex(index)}
              className={`relative shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                index === activeIndex ? 'border-gold-main' : 'border-transparent'
              }`}
            >
              <video
                src={video.url}
                className="w-full h-full object-cover"
                muted
                playsInline
              />
              {index === activeIndex && (
                <div className="absolute inset-0 bg-gold-main/20" />
              )}
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

