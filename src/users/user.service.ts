import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserDto } from './dto/users.dto';
import { plainToInstance } from 'class-transformer';
import { CreateUserInput } from './dto/create-user.dto';
import { GetUsersQueryDto } from './dto/get-users.dto';
import { UpdateUserProfileDto } from './dto/update-use-profile.dto';
import { LanguageDto } from '../common/dto/language.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers(query: GetUsersQueryDto): Promise<UserDto[]> {
    if (query.search) {
      const users = await this.prisma.$queryRawUnsafe<
        Array<{
          id: number;
          firstName: string;
          lastName: string;
          email?: string;
          job: string | null;
          description: string | null;
          gitUrl: string | null;
          linkedinUrl: string | null;
        }>
      >(
        `SELECT id, "firstName", "lastName", "email", "job", "description", "gitUrl", "linkedinUrl"
      FROM "User" WHERE similarity("firstName", $1) > 0.2 OR similarity("lastName", $1) > 0.2
      ORDER BY GREATEST(similarity("firstName", $1), similarity("lastName", $1)) DESC`,
        query.search,
      );
      return plainToInstance(UserDto, users);
    } else {
      const users = await this.prisma.user.findMany();
      return plainToInstance(UserDto, users);
    }
  }

  async findOneUser(id: number): Promise<UserDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user ? plainToInstance(UserDto, user) : null;
  }

  async findByLinkedinId(linkedinId: string): Promise<UserDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { linkedinId },
    });
    return user ? plainToInstance(UserDto, user) : null;
  }

  async create(userData: CreateUserInput): Promise<UserDto> {
    const createdUser = await this.prisma.user.create({
      data: userData,
    });
    return plainToInstance(UserDto, createdUser);
  }

  async updateProfile(id: number, data: UpdateUserProfileDto): Promise<UserDto> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  // LANGUAGES methods
  // Assign a language to a user
  async assignLanguageToUser(userId: number, languageId: number): Promise<void> {
    await this.prisma.userLanguage.create({
      data: {
        userId,
        languageId,
      },
    });
  }
  // Get languages assigned to a user
  async getUserLanguages(userId: number): Promise<LanguageDto[]> {
    const userLanguages = await this.prisma.userLanguage.findMany({
      where: { userId },
      include: { language: true },
    });
    return userLanguages
      .filter(ul => ul.language)
      .map(ul => ({
        id: ul.language.id,
        name: ul.language.name,
      }));
  }

  // LOCATION methods
  async updateLocation(userId: number, locationId: number): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { locationId },
    });
  }
}
