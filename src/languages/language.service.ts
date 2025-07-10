// language.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class LanguageService {
  constructor(private prisma: PrismaService) {}

  async getLanguagesByUserId(userId: number) {
    return this.prisma.language.findMany({
      where: { userId },
    });
  }
}
