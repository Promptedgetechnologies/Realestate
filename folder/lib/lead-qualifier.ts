export interface QualificationQuestion {
  id: string;
  question: string;
  type: 'text' | 'select' | 'number' | 'date' | 'boolean';
  options?: string[];
  weight: number; // How important this question is (1-10)
  hotCriteria?: any; // What makes this a hot lead
  coldCriteria?: any; // What makes this a cold lead
}

export interface QualificationAnswer {
  questionId: string;
  answer: string | number | boolean;
  timestamp: string;
}

export interface QualifiedLead {
  enquiryId: string;
  name: string;
  email: string;
  phone: string;
  propertyId?: string;
  propertyTitle?: string;
  qualificationScore: number; // 0-100
  status: 'HOT' | 'COLD' | 'WARM';
  answers: QualificationAnswer[];
  insights: string[];
  recommendedAction: string;
  qualifiedAt: string;
  appointmentBooked?: boolean;
  appointmentDate?: string;
  appointmentTime?: string;
}

// Qualification Questions for Real Estate
export const qualificationQuestions: QualificationQuestion[] = [
  {
    id: 'property_type',
    question: 'What type of property are you interested in?',
    type: 'select',
    options: ['Apartment', 'Villa', 'Penthouse', 'House', 'Studio', 'Not sure'],
    weight: 8,
    hotCriteria: { values: ['Apartment', 'Villa', 'Penthouse', 'House'] },
    coldCriteria: { values: ['Not sure'] },
  },
  {
    id: 'budget',
    question: 'What is your budget range?',
    type: 'select',
    options: [
      'Under ₹50 Lakh',
      '₹50 Lakh - ₹1 Crore',
      '₹1 Crore - ₹2 Crore',
      '₹2 Crore - ₹5 Crore',
      'Above ₹5 Crore',
      'Not decided yet',
    ],
    weight: 10,
    hotCriteria: { values: ['₹50 Lakh - ₹1 Crore', '₹1 Crore - ₹2 Crore', '₹2 Crore - ₹5 Crore', 'Above ₹5 Crore'] },
    coldCriteria: { values: ['Not decided yet', 'Under ₹50 Lakh'] },
  },
  {
    id: 'timeline',
    question: 'When are you planning to buy?',
    type: 'select',
    options: [
      'Within 1 month',
      '1-3 months',
      '3-6 months',
      '6-12 months',
      'Just exploring',
      'Not sure',
    ],
    weight: 9,
    hotCriteria: { values: ['Within 1 month', '1-3 months', '3-6 months'] },
    coldCriteria: { values: ['Just exploring', 'Not sure', '6-12 months'] },
  },
  {
    id: 'loan_preapproval',
    question: 'Are you pre-approved for a home loan?',
    type: 'select',
    options: ['Yes, already approved', 'Applied, waiting for approval', 'Planning to apply', 'No, not yet'],
    weight: 9,
    hotCriteria: { values: ['Yes, already approved', 'Applied, waiting for approval'] },
    coldCriteria: { values: ['No, not yet'] },
  },
  {
    id: 'bedrooms',
    question: 'How many bedrooms are you looking for?',
    type: 'select',
    options: ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK', 'Not sure'],
    weight: 7,
    hotCriteria: { values: ['2 BHK', '3 BHK', '4 BHK', '5+ BHK'] },
    coldCriteria: { values: ['Not sure'] },
  },
  {
    id: 'location_preference',
    question: 'Do you have a preferred location?',
    type: 'select',
    options: ['Yes, specific area', 'Yes, general area', 'Open to suggestions', 'Not decided'],
    weight: 6,
    hotCriteria: { values: ['Yes, specific area', 'Yes, general area'] },
    coldCriteria: { values: ['Not decided'] },
  },
  {
    id: 'site_visit',
    question: 'Would you like to schedule a site visit?',
    type: 'select',
    options: ['Yes, immediately', 'Yes, this week', 'Yes, next week', 'Maybe later', 'Not interested'],
    weight: 10,
    hotCriteria: { values: ['Yes, immediately', 'Yes, this week', 'Yes, next week'] },
    coldCriteria: { values: ['Not interested', 'Maybe later'] },
  },
];

// Calculate qualification score
export const calculateQualificationScore = (
  answers: QualificationAnswer[],
  questions: QualificationQuestion[]
): { score: number; insights: string[] } => {
  let totalScore = 0;
  let maxScore = 0;
  const insights: string[] = [];

  answers.forEach((answer) => {
    const question = questions.find((q) => q.id === answer.questionId);
    if (!question) return;

    maxScore += question.weight * 10;

    // Check if answer matches hot criteria
    if (question.hotCriteria) {
      if (question.hotCriteria.values?.includes(answer.answer as string)) {
        totalScore += question.weight * 10;
        insights.push(`✅ ${question.question}: Strong interest indicated`);
      } else if (question.coldCriteria?.values?.includes(answer.answer as string)) {
        insights.push(`⚠️ ${question.question}: Low commitment level`);
      } else {
        // Medium score
        totalScore += question.weight * 5;
      }
    }
  });

  const finalScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  return { score: finalScore, insights };
};

