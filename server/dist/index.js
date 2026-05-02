"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const database_1 = require("./config/database");
const env_1 = require("./config/env");
const auth_repository_1 = require("./repositories/auth.repository");
const clinic_repository_1 = require("./repositories/clinic.repository");
async function startServer() {
    const databaseConnected = await (0, database_1.connectToDatabase)();
    if (!databaseConnected) {
        throw new Error('Falha ao conectar ao MongoDB. Verifique MONGODB_URI no .env');
    }
    const clinicRepository = new clinic_repository_1.MongoClinicRepository();
    const authRepository = new auth_repository_1.MongoAuthRepository();
    const { app, authService } = (0, app_1.createApp)(clinicRepository, authRepository);
    await authService.ensureDefaultUser();
    await clinicRepository.ensureDefaultBreeds();
    app.listen(env_1.env.port, () => {
        console.log(`Server is running on port ${env_1.env.port}`);
    });
}
startServer().catch((error) => {
    console.error('Falha ao iniciar servidor', error);
    process.exit(1);
});
