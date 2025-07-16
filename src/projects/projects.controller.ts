import { Controller, Get, HttpCode } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectDto } from './dto/project.dto';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiOkResponse({
    description: 'Returns all projects',
    type: [ProjectDto],
  })
  @Get()
  @HttpCode(200)
  async findAll() {
    const projects = await this.projectsService.findAllProjects();
    return projects;
  }
}
