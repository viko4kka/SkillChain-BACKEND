import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserSkillDto } from './dto/userSkill.dto';
import { UpdateUserSkillDto } from './dto/updateUserSkill.dto';
import { UserSkillWithConfirmations } from '../users/dto/UserSkillWithConfirmations.dto';

@Injectable()
export class SkillService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserSkillsWithConfirmations(userId: number): Promise<UserSkillWithConfirmations[]> {
    const userSkills = await this.prisma.userSkill.findMany({
      where: {
        userId: userId,
      },
      include: {
        skill: {
          include: {
            confirmations: {
              where: {
                receiverId: userId,
              },
              include: {
                approver: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return userSkills
      .filter(us => us.skill)
      .map(userSkill => ({
        id: userSkill.skill.id,
        name: userSkill.skill.name,
        description: userSkill.description ?? '',
        confirmations: (userSkill.skill.confirmations || [])
          .filter(confirmation => confirmation.approver)
          .map(confirmation => ({
            id: confirmation.approver.id,
            firstName: confirmation.approver.firstName,
            lastName: confirmation.approver.lastName,
          })),
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
      include: {
        skill: true,
      },
    });

    return {
      id: createdUserSkill.skill.id,
      name: createdUserSkill.skill.name,
      description: createdUserSkill.description,
    };
  }

  async findOne(userId: number, skillId: number): Promise<UserSkillDto | null> {
    const userSkill = await this.prisma.userSkill.findUnique({
      where: {
        userId_skillId: { userId, skillId },
      },
      include: {
        skill: true,
      },
    });
    return userSkill && userSkill.skill
      ? {
          id: userSkill.skill.id,
          name: userSkill.skill.name,
          description: userSkill.description,
        }
      : null;
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
      include: {
        skill: true,
      },
    });
    return {
      id: updatedSkill.skill.id,
      name: updatedSkill.skill.name,
      description: updatedSkill.description,
    };
  }

  async deleteSkill(userId: number, skillId: number): Promise<void> {
    const userSkill = await this.findOne(userId, skillId);
    if (!userSkill) {
      throw new BadRequestException('Skill not found for the user');
    }
    await this.prisma.userSkill.delete({
      where: { userId_skillId: { userId, skillId } },
    });
  }
}
