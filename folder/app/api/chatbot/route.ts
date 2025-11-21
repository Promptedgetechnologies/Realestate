import { NextRequest, NextResponse } from 'next/server';
import { generateResponse, ChatContext } from '@/lib/chatbot';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, context } = body;
    
    const chatContext: ChatContext = context || {
      requirements: {},
      conversationHistory: [],
    };
    
    const response = generateResponse(message, chatContext);
    
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process chatbot request' },
      { status: 500 }
    );
  }
}

