import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectDto } from './dto/project.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { CreateProjectDto } from './dto/create.project.dto';

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
    return this.projectsService.findAllProjects();
  }

  @Get(':id')
  @HttpCode(200)
  findOne(@Param('id') id: string) {
    return this.projectsService.getProjectDataById(+id);
  }

  @Post()
  @HttpCode(201)
  async create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.createProject(createProjectDto);
  }
}
