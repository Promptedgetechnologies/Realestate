'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface Photo {
  id: number;
  title: string;
  category: string;
  image: string;
  description?: string;
}

const photos: Photo[] = [
  {
    id: 1,
    title: 'Modern Living Room',
    category: 'Interior',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
    description: 'Spacious and elegantly designed living spaces',
  },
  {
    id: 2,
    title: 'Luxury Kitchen',
    category: 'Interior',
    image: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&q=80',
    description: 'State-of-the-art kitchen with premium appliances',
  },
  {
    id: 3,
    title: 'Master Bedroom',
    category: 'Interior',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    description: 'Comfortable and luxurious bedroom designs',
  },
  {
    id: 4,
    title: 'Swimming Pool',
    category: 'Amenities',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
    description: 'Resort-style pools for relaxation',
  },
  {
    id: 5,
    title: 'Gym & Fitness',
    category: 'Amenities',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
    description: 'Fully equipped fitness centers',
  },
  {
    id: 6,
    title: 'Rooftop Garden',
    category: 'Amenities',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
    description: 'Beautiful green spaces and gardens',
  },
  {
    id: 7,
    title: 'Exterior View',
    category: 'Exterior',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    description: 'Stunning architectural designs',
  },
  {
    id: 8,
    title: 'Balcony View',
    category: 'Exterior',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    description: 'Breathtaking views from every angle',
  },
  {
    id: 9,
    title: 'Parking Area',
    category: 'Amenities',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    description: 'Secure and spacious parking facilities',
  },
];

const categories = ['All', 'Interior', 'Exterior', 'Amenities'];

export default function PhotoGallery() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const filteredPhotos =
    selectedCategory === 'All'
      ? photos
      : photos.filter((photo) => photo.category === selectedCategory);

  const openLightbox = (photo: Photo) => {
    setSelectedPhoto(photo);
    setLightboxIndex(filteredPhotos.findIndex((p) => p.id === photo.id));
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    setLightboxIndex((prev) => {
      const newIndex = direction === 'next' 
        ? (prev + 1) % filteredPhotos.length
        : (prev - 1 + filteredPhotos.length) % filteredPhotos.length;
      setSelectedPhoto(filteredPhotos[newIndex]);
      return newIndex;
    });
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Property Gallery
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our stunning collection of property photos
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-nowrap sm:flex-wrap justify-start sm:justify-center gap-3 sm:gap-4 mb-12 overflow-x-auto pb-2">
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 sm:px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* Photo Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer"
                onClick={() => openLightbox(photo)}
              >
                <div className="aspect-square overflow-hidden bg-gray-200">
                  <img
                    src={photo.image}
                    alt={photo.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <span className="text-sm font-semibold text-primary-300 mb-1 block">
                      {photo.category}
                    </span>
                    <h3 className="text-xl font-bold mb-2">{photo.title}</h3>
                    {photo.description && (
                      <p className="text-sm text-gray-200">{photo.description}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedPhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
              onClick={closeLightbox}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative max-w-6xl max-h-[90vh] w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={filteredPhotos[lightboxIndex].image}
                  alt={filteredPhotos[lightboxIndex].title}
                  loading="lazy"
                  className="w-full h-full object-contain rounded-lg"
                />
                <button
                  onClick={closeLightbox}
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all"
                  aria-label="Close"
                >
                  <FiX className="w-6 h-6" />
                </button>
                {filteredPhotos.length > 1 && (
                  <>
                    <button
                      onClick={() => navigateLightbox('prev')}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all"
                      aria-label="Previous"
                    >
                      <FiChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => navigateLightbox('next')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all"
                      aria-label="Next"
                    >
                      <FiChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg">
                  <p className="font-semibold">{filteredPhotos[lightboxIndex].title}</p>
                  <p className="text-sm text-gray-200">{filteredPhotos[lightboxIndex].description}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

