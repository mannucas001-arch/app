import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: process.env.PORT || '3001',
  mongoUri: process.env.MONGODB_URI || '',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};
