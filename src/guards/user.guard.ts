import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AppService } from '../app.service';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private readonly appService: AppService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<any>();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('인증 토큰이 존재하지 않습니다.');
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader.replace('Bearer ', '');

    // For now, set userId from token (in production, verify JWT)
    // This is a simplified version - in production, decode and verify the JWT
    request.user = {
      userId: token, // Use token as userId for testing
    };

    return true;
  }
}
