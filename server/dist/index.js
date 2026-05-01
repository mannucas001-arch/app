"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const database_1 = require("./config/database");
const env_1 = require("./config/env");
const auth_repository_1 = require("./repositories/auth.repository");
const clinic_repository_1 = require("./repositories/clinic.repository");
const password_hasher_1 = require("./services/password-hasher");
async function startServer() {
    const databaseConnected = await (0, database_1.connectToDatabase)();
    const clinicRepository = databaseConnected ? new clinic_repository_1.MongoClinicRepository() : new clinic_repository_1.MemoryClinicRepository();
    const authRepository = databaseConnected
        ? new auth_repository_1.MongoAuthRepository()
        : new auth_repository_1.MemoryAuthRepository(new password_hasher_1.PasswordHasher().hash('teste'));
    if (clinicRepository instanceof clinic_repository_1.MongoClinicRepository) {
        await clinicRepository.seedIfEmpty();
    }
    const { app, authService } = (0, app_1.createApp)(clinicRepository, authRepository);
    await authService.seedDefaultAdmin();
    app.listen(env_1.env.port, () => {
        console.log(`Server is running on port ${env_1.env.port}`);
    });
}
startServer().catch((error) => {
    console.error('Falha ao iniciar servidor', error);
    process.exit(1);
});
