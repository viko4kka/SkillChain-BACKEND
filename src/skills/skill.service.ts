import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserSkillDto } from './dto/userSkill.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateUserSkillDto } from './dto/updateUserSkill.dto';

@Injectable()
export class SkillService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserSkills(userId: number): Promise<UserSkillDto[]> {
    const userSkills = await this.prisma.userSkill.findMany({
      where: { userId },
      include: { skill: true },
    });
    return userSkills
      .filter(us => us.skill)
      .map(us => ({
        id: us.skill.id,
        name: us.skill.name,
        description: us.description,
      }));
  }

  async createSkill(createSkillDto: UserSkillDto, userId: number): Promise<UserSkillDto> {
    const { id: skillId, description } = createSkillDto;
    const userSkill = await this.findOne(userId, skillId);
    if (userSkill) {
      throw new BadRequestException('Skill already exists for the user');
    }
    const createdUserSkill = await this.prisma.userSkill.create({
      data: {
        userId,
        skillId,
        description,
      },
    });

    return {
      id: createdUserSkill.skillId,
      description: createdUserSkill.description,
    };
  }

  async findOne(userId: number, skillId: number): Promise<UserSkillDto | null> {
    const userSkill = await this.prisma.userSkill.findUnique({
      where: {
        userId_skillId: { userId, skillId },
      },
    });
    return userSkill ? plainToInstance(UserSkillDto, userSkill) : null;
  }

  async updateSkill(
    userId: number,
    skillId: number,
    updateDto: UpdateUserSkillDto,
  ): Promise<UserSkillDto> {
    const userSkill = await this.findOne(userId, skillId);
    if (!userSkill) {
      throw new BadRequestException('Skill not found for the user');
    }
    const updatedSkill = await this.prisma.userSkill.update({
      where: { userId_skillId: { userId, skillId } },
      data: { description: updateDto.description },
    });
    return plainToInstance(UserSkillDto, updatedSkill);
  }
}
