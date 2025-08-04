import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import { ethers } from 'ethers';
import { SetAddressDto } from './dto/setAddress.dto';
import { plainToInstance } from 'class-transformer';
import { CreateUserInput } from './interfaces/createUserInput.interface';
import { UpdateUserProfileDto } from './dto/updateUserProfile.dto';
import { GetUsersQueryDto } from './dto/getUsers.dto';
import { UserSkillInputDto } from './dto/updateUserSkills.dto';
import { UserLanguageDto } from './dto/getUserLanguage.dto';
import { UpdateUserLanguageDto } from './dto/updateUserLanguage.dto';

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
          linkedinVisits: number;
          githubVisits: number;
          imgUrl: string | null;
        }>
      >(
        `SELECT id, "firstName", "lastName", "email", "job", "description", "gitUrl", "linkedinUrl",
        "linkedinVisits", "githubVisits", "imgUrl"
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
  async updateUserLanguages(userId: number, languages: UserLanguageDto[]) {
    await this.prisma.userLanguage.deleteMany({ where: { userId } });
    if (languages.length > 0) {
      await this.prisma.userLanguage.createMany({
        data: languages.map(({ id, description }) => ({ userId, languageId: id, description })),
      });
    }
    const userLanguages = await this.prisma.userLanguage.findMany({
      where: { userId },
      include: { language: true },
    });
    return plainToInstance(
      UpdateUserLanguageDto,
      userLanguages.map(ul => ({
        id: ul.language.id,
        name: ul.language.name,
        description: ul.description,
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
