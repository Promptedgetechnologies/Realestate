import { NextRequest, NextResponse } from 'next/server';
import { simulateVoiceCall, VoiceCallSession } from '@/lib/voice-call';

// In-memory storage for call sessions (in production, use database)
let callSessions: VoiceCallSession[] = [];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const phoneNumber = searchParams.get('phoneNumber');
  const sessionId = searchParams.get('sessionId');

  let sessions = callSessions;

  if (phoneNumber) {
    sessions = sessions.filter((s) => s.phoneNumber === phoneNumber);
  }

  if (sessionId) {
    sessions = sessions.filter((s) => s.id === sessionId);
  }

  // Sort by most recent first
  sessions.sort((a, b) => 
    new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  );

  return NextResponse.json(sessions);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber, customerName } = body;

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // In production, this would trigger an actual phone call via Twilio
    // For now, we simulate the call
    console.log(`📞 Initiating AI voice call to ${phoneNumber}...`);

    // Simulate the voice call conversation
    const session = await simulateVoiceCall(phoneNumber, customerName);

    // Store the session
    callSessions.push(session);

    // If verified, trigger notifications
    if (session.isVerified) {
      console.log('✅ Customer verified via voice call!', session);
      // You can trigger notifications here similar to lead qualification
    } else {
      console.log('⚠️ Customer verification failed - needs manual review', session);
    }

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error('Error initiating voice call:', error);
    return NextResponse.json(
      { error: 'Failed to initiate voice call' },
      { status: 500 }
    );
  }
}


