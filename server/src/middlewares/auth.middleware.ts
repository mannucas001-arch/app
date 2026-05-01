import type { NextFunction, Request, Response } from 'express';
import type { AuthService } from '../services/auth.service';

export function createAuthMiddleware(authService: AuthService) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;
    const token = authorization?.startsWith('Bearer ') ? authorization.slice('Bearer '.length) : null;

    if (!token) {
      res.status(401).json({ message: 'Autenticacao obrigatoria' });
      return;
    }

    const user = await authService.getUserByToken(token);

    if (!user) {
      res.status(401).json({ message: 'Sessao expirada' });
      return;
    }

    (req as Request & { user?: { id: string } }).user = user;
    next();
  };
}
