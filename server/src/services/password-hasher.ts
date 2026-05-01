import { pbkdf2Sync, randomBytes, timingSafeEqual } from 'crypto';

const iterations = 120000;
const keyLength = 64;
const digest = 'sha512';

export class PasswordHasher {
  hash(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const hash = pbkdf2Sync(password, salt, iterations, keyLength, digest).toString('hex');

    return `${iterations}:${salt}:${hash}`;
  }

  verify(password: string, storedHash: string): boolean {
    const [storedIterations, salt, originalHash] = storedHash.split(':');

    if (!storedIterations || !salt || !originalHash) {
      return false;
    }

    const calculatedHash = pbkdf2Sync(
      password,
      salt,
      Number(storedIterations),
      keyLength,
      digest,
    );
    const originalHashBuffer = Buffer.from(originalHash, 'hex');

    return originalHashBuffer.length === calculatedHash.length && timingSafeEqual(originalHashBuffer, calculatedHash);
  }
}
