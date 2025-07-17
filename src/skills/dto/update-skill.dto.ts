import { IsString, IsOptional } from 'class-validator';

export class UpdateSkillDto {
  @IsString()
  name?: string;
  @IsOptional()
  @IsString()
  description?: string;
}
