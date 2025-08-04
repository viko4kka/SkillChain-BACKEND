import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { UserLanguageDto } from './dto/userLanguage.dto';

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
    createLanguageDto: UserLanguageDto,
    userId: number,
  ): Promise<UserLanguageDto> {
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
