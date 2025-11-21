import { NextRequest, NextResponse } from 'next/server';
import { getVisits, addVisit, updateVisitStatus } from '@/lib/data-loader';

export async function GET() {
  const visits = getVisits();
  return NextResponse.json(visits);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const visit = addVisit(body);
    return NextResponse.json(visit, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to schedule visit' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, notes } = body;
    const visit = updateVisitStatus(id, status, notes);
    
    if (!visit) {
      return NextResponse.json({ error: 'Visit not found' }, { status: 404 });
    }
    
    return NextResponse.json(visit);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update visit' },
      { status: 500 }
    );
  }
}

