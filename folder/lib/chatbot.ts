import { getProperties, getPropertyById, Property } from './data-loader';
import chatbotKnowledge from '@/data/chatbot-knowledge.json';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatContext {
  requirements: {
    location?: string;
    priceRange?: { min: number; max: number };
    bedrooms?: number;
    propertyType?: string;
    amenities?: string[];
  };
  conversationHistory: ChatMessage[];
}

// Simple intent detection
export const detectIntent = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('budget')) {
    return 'price_query';
  }
  if (lowerMessage.includes('location') || lowerMessage.includes('area') || lowerMessage.includes('where')) {
    return 'location_query';
  }
  if (lowerMessage.includes('bedroom') || lowerMessage.includes('bhk') || lowerMessage.includes('room')) {
    return 'bedroom_query';
  }
  if (lowerMessage.includes('amenity') || lowerMessage.includes('facility') || lowerMessage.includes('feature')) {
    return 'amenity_query';
  }
  if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('show')) {
    return 'recommendation';
  }
  if (lowerMessage.includes('emi') || lowerMessage.includes('loan') || lowerMessage.includes('installment')) {
    return 'emi_query';
  }
  if (lowerMessage.includes('visit') || lowerMessage.includes('schedule') || lowerMessage.includes('see')) {
    return 'visit_request';
  }
  if (lowerMessage.includes('verify') || lowerMessage.includes('verification') || lowerMessage.includes('call me') || lowerMessage.includes('ai call')) {
    return 'verification_request';
  }
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('help')) {
    return 'greeting';
  }
  
  return 'general';
};

// Extract requirements from message
export const extractRequirements = (message: string, context: ChatContext): ChatContext['requirements'] => {
  const lowerMessage = message.toLowerCase();
  const requirements = { ...context.requirements };
  
  // Extract location
  const cities = ['mumbai', 'bangalore', 'delhi', 'hyderabad', 'pune'];
  const locations = ['downtown', 'suburban', 'uptown', 'midtown'];
  
  cities.forEach(city => {
    if (lowerMessage.includes(city)) {
      requirements.location = city;
    }
  });
  
  locations.forEach(loc => {
    if (lowerMessage.includes(loc)) {
      requirements.location = loc;
    }
  });
  
  // Extract bedrooms
  const bedroomMatch = lowerMessage.match(/(\d+)\s*(bhk|bedroom|bed)/i);
  if (bedroomMatch) {
    requirements.bedrooms = parseInt(bedroomMatch[1]);
  }
  
  // Extract price
  const priceMatch = lowerMessage.match(/(\d+)\s*(lakh|lac|crore|cr)/i);
  if (priceMatch) {
    const value = parseFloat(priceMatch[1]);
    const unit = priceMatch[2].toLowerCase();
    if (unit.includes('crore') || unit.includes('cr')) {
      requirements.priceRange = { min: value * 10000000, max: (value + 1) * 10000000 };
    } else {
      requirements.priceRange = { min: value * 100000, max: (value + 1) * 100000 };
    }
  }
  
  // Extract property type
  const types = ['apartment', 'villa', 'penthouse', 'studio', 'house'];
  types.forEach(type => {
    if (lowerMessage.includes(type)) {
      requirements.propertyType = type;
    }
  });
  
  return requirements;
};

// Match properties based on requirements
export const matchProperties = (requirements: ChatContext['requirements']): Property[] => {
  let properties = getProperties();
  
  if (requirements.location) {
    properties = properties.filter(p => 
      p.location.toLowerCase().includes(requirements.location!.toLowerCase()) ||
      p.city.toLowerCase().includes(requirements.location!.toLowerCase())
    );
  }
  
  if (requirements.bedrooms) {
    properties = properties.filter(p => p.bedrooms === requirements.bedrooms);
  }
  
  if (requirements.priceRange) {
    properties = properties.filter(p => 
      p.price >= requirements.priceRange!.min && p.price <= requirements.priceRange!.max
    );
  }
  
  if (requirements.propertyType) {
    properties = properties.filter(p => 
      p.type.toLowerCase() === requirements.propertyType!.toLowerCase()
    );
  }
  
  // Sort by popularity
  return properties.sort((a, b) => b.popularity - a.popularity).slice(0, 5);
};

