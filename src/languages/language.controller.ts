// language.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { LanguageService } from './language.service';

@Controller('users/:id/languages')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Get()
  async getUserLanguages(@Param('id') id: string) {
    const userId = parseInt(id, 10);
    return this.languageService.getLanguagesByUserId(userId);
  }
}
