import { QualifiedLead } from './lead-qualifier';

// Server-side only: Use Node.js fs module
let fs: any;
let path: any;

if (typeof window === 'undefined') {
  // Server-side
  fs = require('fs');
  path = require('path');
}

const QUALIFIED_LEADS_FILE = process.cwd() 
  ? path.join(process.cwd(), 'data', 'qualified-leads.json')
  : './data/qualified-leads.json';

// Ensure data directory exists
const ensureDataDirectory = () => {
  if (typeof window !== 'undefined') return; // Client-side, skip
  
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// In-memory fallback for client-side or if file operations fail
let inMemoryLeads: QualifiedLead[] = [];

// Load qualified leads from file
export const loadQualifiedLeads = (): QualifiedLead[] => {
  if (typeof window !== 'undefined') {
    // Client-side: return in-memory data
    return inMemoryLeads;
  }

  try {
    ensureDataDirectory();
    if (fs && fs.existsSync(QUALIFIED_LEADS_FILE)) {
      const data = fs.readFileSync(QUALIFIED_LEADS_FILE, 'utf-8');
      const leads = JSON.parse(data);
      inMemoryLeads = leads; // Sync in-memory
      return leads;
    }
  } catch (error) {
    console.error('Error loading qualified leads:', error);
  }
  return inMemoryLeads;
};

// Save qualified leads to file
export const saveQualifiedLead = (lead: QualifiedLead): void => {
  if (typeof window !== 'undefined') {
    // Client-side: update in-memory only
    const leads = loadQualifiedLeads();
    const existingIndex = leads.findIndex((l) => l.enquiryId === lead.enquiryId);
    if (existingIndex >= 0) {
      leads[existingIndex] = lead;
    } else {
      leads.push(lead);
    }
    inMemoryLeads = leads;
    return;
  }

  try {
    ensureDataDirectory();
    const leads = loadQualifiedLeads();
    
    // Check if lead already exists
    const existingIndex = leads.findIndex((l) => l.enquiryId === lead.enquiryId);
    
    if (existingIndex >= 0) {
      leads[existingIndex] = lead;
    } else {
      leads.push(lead);
    }
    
    inMemoryLeads = leads; // Sync in-memory
    if (fs) {
      fs.writeFileSync(QUALIFIED_LEADS_FILE, JSON.stringify(leads, null, 2));
    }
  } catch (error) {
    console.error('Error saving qualified lead:', error);
  }
};

// Update qualified lead
export const updateQualifiedLead = (enquiryId: string, updates: Partial<QualifiedLead>): QualifiedLead | null => {
  const leads = loadQualifiedLeads();
  const leadIndex = leads.findIndex((l) => l.enquiryId === enquiryId);
  
  if (leadIndex === -1) {
    return null;
  }
  
  leads[leadIndex] = { ...leads[leadIndex], ...updates };
  inMemoryLeads = leads;

  if (typeof window === 'undefined' && fs) {
    try {
      ensureDataDirectory();
      fs.writeFileSync(QUALIFIED_LEADS_FILE, JSON.stringify(leads, null, 2));
    } catch (error) {
      console.error('Error updating qualified lead:', error);
    }
  }
  
  return leads[leadIndex];
};

// Get qualified lead by enquiry ID
export const getQualifiedLead = (enquiryId: string): QualifiedLead | null => {
  const leads = loadQualifiedLeads();
  return leads.find((l) => l.enquiryId === enquiryId) || null;
};

// Get all qualified leads with optional filters
export const getAllQualifiedLeads = (filters?: {
  status?: 'HOT' | 'WARM' | 'COLD';
  minScore?: number;
  maxScore?: number;
}): QualifiedLead[] => {
  let leads = loadQualifiedLeads();
  
  if (filters) {
    if (filters.status) {
      leads = leads.filter((l) => l.status === filters.status);
    }
    if (filters.minScore !== undefined) {
      leads = leads.filter((l) => l.qualificationScore >= filters.minScore!);
    }
    if (filters.maxScore !== undefined) {
      leads = leads.filter((l) => l.qualificationScore <= filters.maxScore!);
    }
  }
  
  // Sort by qualification score (descending) and then by date
  return leads.sort((a, b) => {
    if (b.qualificationScore !== a.qualificationScore) {
      return b.qualificationScore - a.qualificationScore;
    }
    return new Date(b.qualifiedAt).getTime() - new Date(a.qualifiedAt).getTime();
  });
};

// Delete qualified lead
export const deleteQualifiedLead = (enquiryId: string): boolean => {
  const leads = loadQualifiedLeads();
  const filteredLeads = leads.filter((l) => l.enquiryId !== enquiryId);
  inMemoryLeads = filteredLeads;

  if (typeof window === 'undefined' && fs) {
    try {
      ensureDataDirectory();
      fs.writeFileSync(QUALIFIED_LEADS_FILE, JSON.stringify(filteredLeads, null, 2));
    } catch (error) {
      console.error('Error deleting qualified lead:', error);
      return false;
    }
  }
  
  return true;
};

// Get statistics
export const getQualifiedLeadsStats = () => {
  const leads = loadQualifiedLeads();
  
  return {
    total: leads.length,
    hot: leads.filter((l) => l.status === 'HOT').length,
    warm: leads.filter((l) => l.status === 'WARM').length,
    cold: leads.filter((l) => l.status === 'COLD').length,
    avgScore: leads.length > 0
      ? Math.round(leads.reduce((sum, l) => sum + l.qualificationScore, 0) / leads.length)
      : 0,
    appointmentsBooked: leads.filter((l) => l.appointmentBooked).length,
  };
};

