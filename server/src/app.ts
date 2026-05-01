import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import { env } from './config/env';
import { AuthController } from './controllers/auth.controller';
import { ClinicController } from './controllers/clinic.controller';
import { createAuthMiddleware } from './middlewares/auth.middleware';
import type { AuthRepository } from './repositories/auth.repository';
import type { ClinicRepository } from './repositories/clinic.repository';
import { createAuthRouter } from './routes/auth.routes';
import { createClinicRouter } from './routes/clinic.routes';
import { AuthError, AuthService } from './services/auth.service';
import { ClinicService, ClinicValidationError } from './services/clinic.service';
import { PasswordHasher } from './services/password-hasher';

export function createApp(clinicRepository: ClinicRepository, authRepository: AuthRepository) {
  const app = express();
  const passwordHasher = new PasswordHasher();
  const authService = new AuthService(authRepository, passwordHasher);
  const authController = new AuthController(authService);
  const clinicService = new ClinicService(clinicRepository);
  const clinicController = new ClinicController(clinicService);

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || isAllowedOrigin(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error('Origem bloqueada pelo CORS'));
      },
    }),
  );
  app.use(express.json());
  app.use('/api/auth', createAuthRouter(authController));
  app.use('/api', createAuthMiddleware(authService), createClinicRouter(clinicController));
  app.use(handleError);

  return { app, authService };
}

function isAllowedOrigin(origin: string) {
  const allowedOrigins = new Set([env.clientUrl]);
  const localDevOrigin = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/;

  return allowedOrigins.has(origin) || localDevOrigin.test(origin);
}

function handleError(error: Error, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof AuthError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  if (error instanceof ClinicValidationError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  console.error(error);
  res.status(500).json({
    message: 'Erro interno no servidor',
  });
}
