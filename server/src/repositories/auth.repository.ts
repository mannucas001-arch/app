import { randomBytes, createHash } from 'crypto';
import type { PublicUser, Session, User } from '../domain/entities';
import { SessionModel, UserModel } from '../models/clinic.models';

export interface AuthRepository {
  findUserByEmail(email: string): Promise<User | null>;
  findUserById(id: string): Promise<User | null>;
  createSession(userId: string, expiresAt: Date): Promise<{ token: string; session: Session }>;
  findSessionByToken(token: string): Promise<Session | null>;
  deleteSessionByToken(token: string): Promise<void>;
  seedDefaultAdmin(passwordHash: string): Promise<void>;
}

const defaultAdmin: PublicUser = {
  id: 'u-admin-default',
  name: 'Administrador',
  email: 'teste@teste.com',
  role: 'admin',
};

export class MemoryAuthRepository implements AuthRepository {
  private users: User[] = [{ ...defaultAdmin, passwordHash: '' }];
  private sessions: Session[] = [];

  constructor(private readonly defaultPasswordHash: string) {
    this.users[0].passwordHash = defaultPasswordHash;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === normalizeEmail(email)) || null;
  }

  async findUserById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null;
  }

  async createSession(userId: string, expiresAt: Date): Promise<{ token: string; session: Session }> {
    const token = randomBytes(32).toString('hex');
    const session = {
      id: `sess-${Date.now()}`,
      userId,
      tokenHash: hashToken(token),
      expiresAt,
    };

    this.sessions.push(session);
    return { token, session };
  }

  async findSessionByToken(token: string): Promise<Session | null> {
    const tokenHash = hashToken(token);
    const now = new Date();
    return this.sessions.find((session) => session.tokenHash === tokenHash && session.expiresAt > now) || null;
  }

  async deleteSessionByToken(token: string): Promise<void> {
    const tokenHash = hashToken(token);
    this.sessions = this.sessions.filter((session) => session.tokenHash !== tokenHash);
  }

  async seedDefaultAdmin(passwordHash: string): Promise<void> {
    const existingUser = await this.findUserByEmail(defaultAdmin.email);

    if (!existingUser) {
      this.users.push({ ...defaultAdmin, passwordHash });
      return;
    }

    existingUser.passwordHash = existingUser.passwordHash || passwordHash;
  }
}

export class MongoAuthRepository implements AuthRepository {
  async findUserByEmail(email: string): Promise<User | null> {
    return UserModel.findOne({ email: normalizeEmail(email) }).lean<User>();
  }

  async findUserById(id: string): Promise<User | null> {
    return UserModel.findOne({ id }).lean<User>();
  }

  async createSession(userId: string, expiresAt: Date): Promise<{ token: string; session: Session }> {
    const token = randomBytes(32).toString('hex');
    const session = await SessionModel.create({
      id: `sess-${Date.now()}`,
      userId,
      tokenHash: hashToken(token),
      expiresAt,
    });

    return { token, session: session.toObject() as Session };
  }

  async findSessionByToken(token: string): Promise<Session | null> {
    return SessionModel.findOne({
      tokenHash: hashToken(token),
      expiresAt: { $gt: new Date() },
    }).lean<Session>();
  }

  async deleteSessionByToken(token: string): Promise<void> {
    await SessionModel.deleteOne({ tokenHash: hashToken(token) });
  }

  async seedDefaultAdmin(passwordHash: string): Promise<void> {
    await UserModel.updateOne(
      { email: defaultAdmin.email },
      {
        $set: {
          id: defaultAdmin.id,
          name: defaultAdmin.name,
          role: defaultAdmin.role,
          passwordHash,
        },
        $setOnInsert: {
          email: defaultAdmin.email,
        },
      },
      { upsert: true },
    );
  }
}

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}
