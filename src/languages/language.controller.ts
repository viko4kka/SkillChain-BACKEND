import {
  Body,
  Controller,
  Delete,
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
import { UpdateUserLanguageDto } from './dto/updateLanguage.dto';
import { MessageResponseDto } from 'src/utlis/dto/messageResponse.dto';

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

  @ApiOkResponse({
    description: 'Updates a language for the logged-in user',
    type: UserLanguageDto,
  })
  @Patch(':id')
  @UseGuards(AuthGuard)
  async updateLanguage(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateUserLanguageDto,
    @Session() session: SessionData,
  ) {
    const userId = session.user?.id;
    return this.languageService.updateLanguage(userId!, id, updateDto);
  }

  @ApiOkResponse({
    description: 'Deletes a language for the logged-in user',
    type: MessageResponseDto,
  })
  @Delete('/:languageId')
  @UseGuards(AuthGuard)
  async deleteLanguage(
    @Param('languageId', ParseIntPipe) languageId: number,
    @Session() session: SessionData,
  ) {
    const userId = session.user?.id;
    await this.languageService.deleteLanguage(userId!, languageId);
    return { message: 'Language deleted successfully' };
  }
}
