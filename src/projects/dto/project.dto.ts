import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class ProjectDto {
  @ApiProperty({ description: 'Unique identifier for the project' })
  @IsInt()
  @Exclude()
  id: number;

  @ApiProperty({ description: 'Name of the project' })
  @IsString()
  @IsNotEmpty()
  projectName: string;

  @ApiProperty({ description: 'Short description of the project' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Link to the GitHub repository',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  @IsUrl()
  githubLink?: string | null;

  @ApiProperty({ description: 'Link to the project website', required: false })
  @IsUrl()
  @IsOptional()
  websiteLink?: string | null;
}
