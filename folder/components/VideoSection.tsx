'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlay, FiPause, FiVolume2, FiMaximize } from 'react-icons/fi';

interface VideoItem {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
}

const videos: VideoItem[] = [
  {
    id: 1,
    title: 'Luxury Villa Tour',
    description: 'Take a virtual tour of our premium villa collection',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: '3:45',
  },
  {
    id: 2,
    title: 'Modern Apartment Showcase',
    description: 'Explore contemporary living spaces with modern amenities',
    thumbnail: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: '4:20',
  },
  {
    id: 3,
    title: 'Penthouse Experience',
    description: 'Discover the epitome of luxury in our penthouse collection',
    thumbnail: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: '2:30',
  },
];

export default function VideoSection() {
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleVideoClick = (id: number) => {
    if (playingVideo === id) {
      setPlayingVideo(null);
    } else {
      setPlayingVideo(id);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Property Showcase Videos
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience our properties through immersive video tours
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="relative aspect-video overflow-hidden bg-gray-900">
                {playingVideo === video.id ? (
                  <video
                    className="w-full h-full object-cover"
                    controls
                    autoPlay
                    src={video.videoUrl}
                    onEnded={() => setPlayingVideo(null)}
                  />
                ) : (
                  <>
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleVideoClick(video.id)}
                        className="bg-white/90 hover:bg-white text-primary-600 rounded-full p-4 shadow-xl transition-all"
                        aria-label="Play video"
                      >
                        <FiPlay className="w-8 h-8 ml-1" />
                      </motion.button>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
                      {video.duration}
                    </div>
                  </>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800">{video.title}</h3>
                <p className="text-gray-600">{video.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

