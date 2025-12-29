'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

interface LeaderboardItem {
  rank: number;
  name: string;
  value: number | string;
  suffix?: string;
  subtitle?: string;
}

interface VideoItem {
  url: string;
  title?: string;
}

interface LeaderboardWithVideosProps {
  title?: string;
  items: LeaderboardItem[];
  videos: VideoItem[];
}

export function LeaderboardWithVideos({ title, items, videos }: LeaderboardWithVideosProps) {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [activeVideoIndex]);

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-400 to-yellow-600';
      case 2: return 'from-gray-300 to-gray-500';
      case 3: return 'from-amber-600 to-amber-800';
      default: return 'from-gray-600 to-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-deep-black rounded-2xl overflow-hidden"
    >
      {title && (
        <div className="p-4 border-b border-gray-800">
          <h3 className="text-xl font-bold text-gold-main text-center">{title}</h3>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 p-4">
        {/* Left - Leaderboard */}
        <div className="space-y-3">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                index === activeVideoIndex ? 'bg-gold-main/20 border border-gold-main' : 'bg-gray-900 hover:bg-gray-800'
              }`}
              onClick={() => setActiveVideoIndex(index)}
            >
              {/* Medal */}
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getMedalColor(item.rank)} flex items-center justify-center shrink-0`}>
                <span className="text-lg font-bold text-white">{item.rank}</span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white truncate">{item.name}</p>
                {item.subtitle && (
                  <p className="text-xs text-gray-400">{item.subtitle}</p>
                )}
              </div>

              {/* Value */}
              <div className="text-right">
                <span className="text-xl font-bold text-gold-main">
                  {item.value}{item.suffix}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right - Video */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative rounded-xl overflow-hidden bg-gray-900 flex items-center justify-center"
          style={{ minHeight: '300px' }}
        >
          {videos[activeVideoIndex] && (
            <>
              <video
                ref={videoRef}
                src={videos[activeVideoIndex].url}
                className="max-w-full max-h-[400px] object-contain"
                autoPlay
                muted
                loop
                playsInline
              />
              {videos[activeVideoIndex].title && (
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-sm font-medium text-white">{videos[activeVideoIndex].title}</p>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>

      {/* Video thumbnails */}
      <div className="flex gap-2 p-4 pt-0">
        {videos.map((video, index) => (
          <button
            key={index}
            onClick={() => setActiveVideoIndex(index)}
            className={`relative w-20 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
              index === activeVideoIndex ? 'border-gold-main' : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <video
              src={video.url}
              className="w-full h-full object-cover"
              muted
              playsInline
            />
          </button>
        ))}
      </div>
    </motion.div>
  );
}


