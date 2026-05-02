import type { AuthSession, LoginInput, PublicUser } from '../domain/entities';
import type { AuthRepository } from '../repositories/auth.repository';
import { toPublicUser } from '../repositories/auth.repository';
import { PasswordHasher } from './password-hasher';

export class AuthError extends Error {
  statusCode = 401;
}

export class AuthService {
  constructor(
    private readonly repository: AuthRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async ensureDefaultUser() {
    await this.repository.ensureDefaultUser(this.passwordHasher.hash('teste'));
  }

  async login(input: LoginInput): Promise<AuthSession> {
    const user = await this.repository.findUserByEmail(input.email);

    if (!user?.passwordHash || !this.passwordHasher.verify(input.password, user.passwordHash)) {
      throw new AuthError('Credenciais invalidas');
    }

    const expiresAt = new Date(Date.now() + (input.remember ? 30 : 1) * 24 * 60 * 60 * 1000);
    const session = await this.repository.createSession(user.id, expiresAt);

    return {
      token: session.token,
      expiresAt,
      user: toPublicUser(user),
    };
  }

  async getUserByToken(token: string): Promise<PublicUser | null> {
    const session = await this.repository.findSessionByToken(token);

    if (!session) {
      return null;
    }

    const user = await this.repository.findUserById(session.userId);

    return user ? toPublicUser(user) : null;
  }

  async logout(token: string) {
    await this.repository.deleteSessionByToken(token);
  }
}
