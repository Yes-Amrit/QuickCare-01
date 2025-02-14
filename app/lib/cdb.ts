import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://quickcare:quickcare@cluster0.qpo69.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';

export async function connectDB() {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log('Using existing MongoDB connection');
      return;
    }

    // Explicitly specify the database name
    await mongoose.connect(MONGODB_URI, {
      dbName: 'test' // This specifies the database name
    });
    
    console.log('✅ Connected to MongoDB database: test');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    throw error;
  }
}