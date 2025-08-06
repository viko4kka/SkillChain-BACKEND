import { ApiProperty } from '@nestjs/swagger';

export class ProjectDto {
  @ApiProperty({ description: 'Unique identifier for the project', type: Number })
  id: number;

  @ApiProperty({ description: 'User ID', type: Number })
  idUser: number;

  @ApiProperty({ description: 'Name of the project', type: String })
  projectName: string;

  @ApiProperty({ description: 'Short description of the project', type: String })
  description: string;

  @ApiProperty({
    description: 'Link to the GitHub repository',
    type: String,
    required: false,
  })
  githubLink: string | null;

  @ApiProperty({ description: 'Link to the project website', type: String, required: false })
  websiteLink: string | null;

  @ApiProperty({ description: 'Project start date', type: String, format: 'date-time' })
  startDate: string;

  @ApiProperty({
    description: 'Project end date',
    type: String,
    format: 'date-time',
    required: false,
  })
  endDate?: string | null;
}
