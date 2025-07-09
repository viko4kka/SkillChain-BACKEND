import { Controller, Get, HttpCode } from '@nestjs/common';
import { ProjectDto } from './dto/project.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @HttpCode(200)
  findAll(): Promise<ProjectDto[]> {
    return this.projectsService.findAllProjects();
  }
}
