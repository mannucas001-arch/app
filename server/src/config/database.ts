import mongoose from 'mongoose';
import { env } from './env';

export async function connectToDatabase(): Promise<boolean> {
  if (!env.mongoUri) {
    console.error('❌ MONGODB_URI nao configurada. Configure a variavel de ambiente no arquivo .env');
    return false;
  }

  try {
    await mongoose.connect(env.mongoUri);
    console.log('✅ MongoDB conectado.');
    return true;
  } catch (error) {
    console.error('❌ Falha ao conectar ao MongoDB:', error);
    return false;
  }
}
