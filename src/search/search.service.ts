import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async searchUsers(q: string) {
    if (!q) return [];

    const users = await this.prisma.$queryRawUnsafe<
      Array<{ id: number; firstName: string; lastName: string; job: string; description: string }>
    >(
      `
      SELECT id, "firstName", "lastName", job, description
      FROM "User"
      WHERE similarity("firstName", $1) > 0.2
         OR similarity("lastName", $1) > 0.2
      ORDER BY GREATEST(similarity("firstName", $1), similarity("lastName", $1)) DESC
      LIMIT 10
      `,
      q
    );

    return users;
  }
}