import { IsArray, ValidateNested, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserSkillInputDto {
  @ApiProperty({ description: 'The ID of the skill', type: Number })
  @IsInt()
  skillId: number;

  @ApiProperty({ description: 'The description of the skill', type: String, required: false })
  @IsOptional()
  @IsString()
  description: string | null;
}

export class UpdateUserSkillsDto {
  @ApiProperty({
    description: 'List of skills to update for the user',
    type: [UserSkillInputDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserSkillInputDto)
  skills: UserSkillInputDto[];
}
