import { CallHandler, ExecutionContext, Injectable, NestInterceptor, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable()
export class UserDecodeInterceptor implements NestInterceptor {
  constructor(private authService: AuthService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const { accessToken } = request.cookies;

    if (!accessToken) {
      return next.handle();
    }

    try {
      const payload = await this.authService.verifyToken({ token: accessToken });

      request.user = payload;
    } catch (err) {
      this.clearCookiesAndThrowUnauthorizedException(response);
    }

    return next.handle();
  }

  private clearCookiesAndThrowUnauthorizedException(response: Response): never {
    response.clearCookie('accessToken');

    throw new UnauthorizedException();
  }
}
