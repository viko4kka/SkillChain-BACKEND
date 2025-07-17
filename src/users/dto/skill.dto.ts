import { ApiProperty } from '@nestjs/swagger';

export class SkillDto {
  @ApiProperty({ description: 'Unique identifier for the skill', type: Number })
  id: number;

  @ApiProperty({ description: 'Skill name', type: String })
  name: string;
}
