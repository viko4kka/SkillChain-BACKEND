import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../users/user.module';
import { LinkedinService } from './linkedin.service';
import { HttpModule } from '@nestjs/axios';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    HttpModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LinkedinService, AuthGuard],
})
export class AuthModule {}
