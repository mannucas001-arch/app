"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoAuthRepository = exports.MemoryAuthRepository = void 0;
exports.toPublicUser = toPublicUser;
const crypto_1 = require("crypto");
const clinic_models_1 = require("../models/clinic.models");
const defaultUser = {
    id: 'u-default-teste',
    name: 'teste',
    email: 'teste@teste.com',
    role: 'admin',
};
class MemoryAuthRepository {
    users = [];
    sessions = [];
    async findUserByEmail(email) {
        return this.users.find((user) => user.email === normalizeEmail(email)) || null;
    }
    async findUserById(id) {
        return this.users.find((user) => user.id === id) || null;
    }
    async createSession(userId, expiresAt) {
        const token = (0, crypto_1.randomBytes)(32).toString('hex');
        const session = {
            id: `sess-${Date.now()}`,
            userId,
            tokenHash: hashToken(token),
            expiresAt,
        };
        this.sessions.push(session);
        return { token, session };
    }
    async findSessionByToken(token) {
        const tokenHash = hashToken(token);
        const now = new Date();
        return this.sessions.find((session) => session.tokenHash === tokenHash && session.expiresAt > now) || null;
    }
    async deleteSessionByToken(token) {
        const tokenHash = hashToken(token);
        this.sessions = this.sessions.filter((session) => session.tokenHash !== tokenHash);
    }
    async ensureDefaultUser(passwordHash) {
        const existingUser = await this.findUserByEmail(defaultUser.email);
        if (!existingUser) {
            this.users.push({ ...defaultUser, passwordHash });
            return;
        }
        Object.assign(existingUser, defaultUser, { passwordHash });
    }
}
exports.MemoryAuthRepository = MemoryAuthRepository;
class MongoAuthRepository {
    async findUserByEmail(email) {
        return clinic_models_1.UserModel.findOne({ email: normalizeEmail(email) }).lean();
    }
    async findUserById(id) {
        return clinic_models_1.UserModel.findOne({ id }).lean();
    }
    async createSession(userId, expiresAt) {
        const token = (0, crypto_1.randomBytes)(32).toString('hex');
        const session = await clinic_models_1.SessionModel.create({
            id: `sess-${Date.now()}`,
            userId,
            tokenHash: hashToken(token),
            expiresAt,
        });
        return { token, session: session.toObject() };
    }
    async findSessionByToken(token) {
        return clinic_models_1.SessionModel.findOne({
            tokenHash: hashToken(token),
            expiresAt: { $gt: new Date() },
        }).lean();
    }
    async deleteSessionByToken(token) {
        await clinic_models_1.SessionModel.deleteOne({ tokenHash: hashToken(token) });
    }
    async ensureDefaultUser(passwordHash) {
        await clinic_models_1.UserModel.updateOne({ email: normalizeEmail(defaultUser.email) }, {
            $set: {
                id: defaultUser.id,
                name: defaultUser.name,
                role: defaultUser.role,
                passwordHash,
            },
            $setOnInsert: {
                email: normalizeEmail(defaultUser.email),
            },
        }, { upsert: true });
    }
}
exports.MongoAuthRepository = MongoAuthRepository;
function toPublicUser(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
}
function normalizeEmail(email) {
    return email.trim().toLowerCase();
}
function hashToken(token) {
    return (0, crypto_1.createHash)('sha256').update(token).digest('hex');
}
