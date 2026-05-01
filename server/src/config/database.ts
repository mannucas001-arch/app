import mongoose from 'mongoose';
import { env } from './env';

export async function connectToDatabase(): Promise<boolean> {
  if (!env.mongoUri) {
    console.warn('MONGODB_URI nao configurada. API usando seed em memoria.');
    return false;
  }

  await mongoose.connect(env.mongoUri);
  console.log('MongoDB conectado.');
  return true;
}
