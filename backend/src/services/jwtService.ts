import 'dotenv/config';
import * as jwt from 'jsonwebtoken';
import IUserJwt from '../interfaces/IUserJwt';

const secret = process.env.JWT_SECRET;
    
const jwtConfig = {
  expiresIn: '24h',
  algorithm: 'HS256',
};
class JwtService {
  static createToken(data: IUserJwt): string {
    const token = jwt.sign({ data }, secret as string, jwtConfig as object);
    return token;
  }

  static validateToken = (token: string) => {
    try {
      const { data } = jwt.verify(token, secret as string) as jwt.JwtPayload;
      return data;
    } catch (error) {
      const err = new Error('Token must be a valid token');
      err.name = 'UnauthorizedError';
      throw err;
    }
  };
}

export default JwtService;
