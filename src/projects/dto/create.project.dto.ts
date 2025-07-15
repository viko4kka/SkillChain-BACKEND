import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateProjectDto {
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
  githubLink?: string | null;

  @ApiProperty({ description: 'Link to the project website', required: false })
  @IsUrl()
  @IsOptional()
  websiteLink?: string | null;

  @ApiProperty({ description: 'ID of the user creating the project' })
  @IsInt()
  idUser: number;
}
