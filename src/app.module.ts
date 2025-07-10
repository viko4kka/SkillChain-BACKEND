import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/user.module'; // Dodaj ten import
import { PrismaModule } from 'prisma/prisma.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [UserModule, ProjectsModule, PrismaModule], // Dodaj UserModule do imports
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
