import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { UserLanguageDto } from './dto/userLanguage.dto';
import { UpdateUserLanguageDto } from './dto/updateLanguage.dto';

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

  async findOne(userId: number, languageId: number): Promise<UserLanguageDto | null> {
    const userLanguage = await this.prisma.userLanguage.findUnique({
      where: {
        userId_languageId: { userId, languageId },
      },
    });
    return userLanguage ? plainToInstance(UserLanguageDto, userLanguage) : null;
  }

  async updateLanguage(
    userId: number,
    languageId: number,
    updateDto: UpdateUserLanguageDto,
  ): Promise<UserLanguageDto> {
    const userLanguage = await this.findOne(userId, languageId);
    if (!userLanguage) {
      throw new BadRequestException('Language not found for the user');
    }
    const updatedLanguage = await this.prisma.userLanguage.update({
      where: { userId_languageId: { userId, languageId } },
      data: { description: updateDto.description },
    });
    return plainToInstance(UserLanguageDto, updatedLanguage);
  }
}
