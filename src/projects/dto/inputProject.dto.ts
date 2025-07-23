import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class InputProjectDto {
  @ApiProperty({ description: 'Name of the project' })
  @IsString()
  projectName: string;

  @ApiProperty({ description: 'Short description of the project' })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Link to the GitHub repository',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  githubLink: string | null;

  @ApiProperty({
    description: 'Link to the project website',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  websiteLink: string | null;
}
