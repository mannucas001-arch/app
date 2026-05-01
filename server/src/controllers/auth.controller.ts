import type { NextFunction, Request, Response } from 'express';
import type { AuthService } from '../services/auth.service';

export class AuthController {
  constructor(private readonly service: AuthService) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await this.service.login(req.body));
    } catch (error) {
      next(error);
    }
  };

  me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = getBearerToken(req);

      if (!token) {
        res.status(401).json({ message: 'Sessao nao encontrada' });
        return;
      }

      const user = await this.service.getUserByToken(token);

      if (!user) {
        res.status(401).json({ message: 'Sessao expirada' });
        return;
      }

      res.json({ user });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = getBearerToken(req);

      if (token) {
        await this.service.logout(token);
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

function getBearerToken(req: Request) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith('Bearer ')) {
    return null;
  }

  return authorization.slice('Bearer '.length);
}
