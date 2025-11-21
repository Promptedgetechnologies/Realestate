import { NextResponse } from 'next/server';
import { getQualifiedLeadsStats } from '@/lib/lead-storage';

export async function GET() {
  try {
    const stats = getQualifiedLeadsStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error getting stats:', error);
    return NextResponse.json(
      { error: 'Failed to get statistics' },
      { status: 500 }
    );
  }
}

