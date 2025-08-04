import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import { ethers } from 'ethers';
import { SetAddressDto } from './dto/setAddress.dto';
import { plainToInstance } from 'class-transformer';
import { CreateUserInput } from './interfaces/createUserInput.interface';
import { UpdateUserProfileDto } from './dto/updateUserProfile.dto';
import { GetUsersQueryDto } from './dto/getUsers.dto';
import { LanguageDto } from '../common/dto/language.dto';
import { UserSkillInputDto } from './dto/updateUserSkills.dto';
import { DisplayUserDto } from './dto/displayUser.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves a list of users filtered by optional query parameters such as search term,
   * skill, language, and location. Uses Prisma for easier query composition and readability
   * instead of raw SQL.
   *
   * @param query - Filtering options for retrieving users
   * @returns A list of users mapped to the DisplayUserDto format
   */
  async getUsers(query: GetUsersQueryDto): Promise<DisplayUserDto[]> {
    const users = await this.prisma.user.findMany({
      where: {
        ...(query.search && {
          OR: [
            { firstName: { contains: query.search, mode: 'insensitive' } },
            { lastName: { contains: query.search, mode: 'insensitive' } },
          ],
        }),
        ...(query.skillId && { userSkills: { some: { skillId: Number(query.skillId) } } }),
        ...(query.languageId && {
          userLanguages: { some: { languageId: Number(query.languageId) } },
        }),
        ...(query.locationId && { locationId: Number(query.locationId) }),
      },
      include: {
        userSkills: {
          select: {
            skill: true,
          },
        },
        location: true,
        userLanguages: {
          select: {
            language: true,
          },
        },
      },
    });

    return plainToInstance(DisplayUserDto, users);
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

  async incrementVisits(userId: number, type: 'linkedin' | 'github'): Promise<void> {
    if (type === 'linkedin') {
      await this.prisma.user.update({
        where: { id: userId },
        data: { linkedinVisits: { increment: 1 } },
      });
    } else if (type === 'github') {
      await this.prisma.user.update({
        where: { id: userId },
        data: { githubVisits: { increment: 1 } },
      });
    }
  }

  // Post new language for a user
  async updateUserLanguages(userId: number, languageIds: number[]) {
    await this.prisma.userLanguage.deleteMany({ where: { userId } });
    if (languageIds.length > 0) {
      await this.prisma.userLanguage.createMany({
        data: languageIds.map(languageId => ({ userId, languageId })),
      });
    }
    const userLanguages = await this.prisma.userLanguage.findMany({
      where: { userId },
      include: { language: true },
    });
    return plainToInstance(
      LanguageDto,
      userLanguages.map(ul => ({
        id: ul.language.id,
        name: ul.language.name,
      })),
    );
  }

  async setSkillsForUser(
    userId: number,
    skills: UserSkillInputDto[],
  ): Promise<UserSkillInputDto[]> {
    await this.prisma.userSkill.deleteMany({ where: { userId } });
    if (skills.length > 0) {
      await this.prisma.userSkill.createMany({
        data: skills.map(skill => ({
          userId,
          skillId: skill.skillId,
          description: skill.description ?? null,
        })),
      });
    }
    const dbSkills = await this.prisma.userSkill.findMany({
      where: { userId },
      select: { skillId: true, description: true },
    });
    return plainToInstance(UserSkillInputDto, dbSkills);
  }

  async setWalletAddress(userId: number, setAddressDto: SetAddressDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user!.walletAddress)
      throw new ForbiddenException('Wallet address already set and cannot be changed');
    const message = JSON.stringify({ id: userId });
    const isValid = this.verifyWalletSignature(
      setAddressDto.walletAddress,
      setAddressDto.signature,
      message,
    );
    if (!isValid) throw new ForbiddenException('Invalid wallet signature');

    return this.prisma.user.update({
      where: { id: userId },
      data: { walletAddress: setAddressDto.walletAddress },
    });
  }

  verifyWalletSignature(walletAddress: string, signature: string, message: string): boolean {
    try {
      const signer = ethers.verifyMessage(message, signature);
      return signer.toLowerCase() === walletAddress.toLowerCase();
    } catch {
      return false;
    }
  }
}
