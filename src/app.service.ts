import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { UserService } from './users/user.service';
import { Injectable } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}