// Generate response based on intent
export const generateResponse = (
  message: string,
  context: ChatContext
): { response: string; properties?: Property[]; showEMICalculator?: boolean; showVisitForm?: boolean } => {
  const intent = detectIntent(message);
  const updatedRequirements = extractRequirements(message, context);
  context.requirements = updatedRequirements;
  
  switch (intent) {
    case 'greeting':
      return {
        response: "Hello! I'm your real estate assistant. I can help you:\n\n" +
          "🏠 Find properties based on your requirements\n" +
          "💰 Calculate EMI and understand pricing\n" +
          "📍 Get information about locations\n" +
          "📅 Schedule site visits\n" +
          "❓ Answer questions about properties\n\n" +
          "What are you looking for today?"
      };
    
    case 'price_query':
      const priceInfo = chatbotKnowledge.priceRanges as any;
      return {
        response: "Here's our pricing structure:\n\n" +
          `💰 Budget: ${priceInfo.budget}\n` +
          `🏠 Mid-range: ${priceInfo.midRange}\n` +
          `✨ Premium: ${priceInfo.premium}\n` +
          `👑 Luxury: ${priceInfo.luxury}\n\n` +
          "Would you like to see properties in a specific price range?"
      };
    
    case 'location_query':
      const locationInfo = chatbotKnowledge.locationInfo as any;
      const location = updatedRequirements.location || 'general';
      const locDesc = locationInfo[location] || "We have properties in prime locations across major cities with excellent connectivity and amenities.";
      return {
        response: `📍 ${location.charAt(0).toUpperCase() + location.slice(1)}:\n\n${locDesc}\n\n` +
          "Would you like to see properties in this location?"
      };
    
    case 'bedroom_query':
      return {
        response: `I found properties with ${updatedRequirements.bedrooms || 'your preferred'} bedrooms. ` +
          "Let me show you the best matches based on your requirements."
      };
    
    case 'recommendation':
      const matched = matchProperties(updatedRequirements);
      if (matched.length === 0) {
        return {
          response: "I couldn't find exact matches, but here are some great options you might like:",
          properties: getProperties().slice(0, 3)
        };
      }
      return {
        response: `I found ${matched.length} properties matching your requirements:\n\n` +
          matched.map((p, i) => 
            `${i + 1}. ${p.title}\n   💰 ₹${(p.price / 100000).toFixed(2)}L | 🏠 ${p.bedrooms}BHK | 📍 ${p.location}, ${p.city}`
          ).join('\n\n') +
          "\n\nWould you like more details about any of these?"
      };
    
    case 'emi_query':
      return {
        response: "I can help you calculate EMI! Here's how it works:\n\n" +
          `💳 Interest Rate: ${chatbotKnowledge.emiInfo.interestRate}%\n` +
          `📅 Max Tenure: ${chatbotKnowledge.emiInfo.maxTenure} years\n` +
          `💰 Min Down Payment: ${chatbotKnowledge.emiInfo.minDownPayment}%\n\n` +
          chatbotKnowledge.emiInfo.explanation +
          "\n\nWould you like to use the EMI calculator for a specific property?",
        showEMICalculator: true
      };
    
    case 'visit_request':
      return {
        response: "Great! I can help you schedule a site visit. Please fill out the form with your preferred date and time, and we'll get back to you shortly.",
        showVisitForm: true
      };
    
    case 'verification_request':
      return {
        response: "Great! I can help you get verified as a real customer. Here's how it works:\n\n" +
          "🤖 **AI Voice Verification Call**\n" +
          "• I'll call you on your phone number\n" +
          "• Ask a few quick verification questions (about 2-3 minutes)\n" +
          "• Verify you're a genuine customer\n" +
          "• Once verified, you'll get priority assistance from our sales team\n\n" +
          "Click the purple phone icon (📞) in the header, or tell me your phone number to get started!\n\n" +
          "Example: \"My number is +919876543210\" or \"Call me at 9876543210\""
      };
    
    default:
      // Try to match properties anyway
      const generalMatch = matchProperties(updatedRequirements);
      if (generalMatch.length > 0) {
        return {
          response: "Based on your message, here are some properties you might be interested in:",
          properties: generalMatch.slice(0, 3)
        };
      }
      return {
        response: "I understand you're looking for a property. Could you tell me more about:\n\n" +
          "📍 Preferred location\n" +
          "💰 Budget range\n" +
          "🏠 Number of bedrooms\n" +
          "🏢 Property type (Apartment/Villa/Penthouse)\n\n" +
          "This will help me find the perfect match for you!"
      };
  }
};

// Calculate EMI
export const calculateEMI = (principal: number, rate: number, tenure: number): number => {
  const monthlyRate = rate / 12 / 100;
  const months = tenure * 12;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
              (Math.pow(1 + monthlyRate, months) - 1);
  return Math.round(emi);
};

