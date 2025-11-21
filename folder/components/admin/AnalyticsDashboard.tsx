'use client';

import { Property, Enquiry, Visit } from '@/lib/data-loader';
import { FiHome, FiMessageSquare, FiCalendar, FiTrendingUp, FiEye } from 'react-icons/fi';

interface AnalyticsDashboardProps {
  properties: Property[];
  enquiries: Enquiry[];
  visits: Visit[];
}

export default function AnalyticsDashboard({
  properties,
  enquiries,
  visits,
}: AnalyticsDashboardProps) {
  // Calculate statistics
  const totalProperties = properties.length;
  const totalEnquiries = enquiries.length;
  const totalVisits = visits.length;
  const totalViews = properties.reduce((sum, p) => sum + p.views, 0);

  // Top trending locations
  const locationCounts = properties.reduce((acc, p) => {
    const key = `${p.location}, ${p.city}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const trendingLocations = Object.entries(locationCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([location, count]) => ({ location, count }));

  // Most viewed properties
  const mostViewed = [...properties]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  // Enquiries by status
  const enquiriesByStatus = enquiries.reduce((acc, e) => {
    acc[e.status] = (acc[e.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Visits by status
  const visitsByStatus = visits.reduce((acc, v) => {
    acc[v.status] = (acc[v.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Properties by type
  const propertiesByType = properties.reduce((acc, p) => {
    acc[p.type] = (acc[p.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Properties</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalProperties}</p>
            </div>
            <FiHome className="h-12 w-12 text-primary-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Enquiries</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalEnquiries}</p>
            </div>
            <FiMessageSquare className="h-12 w-12 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Scheduled Visits</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalVisits}</p>
            </div>
            <FiCalendar className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Views</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalViews}</p>
            </div>
            <FiEye className="h-12 w-12 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trending Locations */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-2 mb-4">
            <FiTrendingUp className="h-5 w-5 text-primary-600" />
            <h3 className="text-xl font-semibold">Top Trending Locations</h3>
          </div>
          <div className="space-y-3">
            {trendingLocations.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold">
                    {idx + 1}
                  </div>
                  <span className="text-gray-700">{item.location}</span>
                </div>
                <span className="font-semibold text-primary-600">{item.count} properties</span>
              </div>
            ))}
          </div>
        </div>

        {/* Most Viewed Properties */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Most Viewed Properties</h3>
          <div className="space-y-3">
            {mostViewed.map((property, idx) => (
              <div key={property.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{property.title}</p>
                    <p className="text-sm text-gray-500">{property.location}</p>
                  </div>
                </div>
                <span className="font-semibold text-primary-600">{property.views} views</span>
              </div>
            ))}
          </div>
        </div>

        {/* Properties by Type */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Properties by Type</h3>
          <div className="space-y-3">
            {Object.entries(propertiesByType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-gray-700">{type}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${(count / totalProperties) * 100}%` }}
                    />
                  </div>
                  <span className="font-semibold text-primary-600 w-12 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enquiries by Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Enquiries by Status</h3>
          <div className="space-y-3">
            {Object.entries(enquiriesByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-gray-700">{status}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(count / totalEnquiries) * 100}%` }}
                    />
                  </div>
                  <span className="font-semibold text-blue-600 w-12 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

