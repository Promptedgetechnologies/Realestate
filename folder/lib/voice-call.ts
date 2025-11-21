export interface VoiceCallQuestion {
  id: string;
  question: string;
  type: 'yes_no' | 'multiple_choice' | 'open_ended' | 'number';
  options?: string[];
  verificationWeight: number; // How important for verification (1-10)
}

export interface VoiceCallResponse {
  questionId: string;
  answer: string;
  confidence: number; // 0-1, how confident we are in the answer
  timestamp: string;
}

export interface VoiceCallSession {
  id: string;
  phoneNumber: string;
  customerName?: string;
  status: 'initiating' | 'ringing' | 'connected' | 'in_progress' | 'completed' | 'failed';
  verificationScore: number; // 0-100
  isVerified: boolean;
  responses: VoiceCallResponse[];
  startedAt: string;
  endedAt?: string;
  transcript?: string;
}

// Verification questions for real customer verification
export const verificationQuestions: VoiceCallQuestion[] = [
  {
    id: 'greeting',
    question: 'Hello! This is an automated call from Serniq Real Estate. Am I speaking with a real person interested in properties?',
    type: 'yes_no',
    verificationWeight: 10,
  },
  {
    id: 'interest_confirmation',
    question: 'Great! Can you confirm you are genuinely interested in buying or renting a property?',
    type: 'yes_no',
    verificationWeight: 9,
  },
  {
    id: 'budget_range',
    question: 'What is your approximate budget range? You can say under 50 lakhs, 50 lakhs to 1 crore, 1 to 2 crores, or above 2 crores.',
    type: 'multiple_choice',
    options: ['under 50 lakhs', '50 lakhs to 1 crore', '1 to 2 crores', 'above 2 crores'],
    verificationWeight: 8,
  },
  {
    id: 'timeline',
    question: 'When are you planning to make a purchase? You can say within 1 month, 1 to 3 months, 3 to 6 months, or just exploring.',
    type: 'multiple_choice',
    options: ['within 1 month', '1 to 3 months', '3 to 6 months', 'just exploring'],
    verificationWeight: 7,
  },
  {
    id: 'location_preference',
    question: 'Do you have a preferred location or area in mind?',
    type: 'open_ended',
    verificationWeight: 6,
  },
  {
    id: 'property_type',
    question: 'What type of property are you looking for? Apartment, Villa, Penthouse, or House?',
    type: 'multiple_choice',
    options: ['apartment', 'villa', 'penthouse', 'house'],
    verificationWeight: 7,
  },
  {
    id: 'contact_preference',
    question: 'Would you like our sales team to contact you with property recommendations?',
    type: 'yes_no',
    verificationWeight: 8,
  },
];

// Simulate voice call conversation
export const simulateVoiceCall = async (
  phoneNumber: string,
  customerName?: string
): Promise<VoiceCallSession> => {
  const sessionId = `call-${Date.now()}`;
  const session: VoiceCallSession = {
    id: sessionId,
    phoneNumber,
    customerName,
    status: 'initiating',
    verificationScore: 0,
    isVerified: false,
    responses: [],
    startedAt: new Date().toISOString(),
  };

  // Simulate call progression
  await new Promise((resolve) => setTimeout(resolve, 1000));
  session.status = 'ringing';

  await new Promise((resolve) => setTimeout(resolve, 2000));
  session.status = 'connected';

  await new Promise((resolve) => setTimeout(resolve, 1000));
  session.status = 'in_progress';

  // Simulate asking questions and getting responses
  let totalScore = 0;
  let maxScore = 0;

  for (const question of verificationQuestions) {
    maxScore += question.verificationWeight * 10;

    // Simulate realistic responses (70% chance of positive verification)
    let answer = '';
    let confidence = 0.8;

    if (question.type === 'yes_no') {
      answer = Math.random() > 0.3 ? 'yes' : 'no';
      if (answer === 'yes') {
        totalScore += question.verificationWeight * 10;
      }
    } else if (question.type === 'multiple_choice' && question.options) {
      answer = question.options[Math.floor(Math.random() * question.options.length)];
      // Positive answers get points
      if (!answer.includes('exploring') && !answer.includes('not sure')) {
        totalScore += question.verificationWeight * 8;
      } else {
        totalScore += question.verificationWeight * 3;
      }
    } else {
      answer = 'I have a preference';
      totalScore += question.verificationWeight * 7;
    }

    session.responses.push({
      questionId: question.id,
      answer,
      confidence,
      timestamp: new Date().toISOString(),
    });

    // Simulate delay between questions
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  session.verificationScore = Math.round((totalScore / maxScore) * 100);
  session.isVerified = session.verificationScore >= 60;
  session.status = 'completed';
  session.endedAt = new Date().toISOString();

  // Generate transcript
  session.transcript = generateTranscript(session, verificationQuestions);

  return session;
};

// Generate conversation transcript
const generateTranscript = (
  session: VoiceCallSession,
  questions: VoiceCallQuestion[]
): string => {
  let transcript = `Voice Call Verification Transcript\n`;
  transcript += `Date: ${new Date(session.startedAt).toLocaleString()}\n`;
  transcript += `Customer: ${session.customerName || session.phoneNumber}\n`;
  transcript += `Phone: ${session.phoneNumber}\n\n`;
  transcript += `=== Conversation ===\n\n`;

  questions.forEach((question, index) => {
    const response = session.responses.find((r) => r.questionId === question.id);
    transcript += `AI: ${question.question}\n`;
    if (response) {
      transcript += `Customer: ${response.answer}\n`;
    }
    transcript += `\n`;
  });

  transcript += `\n=== Verification Result ===\n`;
  transcript += `Score: ${session.verificationScore}/100\n`;
  transcript += `Status: ${session.isVerified ? '✅ VERIFIED - Real Customer' : '⚠️ NOT VERIFIED - Needs Review'}\n`;

  return transcript;
};

// Calculate verification score from responses
export const calculateVerificationScore = (
  responses: VoiceCallResponse[],
  questions: VoiceCallQuestion[]
): { score: number; isVerified: boolean } => {
  let totalScore = 0;
  let maxScore = 0;

  responses.forEach((response) => {
    const question = questions.find((q) => q.id === response.questionId);
    if (!question) return;

    maxScore += question.verificationWeight * 10;

    if (question.type === 'yes_no') {
      if (response.answer.toLowerCase().includes('yes')) {
        totalScore += question.verificationWeight * 10;
      }
    } else if (question.type === 'multiple_choice') {
      const answer = response.answer.toLowerCase();
      if (answer.includes('exploring') || answer.includes('not sure')) {
        totalScore += question.verificationWeight * 3;
      } else {
        totalScore += question.verificationWeight * 8;
      }
    } else {
      // Open ended - if they answered, give partial credit
      if (response.answer.length > 5) {
        totalScore += question.verificationWeight * 7;
      }
    }
  });

  const score = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  const isVerified = score >= 60;

  return { score, isVerified };
};

