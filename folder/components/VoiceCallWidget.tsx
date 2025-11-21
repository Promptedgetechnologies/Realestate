'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPhone, FiX, FiCheckCircle, FiAlertCircle, FiVolume2 } from 'react-icons/fi';
import { VoiceCallSession } from '@/lib/voice-call';

interface VoiceCallWidgetProps {
  phoneNumber: string;
  customerName?: string;
  onCallComplete?: (session: VoiceCallSession) => void;
  onClose?: () => void;
}

export default function VoiceCallWidget({
  phoneNumber,
  customerName,
  onCallComplete,
  onClose,
}: VoiceCallWidgetProps) {
  const [callSession, setCallSession] = useState<VoiceCallSession | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiateCall = async () => {
    setIsCalling(true);
    setError(null);

    try {
      const response = await fetch('/api/voice-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          customerName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to initiate call');
      }

      const session = await response.json();
      setCallSession(session);

      if (onCallComplete) {
        onCallComplete(session);
      }
    } catch (err) {
      setError('Failed to initiate call. Please try again.');
      console.error('Error initiating call:', err);
    } finally {
      setIsCalling(false);
    }
  };

  useEffect(() => {
    // Auto-initiate call when component mounts
    initiateCall();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'in_progress':
        return 'text-blue-600';
      case 'completed':
        return callSession?.isVerified ? 'text-green-600' : 'text-yellow-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'initiating':
      case 'ringing':
        return <FiPhone className="w-6 h-6 animate-pulse" />;
      case 'connected':
      case 'in_progress':
        return <FiVolume2 className="w-6 h-6 animate-pulse" />;
      case 'completed':
        return callSession?.isVerified ? (
          <FiCheckCircle className="w-6 h-6" />
        ) : (
          <FiAlertCircle className="w-6 h-6" />
        );
      case 'failed':
        return <FiX className="w-6 h-6" />;
      default:
        return <FiPhone className="w-6 h-6" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-100 p-3 rounded-full">
              <FiPhone className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800">AI Voice Call</h3>
              <p className="text-sm text-gray-600">{phoneNumber}</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
              aria-label="Close"
            >
              <FiX className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Call Status */}
        {isCalling && !callSession && (
          <div className="text-center py-8">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-20 h-20 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center"
            >
              <FiPhone className="w-10 h-10 text-primary-600" />
            </motion.div>
            <p className="text-gray-700 font-semibold">Initiating call...</p>
            <p className="text-sm text-gray-500 mt-2">Connecting to {phoneNumber}</p>
          </div>
        )}

        {callSession && (
          <div className="space-y-4">
            {/* Status */}
            <div className={`text-center py-4 rounded-lg border-2 ${
              callSession.status === 'completed'
                ? callSession.isVerified
                  ? 'bg-green-50 border-green-200'
                  : 'bg-yellow-50 border-yellow-200'
                : 'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-center justify-center space-x-2 mb-2">
                {getStatusIcon(callSession.status)}
                <span className={`font-bold text-lg ${getStatusColor(callSession.status)}`}>
                  {callSession.status === 'completed'
                    ? callSession.isVerified
                      ? '✅ Verified Customer'
                      : '⚠️ Verification Failed'
                    : callSession.status.charAt(0).toUpperCase() + callSession.status.slice(1).replace('_', ' ')}
                </span>
              </div>
              {callSession.status === 'completed' && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    Verification Score: <span className="font-bold">{callSession.verificationScore}/100</span>
                  </p>
                </div>
              )}
            </div>

            {/* Call Progress */}
            {callSession.status !== 'completed' && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700">Call in progress...</p>
                <div className="bg-gray-100 rounded-lg p-3">
                  <p className="text-xs text-gray-600">
                    AI is asking verification questions to confirm you're a real customer.
                  </p>
                </div>
              </div>
            )}

            {/* Verification Results */}
            {callSession.status === 'completed' && (
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Verification Summary:</p>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Questions Asked:</span>
                      <span className="font-semibold">{callSession.responses.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Verification Score:</span>
                      <span className="font-semibold">{callSession.verificationScore}/100</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-semibold ${
                        callSession.isVerified ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {callSession.isVerified ? 'Verified' : 'Needs Review'}
                      </span>
                    </div>
                  </div>
                </div>

                {callSession.transcript && (
                  <details className="bg-gray-50 rounded-lg p-3">
                    <summary className="text-sm font-semibold text-gray-700 cursor-pointer">
                      View Call Transcript
                    </summary>
                    <pre className="mt-2 text-xs text-gray-600 whitespace-pre-wrap max-h-48 overflow-y-auto">
                      {callSession.transcript}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {callSession?.status === 'completed' && (
          <div className="mt-6 flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              Close
            </button>
            {!callSession.isVerified && (
              <button
                onClick={() => initiateCall()}
                className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-semibold"
              >
                Retry Call
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

