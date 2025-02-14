// app/api/test-db/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '../../lib/cdb';
import { Emergency } from '../../models/emergency';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectDB();
    
    // List all collections in the database
    const collections = mongoose.connection.db ? await mongoose.connection.db.listCollections().toArray() : [];
    
    // Count documents in Emergency collection
    const count = await Emergency.countDocuments();
    
    return NextResponse.json({
      success: true,
      database: mongoose.connection.db ? mongoose.connection.db.databaseName : 'unknown',
      collections: collections.map(col => col.name),
      emergencyCount: count
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}