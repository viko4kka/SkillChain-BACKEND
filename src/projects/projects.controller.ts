import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { MessageResponseDto } from 'src/utlis/dto/messageResponse.dto';
import { InputProjectDto } from './dto/inputProject.dto';
import { ProjectDto } from './dto/project.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiOkResponse({
    description: 'Returns all projects for a user',
    type: [ProjectDto],
  })
  @Get('user/:userId')
  async findAllforUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.projectsService.findAllforUser(userId);
  }

  @ApiOkResponse({
    description: 'Creates a new project for the logged-in user',
    type: ProjectDto,
  })
  @Post()
  //@UseGuards(AuthGuard)
  async createProject(@Body() createProjectDto: InputProjectDto) {
    return this.projectsService.createProject(createProjectDto, 21);
  }

  @ApiOkResponse({
    description: 'Updates a project for the logged-in user',
    type: ProjectDto,
  })
  @Patch(':id')
  //@UseGuards(AuthGuard)
  async updateProject(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: InputProjectDto,
  ) {
    const userId = 21;
    return this.projectsService.updateProject(id, updateProjectDto, userId);
  }

  @ApiOkResponse({
    description: 'Deletes a project for the logged-in user',
    type: MessageResponseDto,
  })
  @Delete(':id')
  //@UseGuards(AuthGuard)
  async deleteProject(@Param('id', ParseIntPipe) id: number) {
    await this.projectsService.deleteProject(id, 21);
    return { message: 'Project deleted' };
  }
}
