'use client';

import { Suspense, useEffect, useState, Dispatch, SetStateAction } from 'react';
import { useSearchParams } from 'next/navigation';
import { Property, getProperties } from '@/lib/data-loader';
import PropertyCard from '@/components/PropertyCard';
import { FiFilter, FiX } from 'react-icons/fi';

type PriceRange = { min: number; max: number };

type FilterPanelProps = Readonly<{
  isMobile?: boolean;
  allCities: string[];
  allLocations: string[];
  allTypes: string[];
  allAmenities: string[];
  selectedCity: string;
  selectedLocation: string;
  selectedType: string;
  bedrooms: string;
  priceRange: PriceRange;
  selectedAmenities: string[];
  setSelectedCity: Dispatch<SetStateAction<string>>;
  setSelectedLocation: Dispatch<SetStateAction<string>>;
  setSelectedType: Dispatch<SetStateAction<string>>;
  setBedrooms: Dispatch<SetStateAction<string>>;
  setPriceRange: Dispatch<SetStateAction<PriceRange>>;
  setSelectedAmenities: Dispatch<SetStateAction<string[]>>;
  resetFilters: () => void;
  onClose?: () => void;
}>;

function FilterPanel({
  isMobile = false,
  allCities,
  allLocations,
  allTypes,
  allAmenities,
  selectedCity,
  selectedLocation,
  selectedType,
  bedrooms,
  priceRange,
  selectedAmenities,
  setSelectedCity,
  setSelectedLocation,
  setSelectedType,
  setBedrooms,
  setPriceRange,
  setSelectedAmenities,
  resetFilters,
  onClose,
}: FilterPanelProps) {
  const handleAmenityToggle = (amenity: string, checked: boolean) => {
    setSelectedAmenities(prev =>
      checked ? [...prev, amenity] : prev.filter(a => a !== amenity)
    );
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 ${
        isMobile ? 'h-full overflow-y-auto' : 'sticky top-24'
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <FiFilter className="mr-2" />
          Filters
        </h2>
        {isMobile && (
          <button
            onClick={onClose}
            className="text-gray-600"
            aria-label="Close filters"
          >
            <FiX className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* City Filter */}
        <div>
          <label htmlFor="city-select" className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <select
            id="city-select"
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

        {/* Location Filter */}
        <div>
          <label htmlFor="location-select" className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <select
            id="location-select"
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
          <p className="block text-sm font-medium text-gray-700 mb-2">
            Price Range
          </p>
          <div className="space-y-2">
            <div>
              <label htmlFor="price-min" className="sr-only">
                Minimum Price
              </label>
              <input
                id="price-min"
                type="number"
                placeholder="Min Price"
                value={priceRange.min || ''}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, min: Number.parseInt(e.target.value, 10) || 0 })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="price-max" className="sr-only">
                Maximum Price
              </label>
              <input
                id="price-max"
                type="number"
                placeholder="Max Price"
                value={priceRange.max === 50000000 ? '' : priceRange.max}
                onChange={(e) =>
                  setPriceRange({
                    ...priceRange,
                    max: Number.parseInt(e.target.value, 10) || 50000000,
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Property Type */}
        <div>
          <label htmlFor="property-type" className="block text-sm font-medium text-gray-700 mb-2">
            Property Type
          </label>
          <select
            id="property-type"
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
          <label htmlFor="bedrooms-select" className="block text-sm font-medium text-gray-700 mb-2">
            Bedrooms
          </label>
          <select
            id="bedrooms-select"
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
          <p className="block text-sm font-medium text-gray-700 mb-2">
            Amenities
          </p>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {allAmenities.map(amenity => {
              const amenityId = `amenity-${amenity
                .toLowerCase()
                .replaceAll(/[^a-z0-9]+/g, '-')}`;
              return (
                <div key={amenity} className="flex items-center">
                  <input
                    id={amenityId}
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity)}
                    onChange={(event) => handleAmenityToggle(amenity, event.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor={amenityId} className="text-sm">
                    {amenity}
                  </label>
                </div>
              );
            })}
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
  );
}

export default function PropertiesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Loading properties...</p>
          </div>
        </div>
      }
    >
      <PropertiesPageContent />
    </Suspense>
  );
}

function PropertiesPageContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: 0, max: 50000000 });
  const [selectedType, setSelectedType] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('popularity');

  useEffect(() => {
    const allProperties = getProperties();
    setProperties(allProperties);

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
      filtered = filtered.filter(p => p.bedrooms === Number.parseInt(bedrooms, 10));
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
  ).sort((a, b) => a.localeCompare(b));

  const allLocations = Array.from(new Set(properties.map(p => p.location))).sort((a, b) =>
    a.localeCompare(b)
  );
  const allCities = Array.from(new Set(properties.map(p => p.city))).sort((a, b) =>
    a.localeCompare(b)
  );
  const allTypes = Array.from(new Set(properties.map(p => p.type))).sort((a, b) =>
    a.localeCompare(b)
  );

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
          <div className="hidden lg:block lg:w-80">
            <FilterPanel
              allCities={allCities}
              allLocations={allLocations}
              allTypes={allTypes}
              allAmenities={allAmenities}
              selectedCity={selectedCity}
              selectedLocation={selectedLocation}
              selectedType={selectedType}
              bedrooms={bedrooms}
              priceRange={priceRange}
              selectedAmenities={selectedAmenities}
              setSelectedCity={setSelectedCity}
              setSelectedLocation={setSelectedLocation}
              setSelectedType={setSelectedType}
              setBedrooms={setBedrooms}
              setPriceRange={setPriceRange}
              setSelectedAmenities={setSelectedAmenities}
              resetFilters={resetFilters}
            />
          </div>
          {showFilters && (
            <>
              <button
                type="button"
                aria-label="Close filters"
                className="fixed inset-0 bg-black/40 z-30 lg:hidden cursor-pointer"
                onClick={() => setShowFilters(false)}
              />
              <div
                id="filters-drawer"
                className="fixed inset-y-0 right-0 w-full max-w-xs sm:max-w-sm bg-white z-40 p-0 lg:hidden shadow-2xl flex flex-col"
              >
                <FilterPanel
                  isMobile
                  allCities={allCities}
                  allLocations={allLocations}
                  allTypes={allTypes}
                  allAmenities={allAmenities}
                  selectedCity={selectedCity}
                  selectedLocation={selectedLocation}
                  selectedType={selectedType}
                  bedrooms={bedrooms}
                  priceRange={priceRange}
                  selectedAmenities={selectedAmenities}
                  setSelectedCity={setSelectedCity}
                  setSelectedLocation={setSelectedLocation}
                  setSelectedType={setSelectedType}
                  setBedrooms={setBedrooms}
                  setPriceRange={setPriceRange}
                  setSelectedAmenities={setSelectedAmenities}
                  resetFilters={resetFilters}
                  onClose={() => setShowFilters(false)}
                />
              </div>
            </>
          )}

          {/* Properties Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                aria-expanded={showFilters}
                aria-controls="filters-drawer"
                className="lg:hidden bg-white px-4 py-2 rounded-lg shadow-md flex items-center"
              >
                <FiFilter className="mr-2" />
                {showFilters ? 'Hide Filters' : 'Filters'}
              </button>

              <div className="flex items-center space-x-2">
                <label htmlFor="sort-by" className="text-sm font-medium">
                  Sort by:
                </label>
                <select
                  id="sort-by"
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

