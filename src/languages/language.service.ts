import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { LanguageDto } from './dto/language.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class LanguageService {
  constructor(private prisma: PrismaService) {}

  async findAllLanguages(): Promise<LanguageDto[]> {
    const languages = await this.prisma.language.findMany();
    return plainToInstance(LanguageDto, languages);
  }
}
