'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Property } from '@/lib/data-loader';
import { getPropertyById, incrementPropertyViews } from '@/lib/data-loader';
import { FiMapPin, FiHome, FiMaximize2, FiCalendar, FiMail, FiPhone } from 'react-icons/fi';
import EnquiryForm from '@/components/EnquiryForm';
import VisitForm from '@/components/VisitForm';
import EMICalculator from '@/components/EMICalculator';

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'enquiry' | 'visit' | 'emi'>('details');

  useEffect(() => {
    if (params.id) {
      const prop = getPropertyById(params.id as string);
      if (prop) {
        setProperty(prop);
        incrementPropertyViews(params.id as string);
      }
    }
  }, [params.id]);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Property not found</p>
          <button
            onClick={() => router.push('/properties')}
            className="text-primary-600 hover:text-primary-700"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Crores`;
    }
    return `₹${(price / 100000).toFixed(2)} Lakhs`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image Section */}
      <div className="relative h-96 bg-gray-200">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">{property.title}</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <FiMapPin className="mr-1" />
              <span>{property.location}, {property.city}</span>
            </div>
            <span className="text-2xl font-bold">{formatPrice(property.price)}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md mb-6">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`flex-1 px-6 py-4 font-semibold ${
                    activeTab === 'details'
                      ? 'border-b-2 border-primary-600 text-primary-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Details
                </button>
                <button
                  onClick={() => setActiveTab('enquiry')}
                  className={`flex-1 px-6 py-4 font-semibold ${
                    activeTab === 'enquiry'
                      ? 'border-b-2 border-primary-600 text-primary-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Enquiry
                </button>
                <button
                  onClick={() => setActiveTab('visit')}
                  className={`flex-1 px-6 py-4 font-semibold ${
                    activeTab === 'visit'
                      ? 'border-b-2 border-primary-600 text-primary-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Schedule Visit
                </button>
                <button
                  onClick={() => setActiveTab('emi')}
                  className={`flex-1 px-6 py-4 font-semibold ${
                    activeTab === 'emi'
                      ? 'border-b-2 border-primary-600 text-primary-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  EMI Calculator
                </button>
              </div>

              <div className="p-6">
                {activeTab === 'details' && (
                  <div className="space-y-6">
                    {/* Key Features */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center space-x-2">
                          <FiHome className="text-primary-600" />
                          <span>{property.bedrooms} BHK</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>🛁</span>
                          <span>{property.bathrooms} Bathrooms</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FiMaximize2 className="text-primary-600" />
                          <span>{property.area} {property.areaUnit}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>🏢</span>
                          <span>{property.type}</span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Description</h3>
                      <p className="text-gray-700">{property.description}</p>
                    </div>

                    {/* Features */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Features</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {property.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <span className="text-green-600">✓</span>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Amenities */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Amenities</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {property.amenities.map((amenity, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <span className="text-primary-600">•</span>
                            <span>{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Nearby Facilities */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Nearby Facilities</h3>
                      <div className="space-y-2">
                        {property.nearbyFacilities.map((facility, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <FiMapPin className="text-primary-600" />
                            <span>{facility}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Map Placeholder */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Location</h3>
                      <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                        <p className="text-gray-600">Map View (Static - Coordinates: {property.coordinates.lat}, {property.coordinates.lng})</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'enquiry' && (
                  <EnquiryForm propertyId={property.id} propertyTitle={property.title} />
                )}

                {activeTab === 'visit' && (
                  <VisitForm propertyId={property.id} propertyTitle={property.title} />
                )}

                {activeTab === 'emi' && (
                  <EMICalculator propertyPrice={property.price} />
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-primary-600 mb-2">
                  {formatPrice(property.price)}
                </p>
                <p className="text-gray-600">Property Price</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-semibold">{property.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bedrooms:</span>
                  <span className="font-semibold">{property.bedrooms} BHK</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Area:</span>
                  <span className="font-semibold">{property.area} {property.areaUnit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-semibold text-green-600">{property.status}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setActiveTab('enquiry')}
                  className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-semibold"
                >
                  <FiMail className="inline mr-2" />
                  Send Enquiry
                </button>
                <button
                  onClick={() => setActiveTab('visit')}
                  className="w-full bg-white border-2 border-primary-600 text-primary-600 py-3 rounded-lg hover:bg-primary-50 transition font-semibold"
                >
                  <FiCalendar className="inline mr-2" />
                  Schedule Visit
                </button>
                <button
                  onClick={() => setActiveTab('emi')}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition font-semibold"
                >
                  Calculate EMI
                </button>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold mb-2">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <FiPhone className="text-primary-600" />
                    <span>+91 63040 71542</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiMail className="text-primary-600" />
                    <span>info@estatehub.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

