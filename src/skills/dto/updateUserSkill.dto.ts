import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserSkillDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description: string | null;
}
