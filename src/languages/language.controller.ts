import { Controller, Get } from '@nestjs/common';
import { LanguageService } from './language.service';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('/languages')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @ApiOkResponse({
    description: 'Returns all users',
  })
  @Get()
  findAll() {
    return this.languageService.findAllLanguages();
  }
}
