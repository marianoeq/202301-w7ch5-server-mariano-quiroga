// Metodos static permite acceder al metodo sin tener que instanciar la clase. Directamente llamando a la clase y luego el metodo. ex: Auth.createJWT()
import JWT from 'jsonwebtoken';
import { config } from '../config.js';
import bcrypt from 'bcryptjs';

export interface PayloadToken extends JWT.JwtPayload {
  id: string;
  email: string;
}

const salt = 10;

export class Auth {
  static createJWT(payload: PayloadToken) {
    return JWT.sign(payload, config.jwtSecret as string);
  }

  static verifyJWT(token: string): PayloadToken {
    const result = JWT.verify(token, config.jwtSecret as string);
    if (typeof result === 'string') throw new Error('Invalid Payload');
    return result as PayloadToken;
  }

  static createHash(value: string) {
    return bcrypt.hash(value, salt);
  }

  static compare(value: string, hash: string) {
    return bcrypt.compare(value, hash);
  }
}
