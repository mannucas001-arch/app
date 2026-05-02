"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = exports.AuthError = void 0;
const auth_repository_1 = require("../repositories/auth.repository");
class AuthError extends Error {
    statusCode = 401;
}
exports.AuthError = AuthError;
class AuthService {
    repository;
    passwordHasher;
    constructor(repository, passwordHasher) {
        this.repository = repository;
        this.passwordHasher = passwordHasher;
    }
    async ensureDefaultUser() {
        await this.repository.ensureDefaultUser(this.passwordHasher.hash('teste'));
    }
    async login(input) {
        const user = await this.repository.findUserByEmail(input.email);
        if (!user?.passwordHash || !this.passwordHasher.verify(input.password, user.passwordHash)) {
            throw new AuthError('Credenciais invalidas');
        }
        const expiresAt = new Date(Date.now() + (input.remember ? 30 : 1) * 24 * 60 * 60 * 1000);
        const session = await this.repository.createSession(user.id, expiresAt);
        return {
            token: session.token,
            expiresAt,
            user: (0, auth_repository_1.toPublicUser)(user),
        };
    }
    async getUserByToken(token) {
        const session = await this.repository.findSessionByToken(token);
        if (!session) {
            return null;
        }
        const user = await this.repository.findUserById(session.userId);
        return user ? (0, auth_repository_1.toPublicUser)(user) : null;
    }
    async logout(token) {
        await this.repository.deleteSessionByToken(token);
    }
}
exports.AuthService = AuthService;
