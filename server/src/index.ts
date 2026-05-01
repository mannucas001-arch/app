import { createApp } from './app';
import { connectToDatabase } from './config/database';
import { env } from './config/env';
import { MemoryAuthRepository, MongoAuthRepository } from './repositories/auth.repository';
import { MemoryClinicRepository, MongoClinicRepository } from './repositories/clinic.repository';
import { PasswordHasher } from './services/password-hasher';

async function startServer() {
  const databaseConnected = await connectToDatabase();
  const clinicRepository = databaseConnected ? new MongoClinicRepository() : new MemoryClinicRepository();
  const authRepository = databaseConnected
    ? new MongoAuthRepository()
    : new MemoryAuthRepository(new PasswordHasher().hash('teste'));

  if (clinicRepository instanceof MongoClinicRepository) {
    await clinicRepository.seedIfEmpty();
  }

  const { app, authService } = createApp(clinicRepository, authRepository);
  await authService.seedDefaultAdmin();

  app.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`);
  });
}

startServer().catch((error) => {
  console.error('Falha ao iniciar servidor', error);
  process.exit(1);
});
