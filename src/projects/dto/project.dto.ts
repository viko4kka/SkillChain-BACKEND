import { ApiProperty } from '@nestjs/swagger';

export class ProjectDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  projectName: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  githubLink?: string;

  @ApiProperty({ required: false })
  websiteLink?: string;
}
