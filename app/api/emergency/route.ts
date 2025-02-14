// app/api/emergency/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface EmergencyRequest {
  name: string;
  phone: string;
  address: string;
  reason: string;
  location?: {
    coordinates: {
      latitude: number;
      longitude: number;
      accuracy: number;
    };
    addressDetails: any;
  };
}

export async function POST(request: NextRequest) {
  try {
    const data: EmergencyRequest = await request.json();

    // Validate the required fields
    if (!data.name || !data.phone || !data.address || !data.reason) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Save to database
    // 2. Notify emergency services
    // 3. Send notifications to admins
    // 4. Log the request

    console.log('Emergency request received:', data);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      message: 'Emergency request received successfully',
      requestId: `EMG-${Date.now()}`,
      status: 'processing'
    });

  } catch (error) {
    console.error('Emergency request error:', error);
    return NextResponse.json(
      { error: 'Failed to process emergency request' },
      { status: 500 }
    );
  }
}