import { NextRequest, NextResponse } from 'next/server';
import {
  getProperties,
  getPropertyById,
  addProperty,
  updateProperty,
  deleteProperty,
} from '@/lib/data-loader';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (id) {
    const property = getPropertyById(id);
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    return NextResponse.json(property);
  }

  const properties = getProperties();
  return NextResponse.json(properties);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const property = addProperty(body);
    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    const property = updateProperty(id, updates);
    
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    
    return NextResponse.json(property);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Property ID required' }, { status: 400 });
    }
    
    const deleted = deleteProperty(id);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    );
  }
}

