'use client';

import { useState } from 'react';
import { FiMail, FiCheckCircle } from 'react-icons/fi';
import LeadQualificationWidget from './LeadQualificationWidget';

interface EnquiryFormProps {
  propertyId: string;
  propertyTitle: string;
}

export default function EnquiryForm({ propertyId, propertyTitle }: EnquiryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [enquiryId, setEnquiryId] = useState<string | null>(null);
  const [showQualification, setShowQualification] = useState(false);
  const [submittedLeadInfo, setSubmittedLeadInfo] = useState<{ name: string; phone: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          propertyId,
          propertyTitle,
        }),
      });

      if (response.ok) {
        const enquiry = await response.json();
        setEnquiryId(enquiry.id);
        setSubmittedLeadInfo({ name: formData.name, phone: formData.phone });
        setIsSubmitted(true);
        setShowQualification(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => setIsSubmitted(false), 10000);
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <>
        <div className="text-center py-8">
          <FiCheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Enquiry Submitted!</h3>
          <p className="text-gray-600 mb-4">
            Thank you for your interest. Our AI assistant is qualifying your lead now.
          </p>
          <p className="text-sm text-gray-500">
            You should receive a call within 30 seconds for a quick qualification.
          </p>
        </div>
        {enquiryId && showQualification && submittedLeadInfo && (
          <LeadQualificationWidget
            enquiryId={enquiryId}
            leadName={submittedLeadInfo.name}
            leadPhone={submittedLeadInfo.phone}
            onQualificationComplete={(status, score) => {
              console.log(`Lead qualified as ${status} with score ${score}`);
            }}
          />
        )}
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name *
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-600 focus:border-transparent"
          placeholder="Enter your name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-600 focus:border-transparent"
          placeholder="your.email@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number *
        </label>
        <input
          type="tel"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-600 focus:border-transparent"
          placeholder="+91 98765 43210"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Message *
        </label>
        <textarea
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={5}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-600 focus:border-transparent"
          placeholder="Tell us about your requirements..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        <FiMail className="mr-2" />
        {isSubmitting ? 'Submitting...' : 'Send Enquiry'}
      </button>
    </form>
  );
}

