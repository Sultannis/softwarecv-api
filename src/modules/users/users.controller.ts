import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserGuard } from '../auth/guards/user.guard';
import { Request } from 'express';

@UseGuards(UserGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get(':userId')
  async findOne(@Param('userId') userId: string) {
    return {
      user: await this.usersService.findOneById(userId),
    };
  }

  @Patch(':userId')
  async update(@Req() req: Request, @Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto) {
    if(userId !== req.user?.id) {
      throw new ForbiddenException({ message: 'You are not allowed to update this user', code: 'FORBIDDEN' });
    }

    return {
      user: await this.usersService.update(userId, updateUserDto),
    };
  }

  @Delete(':userId')
  async delete(@Req() req: Request, @Param('userId') userId: string) {
    if(userId !== req.user?.id) {
      throw new ForbiddenException({ message: 'You are not allowed to delete this user', code: 'FORBIDDEN' });
    }

    return {
      user: await this.usersService.softDelete(userId),
    };
  }
}
