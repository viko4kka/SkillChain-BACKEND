import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateUserProfileDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  gitUrl?: string;

  @IsOptional()
  @IsUrl()
  linkedinUrl?: string;
}
