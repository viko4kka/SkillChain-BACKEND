import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class ProjectDto {
  @ApiProperty({ description: 'Unique identifier for the project' })
  @Exclude()
  id: number;

  @ApiProperty({ description: 'Name of the project' })
  projectName: string;

  @ApiProperty({ description: 'Short description of the project' })
  description: string;

  @ApiProperty({
    description: 'Link to the GitHub repository',
    required: false,
  })
  githubLink?: string | null;

  @ApiProperty({ description: 'Link to the project website', required: false })
  websiteLink?: string | null;
}
