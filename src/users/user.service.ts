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
import { DisplayUserDto } from './dto/displayUser.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers(query: GetUsersQueryDto): Promise<DisplayUserDto[]> {
    const whereClauses: string[] = [];
    const params: any[] = [];

    if (query.search) {
      whereClauses.push(
        '(similarity(u."firstName", $1) > 0.2 OR similarity(u."lastName", $1) > 0.2)',
      );
      params.push(query.search);
    }
    if (query.skillId) {
      whereClauses.push('us."skillId" = $' + (params.length + 1));
      params.push(Number(query.skillId));
    }
    if (query.languageId) {
      whereClauses.push('ul."languageId" = $' + (params.length + 1));
      params.push(Number(query.languageId));
    }
    if (query.locationId) {
      whereClauses.push('u."locationId" = $' + (params.length + 1));
      params.push(Number(query.locationId));
    }

    const whereSql = whereClauses.length ? 'WHERE ' + whereClauses.join(' AND ') : '';

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
        userSkills: { id: number; name: string }[];
        userLanguages: { id: number; name: string }[];
        location: { id: number; name: string } | null;
      }>
    >(
      `SELECT 
      u.id, u."firstName", u."lastName", u."email", u."job", u."description", u."gitUrl", u."linkedinUrl",
      u."linkedinVisits", u."githubVisits", u."imgUrl",
      COALESCE(
        json_agg(DISTINCT jsonb_build_object('id', s.id, 'name', s.name)) 
        FILTER (WHERE s.id IS NOT NULL), '[]'
      ) as "userSkills",
      COALESCE(
        json_agg(DISTINCT jsonb_build_object('id', lang.id, 'name', lang.name)) 
        FILTER (WHERE lang.id IS NOT NULL), '[]'
      ) as "userLanguages",
      jsonb_build_object('id', l.id, 'name', l.name) as "location"
    FROM "User" u
    LEFT JOIN "UserSkill" us ON u.id = us."userId"
    LEFT JOIN "Skill" s ON us."skillId" = s.id
    LEFT JOIN "UserLanguage" ul ON u.id = ul."userId"
    LEFT JOIN "Language" lang ON ul."languageId" = lang.id
    LEFT JOIN "Location" l ON u."locationId" = l.id
    ${whereSql}
    GROUP BY u.id, l.id, l.name
    ${query.search ? 'ORDER BY GREATEST(similarity(u."firstName", $1), similarity(u."lastName", $1)) DESC' : 'ORDER BY u."firstName", u."lastName"'}`,
      ...params,
    );

    const parsedUsers = users.map(u => ({
      ...u,
      userSkills:
        typeof u.userSkills === 'string'
          ? (JSON.parse(u.userSkills) as { id: number; name: string }[])
          : u.userSkills,
      userLanguages:
        typeof u.userLanguages === 'string'
          ? (JSON.parse(u.userLanguages) as { id: number; name: string }[])
          : u.userLanguages,
      location:
        typeof u.location === 'string'
          ? (JSON.parse(u.location) as { id: number; name: string } | null)
          : u.location,
    }));

    return plainToInstance(DisplayUserDto, parsedUsers);
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

  async getSkillsForUser(userId: number) {
    return this.prisma.userSkill.findMany({
      where: { userId },
      include: { skill: true }, // if you want skill details
    });
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
