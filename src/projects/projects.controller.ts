import { Controller, Get, HttpCode } from '@nestjs/common';

import { ProjectsService } from './projects.service';

import { ProjectDto } from './dto/project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @HttpCode(200)
  async findAll(): Promise<ProjectDto[]> {
    const projects = await this.projectsService.findAllProjects();
    return projects.map((project) => ({
      id: project.id,
      projectName: project.projectName,
      description: project.description,
      githubLink: project.githubLink,
      websiteLink: project.websiteLink,
    }));
  }
}
