'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPhone, FiCheckCircle, FiX, FiClock, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

interface LeadQualificationWidgetProps {
  enquiryId: string;
  leadName: string;
  leadPhone: string;
  onQualificationComplete?: (status: 'HOT' | 'COLD' | 'WARM', score: number) => void;
}

interface QualificationState {
  status: 'idle' | 'calling' | 'qualifying' | 'completed';
  qualifiedLead?: {
    qualificationScore: number;
    status: 'HOT' | 'COLD' | 'WARM';
    insights: string[];
    recommendedAction: string;
  };
  error?: string;
}

export default function LeadQualificationWidget({
  enquiryId,
  leadName,
  leadPhone,
  onQualificationComplete,
}: LeadQualificationWidgetProps) {
  const [qualificationState, setQualificationState] = useState<QualificationState>({
    status: 'idle',
  });
  const [showWidget, setShowWidget] = useState(true);

  useEffect(() => {
    // Automatically start qualification when component mounts
    startQualification();
  }, [enquiryId]);

  const startQualification = async () => {
    setQualificationState({ status: 'calling' });

    try {
      // Simulate AI calling (0-30 seconds delay)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setQualificationState({ status: 'qualifying' });

      // Trigger qualification API
      const response = await fetch('/api/lead-qualification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enquiryId,
          name: leadName,
          phone: leadPhone,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to qualify lead');
      }

      const qualifiedLead = await response.json();

      setQualificationState({
        status: 'completed',
        qualifiedLead: {
          qualificationScore: qualifiedLead.qualificationScore,
          status: qualifiedLead.status,
          insights: qualifiedLead.insights,
          recommendedAction: qualifiedLead.recommendedAction,
        },
      });

      if (onQualificationComplete) {
        onQualificationComplete(qualifiedLead.status, qualifiedLead.qualificationScore);
      }
    } catch (error) {
      setQualificationState({
        status: 'idle',
        error: 'Failed to qualify lead. Please try again.',
      });
    }
  };

  if (!showWidget) return null;

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

  return (
    <AnimatePresence>
      {showWidget && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-white rounded-2xl shadow-2xl border-2 border-primary-200 z-50 max-w-md w-full sm:w-96"
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-primary-100 p-3 rounded-full">
                  <FiPhone className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">AI Lead Qualification</h3>
                  <p className="text-sm text-gray-600">Qualifying {leadName}</p>
                </div>
              </div>
              <button
                onClick={() => setShowWidget(false)}
                className="text-gray-400 hover:text-gray-600 transition"
                aria-label="Close"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Status Content */}
            {qualificationState.status === 'calling' && (
              <div className="text-center py-8">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center"
                >
                  <FiPhone className="w-8 h-8 text-primary-600" />
                </motion.div>
                <p className="text-gray-700 font-semibold">AI is calling the lead...</p>
                <p className="text-sm text-gray-500 mt-2">This usually takes 0-30 seconds</p>
              </div>
            )}

            {qualificationState.status === 'qualifying' && (
              <div className="text-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                  className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"
                />
                <p className="text-gray-700 font-semibold">Asking qualification questions...</p>
                <p className="text-sm text-gray-500 mt-2">Analyzing responses</p>
              </div>
            )}

            {qualificationState.status === 'completed' && qualificationState.qualifiedLead && (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg border-2 ${getStatusColor(qualificationState.qualifiedLead.status)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(qualificationState.qualifiedLead.status)}
                      <span className="font-bold text-lg">
                        {qualificationState.qualifiedLead.status} LEAD
                      </span>
                    </div>
                    <div className="text-2xl font-bold">
                      {qualificationState.qualifiedLead.qualificationScore}/100
                    </div>
                  </div>
                  <p className="text-sm mt-2">
                    {qualificationState.qualifiedLead.recommendedAction}
                  </p>
                </div>

                {qualificationState.qualifiedLead.insights.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
                    <h4 className="font-semibold text-sm mb-2 text-gray-700">Key Insights:</h4>
                    <ul className="space-y-1">
                      {qualificationState.qualifiedLead.insights.slice(0, 5).map((insight, index) => (
                        <li key={index} className="text-xs text-gray-600">
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <FiCheckCircle className="w-5 h-5" />
                  <span className="text-sm font-semibold">Lead qualified successfully!</span>
                </div>
              </div>
            )}

            {qualificationState.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-sm text-red-800">{qualificationState.error}</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

