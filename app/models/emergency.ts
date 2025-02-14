
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Emergency = mongoose.models.Emergency || mongoose.model('Emergency', emergencySchema);