// Determine lead status
export const determineLeadStatus = (score: number): 'HOT' | 'COLD' | 'WARM' => {
  if (score >= 70) return 'HOT';
  if (score >= 40) return 'WARM';
  return 'COLD';
};

// Get recommended action
export const getRecommendedAction = (status: string, answers: QualificationAnswer[]): string => {
  const siteVisitAnswer = answers.find((a) => a.questionId === 'site_visit');
  const timelineAnswer = answers.find((a) => a.questionId === 'timeline');

  if (status === 'HOT') {
    if (siteVisitAnswer && ['Yes, immediately', 'Yes, this week'].includes(siteVisitAnswer.answer as string)) {
      return 'URGENT: Schedule site visit immediately and assign to top sales agent';
    }
    return 'High priority: Contact within 1 hour, send property details, schedule visit';
  }

  if (status === 'WARM') {
    return 'Follow up within 24 hours with personalized property recommendations';
  }

  return 'Add to nurture campaign, send monthly updates, re-engage in 3 months';
};

// Generate qualification summary
export const generateQualificationSummary = (lead: QualifiedLead): string => {
  const budgetAnswer = lead.answers.find((a) => a.questionId === 'budget');
  const timelineAnswer = lead.answers.find((a) => a.questionId === 'timeline');
  const loanAnswer = lead.answers.find((a) => a.questionId === 'loan_preapproval');

  let summary = `Lead Qualification Summary for ${lead.name}:\n\n`;
  summary += `📊 Qualification Score: ${lead.qualificationScore}/100\n`;
  summary += `🔥 Status: ${lead.status}\n\n`;

  if (budgetAnswer) {
    summary += `💰 Budget: ${budgetAnswer.answer}\n`;
  }
  if (timelineAnswer) {
    summary += `📅 Timeline: ${timelineAnswer.answer}\n`;
  }
  if (loanAnswer) {
    summary += `🏦 Loan Status: ${loanAnswer.answer}\n`;
  }

  summary += `\n💡 Recommended Action: ${lead.recommendedAction}\n`;

  return summary;
};

// Simulate AI conversation flow
export const simulateAIConversation = async (
  enquiryId: string,
  leadInfo: { name: string; email: string; phone: string; propertyId?: string; propertyTitle?: string }
): Promise<QualifiedLead> => {
  // In a real implementation, this would:
  // 1. Make an actual phone call using Twilio/other service
  // 2. Use speech-to-text to get answers
  // 3. Use AI to ask follow-up questions
  // For now, we'll simulate with a delay and return a qualified lead

  const answers: QualificationAnswer[] = [];
  const timestamp = new Date().toISOString();

  // Simulate asking questions (in real app, this would be via phone call)
  qualificationQuestions.forEach((question, index) => {
    // Simulate realistic answers based on question type
    let answer: string | number | boolean;
    
    if (question.type === 'select' && question.options) {
      // Simulate 70% chance of hot answer for demo
      const hotOptions = question.hotCriteria?.values || [];
      const coldOptions = question.coldCriteria?.values || [];
      const allOptions = question.options;
      
      if (Math.random() > 0.3 && hotOptions.length > 0) {
        answer = hotOptions[Math.floor(Math.random() * hotOptions.length)];
      } else if (Math.random() > 0.5 && coldOptions.length > 0) {
        answer = coldOptions[Math.floor(Math.random() * coldOptions.length)];
      } else {
        answer = allOptions[Math.floor(Math.random() * allOptions.length)];
      }
    } else {
      answer = 'Yes';
    }

    answers.push({
      questionId: question.id,
      answer,
      timestamp: new Date(Date.now() + index * 2000).toISOString(), // Simulate 2s delay per question
    });
  });

  const { score, insights } = calculateQualificationScore(answers, qualificationQuestions);
  const status = determineLeadStatus(score);
  const recommendedAction = getRecommendedAction(status, answers);

  const qualifiedLead: QualifiedLead = {
    enquiryId,
    name: leadInfo.name,
    email: leadInfo.email,
    phone: leadInfo.phone,
    propertyId: leadInfo.propertyId,
    propertyTitle: leadInfo.propertyTitle,
    qualificationScore: score,
    status,
    answers,
    insights,
    recommendedAction,
    qualifiedAt: new Date().toISOString(),
  };

  return qualifiedLead;
};

