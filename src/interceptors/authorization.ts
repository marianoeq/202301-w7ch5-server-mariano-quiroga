import { NextFunction, Request, Response } from 'express';
import { Auth, PayloadToken } from '../helpers/auth.js';

export interface RequestPlus extends Request {
  dataPlus?: PayloadToken;
}

export async function authorization(
  req: RequestPlus,
  _res: Response,
  next: NextFunction
) {
  try {
    const authHeader = await req.get('Authorization');
    if (!authHeader) throw new Error('Invalid Token');
    if (!authHeader.startsWith('Bearer')) throw new Error('Invalid Token');
    const token = authHeader.slice(7);
    const payload = Auth.verifyJWT(token);
    req.dataPlus = payload;
    next();
  } catch (error) {
    next(error);
  }
}
