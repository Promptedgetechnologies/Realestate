'use client';

import { useState, useEffect } from 'react';
import { Property, Enquiry, Visit } from '@/lib/data-loader';
import { getProperties, getEnquiries, getVisits } from '@/lib/data-loader';
import PropertyManagement from '@/components/admin/PropertyManagement';
import LeadManagement from '@/components/admin/LeadManagement';
import QualifiedLeads from '@/components/admin/QualifiedLeads';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import { FiHome, FiUsers, FiBarChart2, FiTrendingUp } from 'react-icons/fi';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'properties' | 'leads' | 'qualified' | 'analytics'>('properties');
  const [properties, setProperties] = useState<Property[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setProperties(getProperties());
    setEnquiries(getEnquiries());
    setVisits(getVisits());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600 mt-1">Manage properties, leads, and view analytics</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('properties')}
              className={`flex-1 px-6 py-4 font-semibold flex items-center justify-center space-x-2 ${
                activeTab === 'properties'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FiHome />
              <span>Property Management</span>
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={`flex-1 px-6 py-4 font-semibold flex items-center justify-center space-x-2 ${
                activeTab === 'leads'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FiUsers />
              <span>Lead Management</span>
            </button>
            <button
              onClick={() => setActiveTab('qualified')}
              className={`flex-1 px-6 py-4 font-semibold flex items-center justify-center space-x-2 ${
                activeTab === 'qualified'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FiTrendingUp />
              <span>AI Qualified Leads</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 px-6 py-4 font-semibold flex items-center justify-center space-x-2 ${
                activeTab === 'analytics'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FiBarChart2 />
              <span>Analytics</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'properties' && (
            <PropertyManagement
              properties={properties}
              onUpdate={loadData}
            />
          )}
          {activeTab === 'leads' && (
            <LeadManagement
              enquiries={enquiries}
              visits={visits}
              onUpdate={loadData}
            />
          )}
          {activeTab === 'qualified' && (
            <QualifiedLeads />
          )}
          {activeTab === 'analytics' && (
            <AnalyticsDashboard
              properties={properties}
              enquiries={enquiries}
              visits={visits}
            />
          )}
        </div>
      </div>
    </div>
  );
}

