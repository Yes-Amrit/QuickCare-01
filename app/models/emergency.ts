import mongoose from 'mongoose';

const emergencySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
  },
  reason: {
    type: String,
    required: [true, 'Emergency reason is required'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed'],
    default: 'pending',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
}, {
  // Specify the collection name explicitly
  collection: 'Emergency'
});

// Clear existing models to prevent OverwriteModelError
if (mongoose.modelNames().includes('Emergency')) {
  mongoose.deleteModel('Emergency');
}

// Create the model with explicit database and collection names
export const Emergency = mongoose.model('Emergency', emergencySchema);