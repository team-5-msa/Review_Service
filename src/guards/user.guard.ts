import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

declare module 'express' {
  interface Request {
    user?: { userId: string };
  }
}

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    // Get userId from x-user-id header (added by API Gateway/프록시)
    // 프록시가 JWT를 검증하고 userId를 추가하므로 신뢰할 수 있음
    const userIdFromHeader = request.headers['x-user-id'];

    if (!userIdFromHeader) {
      throw new UnauthorizedException(
        '인증이 필요합니다. x-user-id 헤더를 제공하세요.',
      );
    }

    const userId = String(userIdFromHeader).trim();

    if (!userId) {
      throw new UnauthorizedException('유효한 userId가 필요합니다.');
    }

    request.user = {
      userId,
    };

    return true;
  }
}
