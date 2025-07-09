import { Controller, Get, HttpCode } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @HttpCode(200)
  findAll() {
    return this.projectsService.findAll();
  }
}
