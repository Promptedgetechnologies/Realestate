import { NextRequest, NextResponse } from 'next/server';
import { notifyHotLead } from '@/lib/notifications';
import { QualifiedLead } from '@/lib/lead-qualifier';

// Test endpoint for notifications (for development/testing)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Create a test lead
    const testLead: QualifiedLead = {
      enquiryId: 'test-' + Date.now(),
      name: body.name || 'Test Lead',
      email: body.email || 'test@example.com',
      phone: body.phone || '+1234567890',
      qualificationScore: body.score || 85,
      status: (body.status as 'HOT' | 'WARM' | 'COLD') || 'HOT',
      answers: [],
      insights: [
        '✅ High budget range indicated',
        '✅ Immediate purchase timeline',
        '✅ Pre-approved for loan',
      ],
      recommendedAction: 'URGENT: Contact within 1 hour and schedule site visit',
      qualifiedAt: new Date().toISOString(),
    };

    const results = await notifyHotLead(testLead);
    
    return NextResponse.json({
      success: true,
      message: 'Test notifications sent',
      results,
    });
  } catch (error) {
    console.error('Error testing notifications:', error);
    return NextResponse.json(
      { error: 'Failed to send test notifications' },
      { status: 500 }
    );
  }
}

