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
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers['authorization'];

    if (!token) {
      throw new UnauthorizedException('인증 토큰이 존재하지 않습니다.');
    }

    return true;
  }
}
