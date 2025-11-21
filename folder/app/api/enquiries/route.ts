import { NextRequest, NextResponse } from 'next/server';
import { getEnquiries, addEnquiry, updateEnquiryStatus } from '@/lib/data-loader';

export async function GET() {
  const enquiries = getEnquiries();
  return NextResponse.json(enquiries);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const enquiry = addEnquiry(body);
    
    // Trigger AI Lead Qualification instantly (0-30 seconds)
    // This simulates the AI calling the lead immediately
    try {
      // In production, this would be a background job or webhook
      // For now, we'll trigger it asynchronously
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/lead-qualification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enquiryId: enquiry.id,
          name: enquiry.name,
          email: enquiry.email,
          phone: enquiry.phone,
          propertyId: enquiry.propertyId,
          propertyTitle: enquiry.propertyTitle,
        }),
      }).catch((err) => {
        console.error('Error triggering lead qualification:', err);
        // Don't fail the enquiry submission if qualification fails
      });
    } catch (error) {
      console.error('Error triggering lead qualification:', error);
    }
    
    return NextResponse.json(enquiry, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to submit enquiry' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, comment } = body;
    const enquiry = updateEnquiryStatus(id, status, comment);
    
    if (!enquiry) {
      return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
    }
    
    return NextResponse.json(enquiry);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update enquiry' },
      { status: 500 }
    );
  }
}

