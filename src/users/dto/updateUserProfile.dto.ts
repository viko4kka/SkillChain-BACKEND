import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateUserProfileDto {
  @ApiProperty({ description: 'Description that provides more information about the user' })
  @IsOptional()
  @IsString()
  description: string | null;

  @ApiProperty({ description: 'Users job' })
  @IsOptional()
  @IsString()
  job: string | null;

  @ApiProperty({ description: 'Link to the users GitHub profile' })
  @IsOptional()
  @IsUrl()
  gitUrl: string | null;

  @ApiProperty({ description: 'Link to the users LinkedIn profile' })
  @IsOptional()
  @IsUrl()
  linkedinUrl: string | null;

  
}
