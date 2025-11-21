'use client';

import { useState, useRef, useEffect } from 'react';
import { FiMessageCircle, FiX, FiSend, FiMinimize2 } from 'react-icons/fi';
import { ChatMessage, ChatContext, generateResponse, matchProperties } from '@/lib/chatbot';
import { Property } from '@/lib/data-loader';
import PropertyCard from './PropertyCard';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hello! I'm your real estate assistant. How can I help you find your dream home today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [context, setContext] = useState<ChatContext>({
    requirements: {},
    conversationHistory: [],
  });
  const [suggestedProperties, setSuggestedProperties] = useState<Property[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Update context
    const updatedContext = {
      ...context,
      conversationHistory: [...context.conversationHistory, userMessage],
    };
    setContext(updatedContext);

    // Generate response
    const response = generateResponse(input, updatedContext);
    
    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: response.response,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, assistantMessage]);

    // Update context with new requirements
    setContext({
      ...updatedContext,
      requirements: updatedContext.requirements,
      conversationHistory: [...updatedContext.conversationHistory, assistantMessage],
    });

    // Show suggested properties if any
    if (response.properties && response.properties.length > 0) {
      setSuggestedProperties(response.properties);
    } else {
      setSuggestedProperties([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition z-50"
        aria-label="Open chatbot"
      >
        <FiMessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 bg-white rounded-lg shadow-2xl z-50 flex flex-col ${
        isMinimized ? 'h-16 w-80' : 'h-[600px] w-96'
      } transition-all duration-300`}
    >
      {/* Header */}
      <div className="bg-primary-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <div>
          <h3 className="font-semibold">Real Estate Assistant</h3>
          <p className="text-xs text-primary-100">Ask me anything about properties</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-primary-700 p-1 rounded"
          >
            <FiMinimize2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              setIsMinimized(false);
            }}
            className="hover:bg-primary-700 p-1 rounded"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, idx) => (
              <div
                key={idx}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}

            {/* Suggested Properties */}
            {suggestedProperties.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-semibold mb-2 text-gray-700">
                  Properties you might like:
                </p>
                <div className="space-y-2">
                  {suggestedProperties.map((property) => (
                    <div
                      key={property.id}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        window.location.href = `/properties/${property.id}`;
                      }}
                    >
                      <p className="font-semibold text-sm">{property.title}</p>
                      <p className="text-xs text-gray-600">
                        ₹{(property.price / 100000).toFixed(2)}L • {property.bedrooms}BHK • {property.location}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              />
              <button
                onClick={handleSend}
                className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition"
              >
                <FiSend className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Try: "Show me 3BHK apartments in Mumbai" or "Calculate EMI for ₹50L"
            </p>
          </div>
        </>
      )}
    </div>
  );
}

