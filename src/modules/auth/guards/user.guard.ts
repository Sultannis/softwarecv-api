import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const { accessToken } = request.cookies;

    if (!accessToken) {
      throw new UnauthorizedException();
    }

    try {
      await this.authService.verifyToken({ token: accessToken });
    } catch (err) {
      this.clearCookiesAndThrowUnauthorizedException(response);
    }

    return true;
  }

  private clearCookiesAndThrowUnauthorizedException(response: Response) {
    response.clearCookie('accessToken');

    throw new UnauthorizedException();
  }
}
