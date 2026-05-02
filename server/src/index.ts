import { createApp } from './app';
import { connectToDatabase } from './config/database';
import { env } from './config/env';
import { MongoAuthRepository } from './repositories/auth.repository';
import { MongoClinicRepository } from './repositories/clinic.repository';

async function startServer() {
  const databaseConnected = await connectToDatabase();
  
  if (!databaseConnected) {
    throw new Error('Falha ao conectar ao MongoDB. Verifique MONGODB_URI no .env');
  }

  const clinicRepository = new MongoClinicRepository();
  const authRepository = new MongoAuthRepository();

  const { app, authService } = createApp(clinicRepository, authRepository);
  await authService.ensureDefaultUser();
  await clinicRepository.ensureDefaultBreeds();

  app.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`);
  });
}

startServer().catch((error) => {
  console.error('Falha ao iniciar servidor', error);
  process.exit(1);
});
