'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FiHome, FiSearch, FiMenu, FiX } from 'react-icons/fi';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <FiHome className="h-8 w-8 text-primary-600" />
              <span className="text-2xl font-bold text-primary-600">Serniq</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 transition">
              Home
            </Link>
            <Link href="/properties" className="text-gray-700 hover:text-primary-600 transition">
              Properties
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary-600 transition">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary-600 transition">
              Contact
            </Link>
            <Link 
              href="/admin-panel" 
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
            >
              Admin
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600"
            >
              {isMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link href="/" className="block text-gray-700 hover:text-primary-600">
              Home
            </Link>
            <Link href="/properties" className="block text-gray-700 hover:text-primary-600">
              Properties
            </Link>
            <Link href="/about" className="block text-gray-700 hover:text-primary-600">
              About
            </Link>
            <Link href="/contact" className="block text-gray-700 hover:text-primary-600">
              Contact
            </Link>
            <Link 
              href="/admin-panel" 
              className="block bg-primary-600 text-white px-4 py-2 rounded-lg text-center"
            >
              Admin
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

