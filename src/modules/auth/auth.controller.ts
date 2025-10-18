import { Controller, HttpStatus, HttpCode, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDto } from './dto/log-in.dto';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login/user')
  async loginUser(@Res({ passthrough: true }) res: Response, @Body() logInDto: LogInDto) {
    const { accessToken, user } = await this.authService.loginUser(logInDto.email, logInDto.password);

    res.cookie('accessToken', accessToken, {
      httpOnly: process.env.NODE_ENV === 'production' ? true : false,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 12 * 365,
    });

    return {
      user,
    };
  }

  @Post('register/user')
  async registerUser(@Res({ passthrough: true }) res: Response, @Body() registerDto: RegisterDto) {
    const { accessToken, user } = await this.authService.registerUser(registerDto.email, registerDto.password);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 12 * 365,
    });

    return {
      user,
    };
  }
}
