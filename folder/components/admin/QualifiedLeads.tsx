'use client';

import { useState, useEffect } from 'react';
import { QualifiedLead } from '@/lib/lead-qualifier';
import { FiPhone, FiMail, FiCalendar, FiTrendingUp, FiTrendingDown, FiClock, FiFilter, FiDownload } from 'react-icons/fi';

export default function QualifiedLeads() {
  const [leads, setLeads] = useState<QualifiedLead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<QualifiedLead[]>([]);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'HOT' | 'WARM' | 'COLD'>('ALL');
  const [selectedLead, setSelectedLead] = useState<QualifiedLead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQualifiedLeads();
  }, []);

  useEffect(() => {
    if (filterStatus === 'ALL') {
      setFilteredLeads(leads);
    } else {
      setFilteredLeads(leads.filter((lead) => lead.status === filterStatus));
    }
  }, [filterStatus, leads]);

  const loadQualifiedLeads = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/lead-qualification');
      if (response.ok) {
        const data = await response.json();
        // Sort by score (descending) and date
        const sorted = data.sort((a: QualifiedLead, b: QualifiedLead) => {
          if (b.qualificationScore !== a.qualificationScore) {
            return b.qualificationScore - a.qualificationScore;
          }
          return new Date(b.qualifiedAt).getTime() - new Date(a.qualifiedAt).getTime();
        });
        setLeads(sorted);
        setFilteredLeads(sorted);
      }
    } catch (error) {
      console.error('Error loading qualified leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HOT':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'WARM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'COLD':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'HOT':
        return <FiTrendingUp className="w-5 h-5" />;
      case 'WARM':
        return <FiClock className="w-5 h-5" />;
      case 'COLD':
        return <FiTrendingDown className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const exportLeads = () => {
    const csv = [
      ['Name', 'Email', 'Phone', 'Status', 'Score', 'Qualified At', 'Recommended Action'].join(','),
      ...filteredLeads.map((lead) =>
        [
          lead.name,
          lead.email,
          lead.phone,
          lead.status,
          lead.qualificationScore,
          new Date(lead.qualifiedAt).toLocaleString(),
          `"${lead.recommendedAction}"`,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qualified-leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const stats = {
    total: leads.length,
    hot: leads.filter((l) => l.status === 'HOT').length,
    warm: leads.filter((l) => l.status === 'WARM').length,
    cold: leads.filter((l) => l.status === 'COLD').length,
    avgScore: leads.length > 0 ? Math.round(leads.reduce((sum, l) => sum + l.qualificationScore, 0) / leads.length) : 0,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-3xl font-bold text-gray-800">{stats.total}</div>
          <div className="text-sm text-gray-600 mt-1">Total Leads</div>
        </div>
        <div className="bg-red-50 p-6 rounded-lg shadow-md border-2 border-red-200">
          <div className="text-3xl font-bold text-red-800">{stats.hot}</div>
          <div className="text-sm text-red-600 mt-1">🔥 HOT Leads</div>
        </div>
        <div className="bg-yellow-50 p-6 rounded-lg shadow-md border-2 border-yellow-200">
          <div className="text-3xl font-bold text-yellow-800">{stats.warm}</div>
          <div className="text-sm text-yellow-600 mt-1">⏰ WARM Leads</div>
        </div>
        <div className="bg-blue-50 p-6 rounded-lg shadow-md border-2 border-blue-200">
          <div className="text-3xl font-bold text-blue-800">{stats.cold}</div>
          <div className="text-sm text-blue-600 mt-1">❄️ COLD Leads</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-3xl font-bold text-gray-800">{stats.avgScore}</div>
          <div className="text-sm text-gray-600 mt-1">Avg Score</div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-2">
          <FiFilter className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Filter by Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="ALL">All Leads</option>
            <option value="HOT">🔥 HOT</option>
            <option value="WARM">⏰ WARM</option>
            <option value="COLD">❄️ COLD</option>
          </select>
        </div>
        <button
          onClick={exportLeads}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition flex items-center space-x-2"
        >
          <FiDownload className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Leads List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Qualified At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No qualified leads found
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.enquiryId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                      <div className="text-sm text-gray-500">{lead.email}</div>
                      <div className="text-sm text-gray-500 flex items-center space-x-1">
                        <FiPhone className="w-3 h-3" />
                        <span>{lead.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold border-2 ${getStatusColor(
                          lead.status
                        )}`}
                      >
                        {getStatusIcon(lead.status)}
                        <span>{lead.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{lead.qualificationScore}/100</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{lead.propertyTitle || 'General Enquiry'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(lead.qualifiedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedLead(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedLead.name}</h2>
                  <p className="text-gray-600 mt-1">{selectedLead.email}</p>
                  <p className="text-gray-600 flex items-center space-x-1">
                    <FiPhone className="w-4 h-4" />
                    <span>{selectedLead.phone}</span>
                  </p>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className={`p-4 rounded-lg border-2 ${getStatusColor(selectedLead.status)}`}>
                  <div className="text-sm font-medium mb-1">Status</div>
                  <div className="text-2xl font-bold">{selectedLead.status}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                  <div className="text-sm font-medium mb-1">Qualification Score</div>
                  <div className="text-2xl font-bold">{selectedLead.qualificationScore}/100</div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3">Recommended Action</h3>
                <p className="text-gray-700 bg-blue-50 p-4 rounded-lg">{selectedLead.recommendedAction}</p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3">Key Insights</h3>
                <ul className="space-y-2">
                  {selectedLead.insights.map((insight, index) => (
                    <li key={index} className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>

              {selectedLead.propertyTitle && (
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-2">Property Interest</h3>
                  <p className="text-gray-700">{selectedLead.propertyTitle}</p>
                </div>
              )}

              {selectedLead.appointmentBooked && (
                <div className="bg-green-50 border-2 border-green-200 p-4 rounded-lg mb-6">
                  <div className="flex items-center space-x-2 text-green-800">
                    <FiCalendar className="w-5 h-5" />
                    <span className="font-semibold">Appointment Booked</span>
                  </div>
                  {selectedLead.appointmentDate && (
                    <p className="text-sm text-green-700 mt-2">
                      {selectedLead.appointmentDate} at {selectedLead.appointmentTime}
                    </p>
                  )}
                </div>
              )}

              <div className="flex space-x-3">
                <a
                  href={`tel:${selectedLead.phone}`}
                  className="flex-1 bg-primary-600 text-white px-4 py-3 rounded-lg hover:bg-primary-700 transition text-center flex items-center justify-center space-x-2"
                >
                  <FiPhone className="w-4 h-4" />
                  <span>Call Now</span>
                </a>
                <a
                  href={`mailto:${selectedLead.email}`}
                  className="flex-1 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition text-center flex items-center justify-center space-x-2"
                >
                  <FiMail className="w-4 h-4" />
                  <span>Send Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

