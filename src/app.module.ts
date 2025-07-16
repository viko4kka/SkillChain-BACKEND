import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { HttpModule } from '@nestjs/axios';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { ProjectsModule } from './projects/projects.module';
import { LanguageModule } from './languages/language.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    ProjectsModule,
    LanguageModule,
    PrismaModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
