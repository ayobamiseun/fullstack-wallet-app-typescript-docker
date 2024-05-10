import { Request, Response, NextFunction } from 'express';
import JwtService from '../services/jwtService';
import IUserJwt from '../interfaces/IUserJwt';

const stripBearer = (header: string): string =>
  header.replace(/^Bearer\s+/i, '').trim();

const authMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;
  if (!header) throw Error('UnauthorizedError');

  const token = stripBearer(header);
  const data = JwtService.validateToken(token) as IUserJwt;

  req.user = data;
  next();
};

export default authMiddleware;
