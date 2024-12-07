declare namespace Express {
    export interface Request {
      user?: AuthDto;
      token?: string;
    }
  }