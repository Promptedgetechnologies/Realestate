'use client';

import { useState, useRef, useEffect } from 'react';
import { FiMessageCircle, FiX, FiSend, FiMinimize2, FiShare2, FiPhone, FiPhoneCall } from 'react-icons/fi';
import { ChatMessage, ChatContext, generateResponse, matchProperties } from '@/lib/chatbot';
import { Property } from '@/lib/data-loader';
import PropertyCard from './PropertyCard';
import VoiceCallWidget from './VoiceCallWidget';
import { VoiceCallSession } from '@/lib/voice-call';

// Contact Numbers (configure in .env.local)
// Format: +919876543210 or 919876543210
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+919876543210';
const PHONE_NUMBER = process.env.NEXT_PUBLIC_PHONE_NUMBER || '+919876543210';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showVoiceCall, setShowVoiceCall] = useState(false);
  const [voiceCallPhone, setVoiceCallPhone] = useState<string>('');
  const [voiceCallName, setVoiceCallName] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hello! I'm your real estate assistant. How can I help you find your dream home today?\n\n💡 Quick Actions:\n📞 Call us for immediate assistance\n🤖 AI can call you to verify\n💬 Share your requirements via WhatsApp",
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

    // Auto-detect phone number and offer AI call
    const phoneMatch = input.match(/\+?[\d\s-]{10,}/);
    if (phoneMatch && !showVoiceCall) {
      const detectedPhone = phoneMatch[0].replace(/\s/g, '');
      // Ask user if they want AI verification call
      setTimeout(() => {
        const confirmationMessage: ChatMessage = {
          role: 'assistant',
          content: `I noticed your phone number: ${detectedPhone}\n\nWould you like me to call you for AI verification? This helps us verify you're a real customer and provide better service.\n\nClick the purple phone icon (📞) in the header to start!`,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, confirmationMessage]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Generate WhatsApp message from conversation
  const generateWhatsAppMessage = (): string => {
    const conversationSummary = messages
      .filter((msg) => msg.role === 'user')
      .map((msg) => `• ${msg.content}`)
      .join('\n');

    let message = `Hello! I'm interested in properties.\n\n`;
    message += `*My Requirements:*\n${conversationSummary}\n\n`;
    
    if (suggestedProperties.length > 0) {
      message += `*Properties I'm interested in:*\n`;
      suggestedProperties.forEach((prop, idx) => {
        message += `${idx + 1}. ${prop.title}\n`;
        message += `   ₹${(prop.price / 100000).toFixed(2)}L • ${prop.bedrooms}BHK • ${prop.location}\n`;
      });
      message += `\n`;
    }

    message += `Please share more details about these properties.`;
    return encodeURIComponent(message);
  };

  // Open WhatsApp with pre-filled message
  const handleWhatsAppShare = () => {
    const message = generateWhatsAppMessage();
    const phoneNumber = WHATSAPP_NUMBER.replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  // Share specific property via WhatsApp
  const sharePropertyViaWhatsApp = (property: Property) => {
    const message = encodeURIComponent(
      `Hello! I'm interested in this property:\n\n` +
      `*${property.title}*\n` +
      `💰 Price: ₹${(property.price / 100000).toFixed(2)}L\n` +
      `🏠 ${property.bedrooms} BHK\n` +
      `📍 ${property.location}, ${property.city}\n` +
      `📐 ${property.area} ${property.areaUnit}\n\n` +
      `Please share more details and schedule a site visit.`
    );
    const phoneNumber = WHATSAPP_NUMBER.replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  // Handle phone call (outgoing to business)
  const handleCall = () => {
    const phoneNumber = PHONE_NUMBER.replace(/[^0-9+]/g, '');
    window.location.href = `tel:${phoneNumber}`;
  };

  // Handle AI voice call (AI calls customer)
  const handleAIVoiceCall = () => {
    // Extract phone number from conversation or prompt user
    const phoneMatch = messages
      .filter((m) => m.role === 'user')
      .map((m) => m.content.match(/\+?[\d\s-]{10,}/))
      .find((match) => match !== null);

    if (phoneMatch) {
      setVoiceCallPhone(phoneMatch[0].replace(/\s/g, ''));
      setShowVoiceCall(true);
    } else {
      // Prompt for phone number
      const phone = prompt('Please enter your phone number for AI verification call:');
      if (phone) {
        setVoiceCallPhone(phone.replace(/\s/g, ''));
        setVoiceCallName(customerName || '');
        setShowVoiceCall(true);
      }
    }
  };

  // Extract customer name from conversation
  const customerName = messages
    .filter((m) => m.role === 'user')
    .map((m) => {
      const nameMatch = m.content.match(/my name is (\w+)/i) || 
                       m.content.match(/i'm (\w+)/i) ||
                       m.content.match(/i am (\w+)/i);
      return nameMatch ? nameMatch[1] : null;
    })
    .find((name) => name !== null) || undefined;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-primary-600 text-white p-4 sm:p-4 rounded-full shadow-lg hover:bg-primary-700 active:bg-primary-800 transition z-50 touch-manipulation"
        aria-label="Open chatbot"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <FiMessageCircle className="h-6 w-6 sm:h-6 sm:w-6" />
      </button>
    );
  }

  return (
    <div
      className={`fixed bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl z-50 flex flex-col ${
        isMinimized 
          ? 'h-16 bottom-0 left-0 right-0 sm:bottom-4 sm:right-6 sm:left-auto sm:w-80' 
          : 'bottom-0 left-0 right-0 sm:bottom-4 sm:right-6 sm:left-auto h-[85vh] sm:h-[70vh] sm:max-h-[640px] w-full sm:w-96'
      } transition-all duration-300`}
      style={{ maxHeight: '100vh' }}
    >
      {/* Header */}
      <div className="bg-primary-600 text-white p-3 sm:p-4 rounded-t-2xl sm:rounded-t-lg flex justify-between items-center flex-shrink-0">
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="font-semibold text-sm sm:text-base truncate">Real Estate Assistant</h3>
          <p className="text-xs text-primary-100 hidden sm:block">Ask me anything about properties</p>
        </div>
        <div className="flex space-x-2 flex-shrink-0">
          <button
            onClick={handleAIVoiceCall}
            className="bg-purple-600 hover:bg-purple-700 active:bg-purple-800 p-2 rounded-lg transition touch-manipulation"
            aria-label="AI Voice Call"
            title="AI will call you for verification"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <FiPhoneCall className="h-4 w-4 sm:h-4 sm:w-4" />
          </button>
          <button
            onClick={handleCall}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 p-2 rounded-lg transition touch-manipulation"
            aria-label="Call us"
            title="Call us now"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <FiPhone className="h-4 w-4 sm:h-4 sm:w-4" />
          </button>
          <button
            onClick={handleWhatsAppShare}
            className="bg-green-600 hover:bg-green-700 active:bg-green-800 p-2 rounded-lg transition touch-manipulation"
            aria-label="Share via WhatsApp"
            title="Share conversation via WhatsApp"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <svg className="h-4 w-4 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-primary-700 active:bg-primary-800 p-2 rounded-lg transition touch-manipulation"
            aria-label="Minimize"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <FiMinimize2 className="h-4 w-4 sm:h-4 sm:w-4" />
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              setIsMinimized(false);
            }}
            className="hover:bg-primary-700 active:bg-primary-800 p-2 rounded-lg transition touch-manipulation"
            aria-label="Close"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <FiX className="h-4 w-4 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 min-h-0">
            {messages.map((message, idx) => (
              <div
                key={idx}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-2.5 sm:p-3 ${
                    message.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm sm:text-sm whitespace-pre-wrap break-words">{message.content}</p>
                </div>
              </div>
            ))}

            {/* Suggested Properties */}
            {suggestedProperties.length > 0 && (
              <div className="mt-3 sm:mt-4">
                <p className="text-xs sm:text-sm font-semibold mb-2 text-gray-700">
                  Properties you might like:
                </p>
                <div className="space-y-2">
                  {suggestedProperties.map((property) => (
                    <div
                      key={property.id}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 sm:p-3 transition touch-manipulation"
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      <div
                        className="cursor-pointer active:bg-gray-200 hover:bg-gray-100 rounded p-2 -m-2"
                        onClick={() => {
                          window.location.href = `/properties/${property.id}`;
                        }}
                      >
                        <p className="font-semibold text-xs sm:text-sm line-clamp-1">{property.title}</p>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                          ₹{(property.price / 100000).toFixed(2)}L • {property.bedrooms}BHK • {property.location}
                        </p>
                      </div>
                      <div className="flex space-x-2 mt-2">
                        <a
                          href={`tel:${PHONE_NUMBER.replace(/[^0-9+]/g, '')}`}
                          onClick={(e) => {
                            e.preventDefault();
                            handleCall();
                          }}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs py-2 px-3 rounded-lg transition flex items-center justify-center space-x-2 touch-manipulation"
                          style={{ WebkitTapHighlightColor: 'transparent' }}
                        >
                          <FiPhone className="h-4 w-4" />
                          <span>Call</span>
                        </a>
                        <button
                          onClick={() => sharePropertyViaWhatsApp(property)}
                          className="flex-1 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-xs py-2 px-3 rounded-lg transition flex items-center justify-center space-x-2 touch-manipulation"
                          style={{ WebkitTapHighlightColor: 'transparent' }}
                        >
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                          </svg>
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-3 sm:p-4 bg-white flex-shrink-0">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 sm:py-2 text-sm sm:text-base focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none"
                style={{ fontSize: '16px' }} // Prevents zoom on iOS
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="bg-primary-600 text-white p-2.5 sm:p-2 rounded-lg hover:bg-primary-700 active:bg-primary-800 transition disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation flex-shrink-0"
                aria-label="Send message"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <FiSend className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
              <p className="text-xs text-gray-500 hidden sm:block flex-1">
                Try: "Show me 3BHK apartments in Mumbai" or "Calculate EMI for ₹50L"
              </p>
              <div className="flex items-center space-x-2 sm:ml-auto">
                <button
                  onClick={handleAIVoiceCall}
                  className="text-xs text-purple-600 hover:text-purple-700 font-semibold flex items-center space-x-1 touch-manipulation"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                  title="AI will call you for verification"
                >
                  <FiPhoneCall className="h-4 w-4" />
                  <span className="hidden sm:inline">AI Call</span>
                  <span className="sm:hidden">AI</span>
                </button>
                <a
                  href={`tel:${PHONE_NUMBER.replace(/[^0-9+]/g, '')}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleCall();
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1 touch-manipulation"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <FiPhone className="h-4 w-4" />
                  <span className="hidden sm:inline">Call Us</span>
                  <span className="sm:hidden">Call</span>
                </a>
                {messages.length > 1 && (
                  <button
                    onClick={handleWhatsAppShare}
                    className="text-xs text-green-600 hover:text-green-700 font-semibold flex items-center space-x-1 touch-manipulation"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    <span className="hidden sm:inline">WhatsApp</span>
                    <span className="sm:hidden">WA</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* AI Voice Call Widget */}
      {showVoiceCall && (
        <VoiceCallWidget
          phoneNumber={voiceCallPhone}
          customerName={voiceCallName}
          onCallComplete={(session: VoiceCallSession) => {
            // Add verification result to chat
            const verificationMessage: ChatMessage = {
              role: 'assistant',
              content: session.isVerified
                ? `✅ Verification Complete!\n\nI've verified you as a real customer. Your verification score is ${session.verificationScore}/100. Our sales team will contact you shortly with personalized property recommendations.`
                : `⚠️ Verification Incomplete\n\nYour verification score is ${session.verificationScore}/100. Please provide more details or our team will contact you for further verification.`,
              timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, verificationMessage]);
          }}
          onClose={() => {
            setShowVoiceCall(false);
            setVoiceCallPhone('');
            setVoiceCallName('');
          }}
        />
      )}
    </div>
  );
}

