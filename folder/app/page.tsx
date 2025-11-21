'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiSearch, FiMapPin, FiTrendingUp, FiHome, FiStar, FiAward, FiUsers } from 'react-icons/fi';
import { getProperties, getLocations, Property } from '@/lib/data-loader';
import PropertyCard from '@/components/PropertyCard';
import ChatbotWidget from '@/components/ChatbotWidget';
import BannerCarousel from '@/components/BannerCarousel';
import VideoSection from '@/components/VideoSection';
import PhotoGallery from '@/components/PhotoGallery';

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [locations, setLocations] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);

  useEffect(() => {
    const allProperties = getProperties();
    setProperties(allProperties);
    setLocations(getLocations());
    // Get top 3 most popular properties
    setFeaturedProperties(
      [...allProperties]
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 3)
    );
  }, []);

  const trendingLocations = locations?.areas?.filter((area: any) => area.trending) || [];
  const trendingCities = locations?.cities?.filter((city: any) => city.trending) || [];

  const propertyCategories = [
    { name: 'Apartments', count: properties.filter(p => p.type === 'Apartment').length, icon: '🏢' },
    { name: 'Villas', count: properties.filter(p => p.type === 'Villa').length, icon: '🏡' },
    { name: 'Penthouses', count: properties.filter(p => p.type === 'Penthouse').length, icon: '🏛️' },
    { name: 'Houses', count: properties.filter(p => p.type === 'House').length, icon: '🏠' },
  ];

  const stats = [
    { icon: FiHome, value: '10,000+', label: 'Properties Listed' },
    { icon: FiUsers, value: '50,000+', label: 'Happy Customers' },
    { icon: FiAward, value: '500+', label: 'Awards Won' },
    { icon: FiStar, value: '4.9/5', label: 'Average Rating' },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Animated Banner Carousel */}
      <BannerCarousel />

      {/* Search Section with Animation */}
      <section className="relative -mt-20 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex items-center space-x-3 bg-gray-50 rounded-xl p-4">
                  <FiSearch className="text-gray-400 text-xl" />
                  <input
                    type="text"
                    placeholder="Search by location, price, or type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 outline-none bg-transparent text-gray-800 placeholder-gray-400"
                  />
                </div>
                <Link
                  href={`/properties?search=${encodeURIComponent(searchQuery)}`}
                  className="bg-primary-600 text-white px-8 py-4 rounded-xl hover:bg-primary-700 transition-all font-semibold text-center transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Search
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all"
                >
                  <Icon className="w-8 h-8 text-primary-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Property Categories with Animation */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              Property Categories
            </h2>
            <p className="text-xl text-gray-600">Explore our diverse property portfolio</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {propertyCategories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -10 }}
              >
                <Link
                  href={`/properties?type=${category.name.toLowerCase()}`}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center block group"
                >
                  <motion.div
                    className="text-6xl mb-4"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {category.icon}
                  </motion.div>
                  <h3 className="font-bold text-xl mb-2 text-gray-800 group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 font-semibold">{category.count} Properties</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties with Animation */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-between items-center mb-12"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                Featured Properties
              </h2>
              <p className="text-gray-600">Handpicked premium selections for you</p>
            </div>
            <Link
              href="/properties"
              className="text-primary-600 hover:text-primary-700 font-semibold text-lg hidden md:block transform hover:translate-x-2 transition-transform"
            >
              View All →
            </Link>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <VideoSection />

      {/* Photo Gallery */}
      <PhotoGallery />

      {/* Trending Locations with Animation */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center space-x-3 mb-12"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <FiTrendingUp className="h-8 w-8 text-primary-600" />
            </motion.div>
            <div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                Trending Locations
              </h2>
              <p className="text-gray-600 mt-1">Hotspots with exceptional growth potential</p>
            </div>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingCities.map((city: any, index: number) => (
              <motion.div
                key={city.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <FiMapPin className="text-primary-600 text-xl" />
                  <h3 className="font-bold text-lg text-gray-800">{city.name}</h3>
                </div>
                <p className="text-gray-600 mb-3">{city.state}</p>
                <p className="text-primary-600 font-bold text-xl mb-2">
                  ₹{city.avgPrice.toLocaleString()} {city.priceUnit}
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-green-600 font-semibold text-sm">{city.growth} growth</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative py-20 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Ready to Find Your Dream Home?
            </h2>
            <p className="text-xl md:text-2xl mb-10 text-primary-100 max-w-2xl mx-auto">
              Browse our extensive collection of premium properties and start your journey today
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/properties"
                className="bg-white text-primary-600 px-10 py-4 rounded-xl hover:bg-gray-100 transition-all font-bold text-lg inline-block shadow-2xl hover:shadow-3xl transform"
              >
                Explore Properties
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Chatbot Widget */}
      <ChatbotWidget />
    </div>
  );
}

