import { Controller, Get } from '@nestjs/common';
import { LanguageService } from './language.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { LanguageDto } from './dto/language.dto';

@Controller('/languages')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @ApiOkResponse({
    description: 'Returns all users',
    type: [LanguageDto],
  })
  @Get()
  async findAll() {
    return this.languageService.findAllLanguages();
  }
}
