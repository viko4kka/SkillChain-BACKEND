import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { UserDto } from '../users/dto/users.dto';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async searchUsers(q: string): Promise<UserDto[]> {
    const users = await this.prisma.$queryRawUnsafe<
      Array<{
        id: number;
        firstName: string;
        email?: string;
        job: string | null;
        description: string | null;
        gitUrl: string | null;
        linkedinUrl: string | null;
      }>
    >(
      `SELECT id, "firstName", "lastName", "email", job, description, gitUrl, linkedinUrl
      FROM "User" WHERE similarity("firstName", $1) > 0.3 OR similarity("lastName", $1) > 0.3
      ORDER BY GREATEST(similarity("firstName", $1), similarity("lastName", $1)) DESC`,
      q,
    );

    return plainToInstance(UserDto, users);
  }
}
