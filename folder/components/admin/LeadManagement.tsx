'use client';

import { useState } from 'react';
import { Enquiry, Visit } from '@/lib/data-loader';
import { FiDownload, FiMessageSquare, FiCalendar, FiCheck, FiX } from 'react-icons/fi';

interface LeadManagementProps {
  enquiries: Enquiry[];
  visits: Visit[];
  onUpdate: () => void;
}

export default function LeadManagement({ enquiries, visits, onUpdate }: LeadManagementProps) {
  const [activeTab, setActiveTab] = useState<'enquiries' | 'visits'>('enquiries');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [comment, setComment] = useState('');

  const handleStatusUpdate = async (id: string, status: string, type: 'enquiry' | 'visit') => {
    try {
      const endpoint = type === 'enquiry' ? '/api/enquiries' : '/api/visits';
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          status,
          comment: comment || undefined,
        }),
      });

      if (response.ok) {
        setComment('');
        setSelectedEnquiry(null);
        onUpdate();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header];
        if (Array.isArray(value)) {
          return `"${value.join('; ')}"`;
        }
        if (typeof value === 'object') {
          return `"${JSON.stringify(value)}"`;
        }
        return `"${value}"`;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Lead Management</h2>
        <div className="flex space-x-2">
          {activeTab === 'enquiries' && (
            <button
              onClick={() => exportToCSV(enquiries, 'enquiries.csv')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center space-x-2"
            >
              <FiDownload />
              <span>Export Enquiries</span>
            </button>
          )}
          {activeTab === 'visits' && (
            <button
              onClick={() => exportToCSV(visits, 'visits.csv')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center space-x-2"
            >
              <FiDownload />
              <span>Export Visits</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`flex-1 px-6 py-4 font-semibold flex items-center justify-center space-x-2 ${
              activeTab === 'enquiries'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <FiMessageSquare />
            <span>Enquiries ({enquiries.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('visits')}
            className={`flex-1 px-6 py-4 font-semibold flex items-center justify-center space-x-2 ${
              activeTab === 'visits'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <FiCalendar />
            <span>Scheduled Visits ({visits.length})</span>
          </button>
        </div>
      </div>

      {/* Enquiries Table */}
      {activeTab === 'enquiries' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {enquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{enquiry.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{enquiry.propertyTitle}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{enquiry.email}</div>
                      <div className="text-xs text-gray-400">{enquiry.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">{enquiry.message}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        enquiry.status === 'New' ? 'bg-yellow-100 text-yellow-800' :
                        enquiry.status === 'Contacted' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {enquiry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        {new Date(enquiry.submittedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedEnquiry(enquiry)}
                          className="text-primary-600 hover:text-primary-900 text-sm"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(enquiry.id, 'Contacted', 'enquiry')}
                          className="text-green-600 hover:text-green-900"
                        >
                          <FiCheck />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Visits Table */}
      {activeTab === 'visits' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {visits.map((visit) => (
                  <tr key={visit.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{visit.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{visit.propertyTitle}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{visit.email}</div>
                      <div className="text-xs text-gray-400">{visit.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{visit.preferredDate}</div>
                      <div className="text-xs text-gray-400">{visit.preferredTime}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        visit.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' :
                        visit.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {visit.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusUpdate(visit.id, 'Completed', 'visit')}
                          className="text-green-600 hover:text-green-900"
                        >
                          <FiCheck />
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(visit.id, 'Cancelled', 'visit')}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiX />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Enquiry Details</h3>
            <div className="space-y-4">
              <div>
                <strong>Name:</strong> {selectedEnquiry.name}
              </div>
              <div>
                <strong>Email:</strong> {selectedEnquiry.email}
              </div>
              <div>
                <strong>Phone:</strong> {selectedEnquiry.phone}
              </div>
              <div>
                <strong>Property:</strong> {selectedEnquiry.propertyTitle}
              </div>
              <div>
                <strong>Message:</strong>
                <p className="mt-1">{selectedEnquiry.message}</p>
              </div>
              {selectedEnquiry.comments.length > 0 && (
                <div>
                  <strong>Comments:</strong>
                  <ul className="mt-1 list-disc list-inside">
                    {selectedEnquiry.comments.map((comment, idx) => (
                      <li key={idx}>{comment.text}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-2">Add Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setSelectedEnquiry(null);
                  setComment('');
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => handleStatusUpdate(selectedEnquiry.id, 'Contacted', 'enquiry')}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

