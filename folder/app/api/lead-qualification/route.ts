import { NextRequest, NextResponse } from 'next/server';
import { simulateAIConversation, QualifiedLead } from '@/lib/lead-qualifier';
import { notifyHotLead } from '@/lib/notifications';
import {
  saveQualifiedLead,
  getAllQualifiedLeads,
  updateQualifiedLead as updateStoredLead,
  getQualifiedLead,
} from '@/lib/lead-storage';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') as 'HOT' | 'WARM' | 'COLD' | null;
  const enquiryId = searchParams.get('enquiryId');

  let leads = getAllQualifiedLeads();

  if (status) {
    leads = leads.filter((l) => l.status === status);
  }

  if (enquiryId) {
    leads = leads.filter((l) => l.enquiryId === enquiryId);
  }

  return NextResponse.json(leads);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { enquiryId, name, email, phone, propertyId, propertyTitle } = body;

    if (!enquiryId || !name || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Simulate AI calling the lead instantly (0-30 seconds)
    // In production, this would trigger an actual phone call via Twilio/other service
    const qualifiedLead = await simulateAIConversation(enquiryId, {
      name,
      email,
      phone,
      propertyId,
      propertyTitle,
    });

    // Store the qualified lead persistently
    saveQualifiedLead(qualifiedLead);

    // If it's a HOT lead, trigger all notifications
    if (qualifiedLead.status === 'HOT') {
      console.log('🔥 HOT LEAD DETECTED!', qualifiedLead);
      
      // Send all notifications (email, WhatsApp, Slack, CRM)
      const notificationResults = await notifyHotLead(qualifiedLead);
      console.log('📬 Notification Results:', notificationResults);
    }

    return NextResponse.json(qualifiedLead, { status: 201 });
  } catch (error) {
    console.error('Error qualifying lead:', error);
    return NextResponse.json(
      { error: 'Failed to qualify lead' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { enquiryId, appointmentDate, appointmentTime, ...otherUpdates } = body;

    const updatedLead = updateStoredLead(enquiryId, {
      appointmentBooked: appointmentDate ? true : undefined,
      appointmentDate,
      appointmentTime,
      ...otherUpdates,
    });

    if (!updatedLead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json(updatedLead);
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    );
  }
}

