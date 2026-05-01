"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const env_1 = require("./config/env");
const auth_controller_1 = require("./controllers/auth.controller");
const clinic_controller_1 = require("./controllers/clinic.controller");
const auth_middleware_1 = require("./middlewares/auth.middleware");
const auth_routes_1 = require("./routes/auth.routes");
const clinic_routes_1 = require("./routes/clinic.routes");
const auth_service_1 = require("./services/auth.service");
const clinic_service_1 = require("./services/clinic.service");
const password_hasher_1 = require("./services/password-hasher");
function createApp(clinicRepository, authRepository) {
    const app = (0, express_1.default)();
    const passwordHasher = new password_hasher_1.PasswordHasher();
    const authService = new auth_service_1.AuthService(authRepository, passwordHasher);
    const authController = new auth_controller_1.AuthController(authService);
    const clinicService = new clinic_service_1.ClinicService(clinicRepository);
    const clinicController = new clinic_controller_1.ClinicController(clinicService);
    app.use((0, cors_1.default)({
        origin(origin, callback) {
            if (!origin || isAllowedOrigin(origin)) {
                callback(null, true);
                return;
            }
            callback(new Error('Origem bloqueada pelo CORS'));
        },
    }));
    app.use(express_1.default.json());
    app.use('/api/auth', (0, auth_routes_1.createAuthRouter)(authController));
    app.use('/api', (0, auth_middleware_1.createAuthMiddleware)(authService), (0, clinic_routes_1.createClinicRouter)(clinicController));
    app.use(handleError);
    return { app, authService };
}
function isAllowedOrigin(origin) {
    const allowedOrigins = new Set([env_1.env.clientUrl]);
    const localDevOrigin = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/;
    return allowedOrigins.has(origin) || localDevOrigin.test(origin);
}
function handleError(error, _req, res, _next) {
    if (error instanceof auth_service_1.AuthError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
    }
    if (error instanceof clinic_service_1.ClinicValidationError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
    }
    console.error(error);
    res.status(500).json({
        message: 'Erro interno no servidor',
    });
}
