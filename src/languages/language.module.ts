// language.module.ts
import { Module } from '@nestjs/common';
import { LanguageService } from './language.service';
import { LanguageController } from './language.controller';
import { UserModule } from 'src/users/user.module';

@Module({
  imports: [UserModule],
  providers: [LanguageService],
  controllers: [LanguageController],
})
export class LanguageModule {}
