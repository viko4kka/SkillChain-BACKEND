import { Controller, Get, HttpCode } from '@nestjs/common';
import { ProjectDto } from './dto/project.dto';
import { ProjectsService } from './projects.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { instanceToPlain } from 'class-transformer';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiOkResponse({
    description: 'Returns all projects',
    type: [ProjectDto],
  })
  @Get()
  @HttpCode(200)
  findAll() {
    const projects = this.projectsService.findAllProjects();
    return instanceToPlain(projects);
  }
}
