import mongoose from 'mongoose';

export default async function connectDB() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not configured');
  }
  
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,  // 30 seconds
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
    });
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
}