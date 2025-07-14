import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class LanguageService {
  constructor(private prisma: PrismaService) {}

  async findAllLanguages() {
    const users = await this.prisma.language.findMany();
    return users;
  }
}
