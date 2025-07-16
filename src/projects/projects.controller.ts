import { Body, Controller, Get, HttpCode, Param, Post, ParseIntPipe } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create.project.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { ProjectDto } from './dto/project.dto';

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

  @ApiOkResponse({
    description: 'Returns one project by ID',
    type: ProjectDto,
  })
  @Get(':id')
  @HttpCode(200)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.getProjectDataById(id);
  }

  @Post()
  @HttpCode(201)
  async create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.createProject(createProjectDto);
  }
}
