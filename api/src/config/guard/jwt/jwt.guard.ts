import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { TO_PUBLIC } from 'src/config/public.decorator';

@Injectable()
export class JWTGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const toPublic = this.reflector.getAllAndOverride<boolean>(TO_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (toPublic) {
      return true;
    }

    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('INVALID_TOKEN');
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('jwt.secret'),
      });
      req.user = payload;
      req.token = token;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('TOKEN_EXPIRED');
    }

    return true;
  }
}
