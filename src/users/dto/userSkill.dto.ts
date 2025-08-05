import { ApiProperty } from '@nestjs/swagger';

export class UserSkillDto {
  @ApiProperty({ description: 'Skill ID' })
  skillId: number;

  @ApiProperty({ description: 'Skill description' })
  description: string;

  @ApiProperty({ description: 'User ID' })
  userId: number;
}
