"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordHasher = void 0;
const crypto_1 = require("crypto");
const iterations = 120000;
const keyLength = 64;
const digest = 'sha512';
class PasswordHasher {
    hash(password) {
        const salt = (0, crypto_1.randomBytes)(16).toString('hex');
        const hash = (0, crypto_1.pbkdf2Sync)(password, salt, iterations, keyLength, digest).toString('hex');
        return `${iterations}:${salt}:${hash}`;
    }
    verify(password, storedHash) {
        const [storedIterations, salt, originalHash] = storedHash.split(':');
        if (!storedIterations || !salt || !originalHash) {
            return false;
        }
        const calculatedHash = (0, crypto_1.pbkdf2Sync)(password, salt, Number(storedIterations), keyLength, digest);
        const originalHashBuffer = Buffer.from(originalHash, 'hex');
        return originalHashBuffer.length === calculatedHash.length && (0, crypto_1.timingSafeEqual)(originalHashBuffer, calculatedHash);
    }
}
exports.PasswordHasher = PasswordHasher;
