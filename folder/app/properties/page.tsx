'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Property } from '@/lib/data-loader';
import { getProperties, getLocations } from '@/lib/data-loader';
import PropertyCard from '@/components/PropertyCard';
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi';

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [locations, setLocations] = useState<any>(null);

  // Filter states
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000000 });
  const [selectedType, setSelectedType] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('popularity');

  useEffect(() => {
    const allProperties = getProperties();
    setProperties(allProperties);
    setLocations(getLocations());

    // Handle search query from URL
    const searchQuery = searchParams.get('search');
    const typeQuery = searchParams.get('type');
    
    if (searchQuery) {
      const filtered = allProperties.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProperties(filtered);
    } else if (typeQuery) {
      const filtered = allProperties.filter(p =>
        p.type.toLowerCase() === typeQuery.toLowerCase()
      );
      setFilteredProperties(filtered);
    } else {
      setFilteredProperties(allProperties);
    }
  }, [searchParams]);

  useEffect(() => {
    let filtered = [...properties];

    // Apply filters
    if (selectedLocation) {
      filtered = filtered.filter(p => p.location === selectedLocation);
    }
    if (selectedCity) {
      filtered = filtered.filter(p => p.city === selectedCity);
    }
    if (priceRange.min > 0 || priceRange.max < 50000000) {
      filtered = filtered.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);
    }
    if (selectedType) {
      filtered = filtered.filter(p => p.type === selectedType);
    }
    if (bedrooms) {
      filtered = filtered.filter(p => p.bedrooms === parseInt(bedrooms));
    }
    if (selectedAmenities.length > 0) {
      filtered = filtered.filter(p =>
        selectedAmenities.every(amenity => p.amenities.includes(amenity))
      );
    }

    // Sort
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'popularity') {
      filtered.sort((a, b) => b.popularity - a.popularity);
    }

    setFilteredProperties(filtered);
  }, [properties, selectedLocation, selectedCity, priceRange, selectedType, bedrooms, selectedAmenities, sortBy]);

  const allAmenities = Array.from(
    new Set(properties.flatMap(p => p.amenities))
  ).sort();

  const allLocations = Array.from(new Set(properties.map(p => p.location))).sort();
  const allCities = Array.from(new Set(properties.map(p => p.city))).sort();
  const allTypes = Array.from(new Set(properties.map(p => p.type))).sort();

  const resetFilters = () => {
    setSelectedLocation('');
    setSelectedCity('');
    setPriceRange({ min: 0, max: 50000000 });
    setSelectedType('');
    setBedrooms('');
    setSelectedAmenities([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">All Properties</h1>
          <p className="text-gray-600">
            {filteredProperties.length} properties found
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold flex items-center">
                  <FiFilter className="mr-2" />
                  Filters
                </h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-gray-600"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">All Cities</option>
                    {allCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Area Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">All Locations</option>
                    {allLocations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="space-y-2">
                    <input
                      type="number"
                      placeholder="Min Price"
                      value={priceRange.min || ''}
                      onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                    <input
                      type="number"
                      placeholder="Max Price"
                      value={priceRange.max === 50000000 ? '' : priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 50000000 })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">All Types</option>
                    {allTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms
                  </label>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Any</option>
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4 BHK</option>
                    <option value="5">5+ BHK</option>
                  </select>
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amenities
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {allAmenities.map(amenity => (
                      <label key={amenity} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedAmenities.includes(amenity)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAmenities([...selectedAmenities, amenity]);
                            } else {
                              setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={resetFilters}
                  className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden bg-white px-4 py-2 rounded-lg shadow-md flex items-center"
              >
                <FiFilter className="mr-2" />
                Filters
              </button>

              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="popularity">Popularity</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {filteredProperties.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-600 text-lg">No properties found matching your criteria.</p>
                <button
                  onClick={resetFilters}
                  className="mt-4 text-primary-600 hover:text-primary-700"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

