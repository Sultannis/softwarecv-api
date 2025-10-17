import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RequestUser } from './entities/request-user.entity';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private jwtConfig;

  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {
    this.jwtConfig = this.configService.get('jwt');
  }

  async loginUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException({ message: 'User not found', code: 'USER_NOT_FOUND' });
    }

    const isPasswordValid = await this.comparePassword(password, user.password!);
    if (!isPasswordValid) {
      throw new UnauthorizedException({ message: 'Wrong password', code: 'WRONG_PASSWORD' });
    }

    delete user.password;

    const accessToken = await this.generateAccessToken({ id: user.id });

    return {
      accessToken,
      user,
    };
  }

  async registerUser(email: string, password: string) {
    let user = await this.usersService.findByEmail(email, true);
    if (user) {
      throw new ConflictException('User already exists');
    }

    const passwordHash = await this.hashPassword(password);

    user = await this.usersService.create({ email, password: passwordHash });

    delete user.password;

    const accessToken = await this.generateAccessToken({ id: user.id });

    return {
      accessToken,
      user,
    };
  }

  generateAccessToken(payload: RequestUser) {
    return this.jwtService.signAsync(payload, {
      secret: this.jwtConfig.secret,
      expiresIn: this.jwtConfig.accessTokenExpirationTime,
    });
  }

  verifyToken({ token, ignoreExpiration = false }) {
    return this.jwtService.verifyAsync(token, { secret: this.jwtConfig.secret, ignoreExpiration });
  }

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  comparePassword(password: string, storedPasswordHash: string) {
    return bcrypt.compare(password, storedPasswordHash);
  }
}
