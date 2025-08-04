import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserLanguageDto } from './dto/getUserLanguage.dto';
import { UpdateUserLanguageDto } from './dto/updateUserLanguage.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class LanguageService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserLanguages(userId: number): Promise<UserLanguageDto[]> {
    const userLanguages = await this.prisma.userLanguage.findMany({
      where: { userId },
      include: { language: true },
    });
    return userLanguages
      .filter(ul => ul.language)
      .map(ul => ({
        id: ul.language.id,
        name: ul.language.name,
        description: ul.description,
      }));
  }

  async createLanguage(
    createLanguageDto: UpdateUserLanguageDto,
    userId: number,
  ): Promise<UpdateUserLanguageDto> {
    const { id: languageId, description } = createLanguageDto;

    const userLanguage = await this.prisma.userLanguage.create({
      data: {
        userId,
        languageId,
        description,
      },
    });

    return {
      id: userLanguage.languageId,
      description: userLanguage.description,
    };
  }

}
