import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserService } from './users/user.service';
import { Injectable } from '@nestjs/common';

@Module({
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UsersModule {}

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}