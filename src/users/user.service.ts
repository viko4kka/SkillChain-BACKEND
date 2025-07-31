import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserDto } from './dto/user.dto';
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

  async getUserSkills(query: GetUsersQueryDto): Promise<string> {
    if (query.search) {
      const userSkills = await this.prisma.$queryRawUnsafe<
        Array<{
          skill: string;
        }>
      >(
        `SELECT string_agg(s.name, ',' ORDER BY s.name) as skills
        FROM public."Skill" s join public."UserSkill" us on s.id =us."skillId" join public."User" u on us."userId" = u.id
        where u.id = 1`,
        query.search,
      );

      return userSkills.length > 0 ? userSkills[0].skill : '';
    } else {
      return '';
    }
  }

  async getUsers(query: GetUsersQueryDto): Promise<DisplayUserDto[]> {
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
        skills: string | null;
        locationName: string | null;
      }>
    >(
      `SELECT u.id, u."firstName", u."lastName", u."email", u."job", u."description", u."gitUrl", u."linkedinUrl",
      u."linkedinVisits", u."githubVisits", u."imgUrl", 
      COALESCE(string_agg(s.name, ', ' ORDER BY s.name), '') as "skills",
      l.name as "locationName"
      FROM "User" u
      LEFT JOIN "UserSkill" us ON u.id = us."userId"
      LEFT JOIN "Skill" s ON us."skillId" = s.id
      LEFT JOIN "Location" l ON u."locationId" = l.id
      ${query.search ? 'WHERE similarity(u."firstName", $1) > 0.2 OR similarity(u."lastName", $1) > 0.2' : ''}
      GROUP BY u.id, u."firstName", u."lastName", u."email", u."job", u."description", u."gitUrl", u."linkedinUrl",
      u."linkedinVisits", u."githubVisits", u."imgUrl", l."name"
      ${query.search ? 'ORDER BY GREATEST(similarity(u."firstName", $1), similarity(u."lastName", $1)) DESC' : 'ORDER BY u."firstName", u."lastName"'}`,
      ...(query.search ? [query.search] : []),
    );
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

  async getAllUserSkills() {
    return this.prisma.userSkill.findMany({
      select: {
        skillId: true,
        description: true,
        userId: true,
      },
    });
  }
}
