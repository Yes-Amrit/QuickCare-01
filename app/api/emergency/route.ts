import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../lib/cdb';
import { Emergency } from '../../models/emergency';

export async function POST(request: NextRequest) {
  console.log('📥 Received emergency request');
  
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to test database, Emergency collection');

    // Parse request body
    const data = await request.json();
    console.log('📦 Request data:', data);

    // Create emergency document
    const emergency = new Emergency({
      name: data.name,
      phone: data.phone,
      address: data.address,
      reason: data.reason,
      status: 'pending'
    });

    // Save to Emergency collection
    const savedEmergency = await emergency.save();
    console.log('✅ Emergency saved to collection with ID:', savedEmergency._id);

    return NextResponse.json({
      success: true,
      message: 'Emergency request saved to Emergency collection',
      requestId: savedEmergency._id
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Error saving to Emergency collection:', error);
    return NextResponse.json({
      error: 'Failed to save emergency request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}