import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ProjectsModule } from './projects/projects.module';
import { PrismaModule } from 'prisma/prisma.module';
import { UserModule } from './users/user.module';
import { LanguageModule } from './languages/language.module';

@Module({
  imports: [UserModule, ProjectsModule, LanguageModule, PrismaModule], // Dodaj UserModule do imports

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
