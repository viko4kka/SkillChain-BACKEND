import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
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

  @ApiProperty({ description: 'ID of the user creating the project' })
  idUser: number;
}
