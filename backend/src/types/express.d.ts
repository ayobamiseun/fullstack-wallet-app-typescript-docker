import IUserJwt from '../interfaces/IUserJwt';

declare global {
  namespace Express {
    interface Request {
      user?: IUserJwt;
    }
  }
}

export {};
