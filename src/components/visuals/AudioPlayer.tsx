'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
  src: string;
  title?: string;
  autoPlay?: boolean;
  lyrics?: string;
}

export function AudioPlayer({ src, title, autoPlay = true, lyrics }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      const timer = setTimeout(() => {
        audioRef.current?.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // Autoplay blocked by browser
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoPlay]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const dur = audioRef.current.duration;
      setCurrentTime(current);
      setDuration(dur);
      setProgress((current / dur) * 100);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Split lyrics into lines for animation
  const lyricsLines = lyrics?.split('\n') || [];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-gray-900 to-deep-black rounded-2xl p-6 border border-gold-main/30"
    >
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        onLoadedMetadata={handleTimeUpdate}
      />

      {/* Title */}
      {title && (
        <motion.h3
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-xl font-bold text-gold-main text-center mb-6"
        >
          {title}
        </motion.h3>
      )}

      {/* Visualizer */}
      <div className="flex items-center justify-center gap-1 h-16 mb-6">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1.5 bg-gold-main rounded-full"
            animate={{
              height: isPlaying ? [8, 24 + Math.random() * 24, 8] : 8,
            }}
            transition={{
              duration: 0.4,
              repeat: isPlaying ? Infinity : 0,
              delay: i * 0.05,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="w-14 h-14 rounded-full bg-gold-main flex items-center justify-center hover:bg-gold-main/90 transition-colors"
        >
          {isPlaying ? (
            <svg className="w-6 h-6 text-near-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-near-black ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <div className="flex-1">
          {/* Progress bar */}
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gold-main"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Time */}
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Lyrics */}
      {lyrics && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 bg-black/30 rounded-xl max-h-48 overflow-y-auto scrollbar-hide"
        >
          {lyricsLines.map((line, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="text-gray-300 text-center py-1 leading-relaxed"
            >
              {line}
            </motion.p>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}



