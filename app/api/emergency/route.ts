import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../lib/cdb';
import { Emergency } from '../../models/emergency';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    // Validate content type
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json({
        error: 'Invalid content type',
        details: 'Expected application/json'
      }, { status: 415 });
    }

    // Safely parse request body
    let data;
    try {
      const text = await request.text();
      if (!text) {
        return NextResponse.json({
          error: 'Empty request body',
          details: 'Request body cannot be empty'
        }, { status: 400 });
      }
      data = JSON.parse(text);
    } catch (parseError) {
      return NextResponse.json({
        error: 'Invalid JSON',
        details: parseError instanceof Error ? parseError.message : 'Failed to parse request body'
      }, { status: 400 });
    }

    // Connect to database
    await connectDB();

    // Create and validate emergency document
    const emergency = new Emergency({
      name: data.name?.trim(),
      phone: data.phone?.trim(),
      address: data.address?.trim(),
      reason: data.reason?.trim(),
    });

    // Validate required fields
    const validationError = emergency.validateSync();
    if (validationError) {
      return NextResponse.json({
        error: 'Validation failed',
        details: Object.values(validationError.errors).map(err => err.message)
      }, { status: 400 });
    }

    // Save to database
    const result = await emergency.save();
    console.log('✅ Emergency Request Saved:', result._id);

    return NextResponse.json({
      message: 'Emergency request received',
      requestId: result._id,
      status: result.status
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Emergency Request Error:', error);
    
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json({
        error: 'Validation failed',
        details: Object.values(error.errors).map(err => err.message)
      }, { status: 400 });
    }

    return NextResponse.json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : 'An unexpected error occurred'
    }, { status: 500 });
  }
}