import mongoose from 'mongoose';

const DEFAULT_MONGODB_URI = 'mongodb://127.0.0.1:27017/papertrail';

export function getDatabaseUri() {
  return process.env.MONGODB_URI || DEFAULT_MONGODB_URI;
}

export async function connectDatabase() {
  const uri = getDatabaseUri();
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });
  console.log('MongoDB connected');
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
}
