import propertiesData from '@/data/properties.json';
import locationsData from '@/data/locations.json';
import enquiriesData from '@/data/enquiries.json';
import visitsData from '@/data/visits.json';
import chatbotKnowledge from '@/data/chatbot-knowledge.json';

export interface Property {
  id: string;
  title: string;
  type: string;
  location: string;
  city: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  areaUnit: string;
  images: string[];
  description: string;
  features: string[];
  amenities: string[];
  nearbyFacilities: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  status: string;
  views: number;
  popularity: number;
  listedDate: string;
}

export interface Enquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  submittedAt: string;
  comments: Array<{
    text: string;
    addedAt: string;
  }>;
}

export interface Visit {
  id: string;
  propertyId: string;
  propertyTitle: string;
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  status: string;
  submittedAt: string;
  notes: string;
}

// In-memory storage (simulating file updates)
let properties: Property[] = [...propertiesData as Property[]];
let enquiries: Enquiry[] = [...enquiriesData as Enquiry[]];
let visits: Visit[] = [...visitsData as Visit[]];

export const getProperties = (): Property[] => {
  return properties;
};

export const getPropertyById = (id: string): Property | undefined => {
  return properties.find(p => p.id === id);
};

export const addProperty = (property: Omit<Property, 'id' | 'views' | 'popularity' | 'listedDate'>): Property => {
  const newProperty: Property = {
    ...property,
    id: String(properties.length + 1),
    views: 0,
    popularity: 0,
    listedDate: new Date().toISOString().split('T')[0],
  };
  properties.push(newProperty);
  return newProperty;
};

export const updateProperty = (id: string, updates: Partial<Property>): Property | null => {
  const index = properties.findIndex(p => p.id === id);
  if (index === -1) return null;
  properties[index] = { ...properties[index], ...updates };
  return properties[index];
};

export const deleteProperty = (id: string): boolean => {
  const index = properties.findIndex(p => p.id === id);
  if (index === -1) return false;
  properties.splice(index, 1);
  return true;
};

export const getEnquiries = (): Enquiry[] => {
  return enquiries;
};

export const addEnquiry = (enquiry: Omit<Enquiry, 'id' | 'submittedAt' | 'status' | 'comments'>): Enquiry => {
  const newEnquiry: Enquiry = {
    ...enquiry,
    id: `enq-${Date.now()}`,
    submittedAt: new Date().toISOString(),
    status: 'New',
    comments: [],
  };
  enquiries.push(newEnquiry);
  return newEnquiry;
};

export const updateEnquiryStatus = (id: string, status: string, comment?: string): Enquiry | null => {
  const enquiry = enquiries.find(e => e.id === id);
  if (!enquiry) return null;
  enquiry.status = status;
  if (comment) {
    enquiry.comments.push({
      text: comment,
      addedAt: new Date().toISOString(),
    });
  }
  return enquiry;
};

export const getVisits = (): Visit[] => {
  return visits;
};

export const addVisit = (visit: Omit<Visit, 'id' | 'submittedAt' | 'status'>): Visit => {
  const newVisit: Visit = {
    ...visit,
    id: `visit-${Date.now()}`,
    submittedAt: new Date().toISOString(),
    status: 'Scheduled',
  };
  visits.push(newVisit);
  return newVisit;
};

export const updateVisitStatus = (id: string, status: string, notes?: string): Visit | null => {
  const visit = visits.find(v => v.id === id);
  if (!visit) return null;
  visit.status = status;
  if (notes) {
    visit.notes = notes;
  }
  return visit;
};

export const getLocations = () => {
  return locationsData;
};

export const getChatbotKnowledge = () => {
  return chatbotKnowledge;
};

export const incrementPropertyViews = (id: string): void => {
  const property = properties.find(p => p.id === id);
  if (property) {
    property.views += 1;
  }
};

