import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserDto } from './dto/users.dto';
import { plainToInstance } from 'class-transformer';
import { CreateUserInput } from './dto/create-user.dto';
import { UpdateUserProfileDto } from './dto/update-use-profile.dto';
import { LanguageDto } from 'src/languages/dto/language.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllUsers(): Promise<UserDto[]> {
    const users = await this.prisma.user.findMany();
    return plainToInstance(UserDto, users);
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
}
