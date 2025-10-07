import mongoose from 'mongoose';

export async function connectDB(mongoUri) {
  if (!mongoUri) {
    console.error('MONGO_URI is not defined');
    process.exit(1);
  }
  try {
    await mongoose.connect(mongoUri, { 
      serverSelectionTimeoutMS: 10000
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}
