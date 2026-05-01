import { Router } from 'express';
import type { AuthController } from '../controllers/auth.controller';

export function createAuthRouter(controller: AuthController) {
  const router = Router();

  router.post('/login', controller.login);
  router.get('/me', controller.me);
  router.post('/logout', controller.logout);

  return router;
}
