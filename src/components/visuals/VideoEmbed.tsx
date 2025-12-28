'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';

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
  thumbnail,
  color = '#DDB258'
}: VideoEmbedProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check if it's a local video file
  const isLocalVideo = url.startsWith('/') && (url.endsWith('.mp4') || url.endsWith('.mov') || url.endsWith('.webm'));
  const isInstagram = url.includes('instagram.com');
  const isYoutube = url.includes('youtube.com') || url.includes('youtu.be');

  // Extract video ID for thumbnail
  const getYoutubeThumbnail = () => {
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (youtubeMatch) {
      return `https://img.youtube.com/vi/${youtubeMatch[1]}/maxresdefault.jpg`;
    }
    return thumbnail || null;
  };

  const thumbUrl = isYoutube ? getYoutubeThumbnail() : thumbnail;

  const handlePlay = () => {
    if (isLocalVideo) {
      setIsPlaying(true);
      setIsModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full flex flex-col items-center justify-center p-8"
      >
        {/* Video Card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
          whileHover={{ scale: 1.02, y: -5 }}
          className="relative w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl cursor-pointer group"
          onClick={handlePlay}
        >
          {/* Thumbnail / Video Preview */}
          <div className="aspect-video bg-gray-900 relative overflow-hidden">
            {isLocalVideo ? (
              // Local video - show first frame as thumbnail
              <video
                src={url}
                className="w-full h-full object-cover"
                muted
                playsInline
                preload="metadata"
              />
            ) : thumbUrl ? (
              <motion.img
                src={thumbUrl}
                alt={title || 'Video'}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <svg className="w-20 h-20 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Play button */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring', bounce: 0.4 }}
              whileHover={{ scale: 1.1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center backdrop-blur-sm transition-all group-hover:scale-110"
                style={{ 
                  backgroundColor: `${color}CC`,
                  boxShadow: `0 0 60px ${color}80`
                }}
              >
                <svg 
                  className="w-10 h-10 text-white mr-[-4px]" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </motion.div>

            {/* Title overlay */}
            {title && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute bottom-0 left-0 right-0 p-6"
              >
                <h3 className="text-white text-2xl font-bold mb-2">{title}</h3>
                {description && (
                  <p className="text-white/80 text-sm">{description}</p>
                )}
              </motion.div>
            )}

            {/* Instagram badge */}
            {isInstagram && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, type: 'spring' }}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2z" fill="url(#instagram-gradient)"/>
                  <defs>
                    <linearGradient id="instagram-gradient" x1="2" y1="22" x2="22" y2="2">
                      <stop stopColor="#FCAF45"/>
                      <stop offset="0.5" stopColor="#E1306C"/>
                      <stop offset="1" stopColor="#5B51D8"/>
                    </linearGradient>
                  </defs>
                </svg>
                <span className="text-sm font-medium">Instagram</span>
              </motion.div>
            )}

            {/* Local video badge */}
            {isLocalVideo && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, type: 'spring' }}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2"
              >
                <svg className="w-5 h-5 text-gold-main" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
                </svg>
                <span className="text-sm font-medium">LEADERS</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Click hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-gray-500 text-sm mt-6"
        >
          לחצו לצפייה
        </motion.p>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(11, 11, 11, 0.95)' }}
            onClick={handleModalClose}
          >
            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute top-6 left-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
              onClick={handleModalClose}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            {/* Video container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.3 }}
              className="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              {isLocalVideo ? (
                // Local video player
                <video
                  ref={videoRef}
                  src={url}
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                  playsInline
                />
              ) : isInstagram ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white">
                  <p className="text-xl mb-6">פתיחה באינסטגרם</p>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
                    style={{ backgroundColor: color }}
                  >
                    פתח באינסטגרם
                  </a>
                </div>
              ) : (
                <iframe
                  src={url.replace('watch?v=', 'embed/')}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
