import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { LanguageService } from './language.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { LanguageDto } from 'src/common/dto/language.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { SessionData } from 'express-session';
import { UserLanguageDto } from './dto/userLanguage.dto';

@Controller('languages')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @ApiOkResponse({
    description: 'Returns all languages for a user',
    type: [UserLanguageDto],
  })
  @Get('/user/:id')
  async getUserLanguages(@Param('id', ParseIntPipe) userId: number) {
    return await this.languageService.getUserLanguages(userId);
  }

  @ApiOkResponse({
    description: 'Creates a new language for the logged-in user',
    type: UserLanguageDto,
  })
  @Post()
  @UseGuards(AuthGuard)
  async createLanguage(
    @Session() session: SessionData,
    @Body() createLanguageDto: UserLanguageDto,
  ) {
    const userId = session.user?.id;
    return this.languageService.createLanguage(createLanguageDto, 21);
  }
}
