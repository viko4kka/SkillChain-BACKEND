import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserSkillDto } from './dto/userSkill.dto';

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
}
