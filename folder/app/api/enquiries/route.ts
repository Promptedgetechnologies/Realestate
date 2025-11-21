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

