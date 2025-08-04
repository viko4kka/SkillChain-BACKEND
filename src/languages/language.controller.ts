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
import { UserLanguageDto } from './dto/getUserLanguage.dto';
import { UpdateUserLanguageDto } from './dto/updateUserLanguage.dto';

@Controller('languages')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @ApiOkResponse({
    description: 'Returns all languages for a user',
    type: [LanguageDto],
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
    @Body() createLanguageDto: UpdateUserLanguageDto,
  ) {
    const userId = session.user?.id;
    return this.languageService.createLanguage(createLanguageDto, userId!);
  }
}
