import {
  Body,
  BadRequestException,
  Session,
  Controller,
  Get,
  Param,
  Post,
  ParseIntPipe,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { inputProjectDto } from './dto/inputProject.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { ProjectDto } from './dto/project.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { SessionData } from 'express-session';

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

  @Post()
  @UseGuards(AuthGuard)
  async createProject(@Session() session: SessionData, @Body() createProjectDto: inputProjectDto) {
    const userId = session.user?.id;
    return this.projectsService.createProject(createProjectDto, userId!);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async updateProject(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: inputProjectDto,
    @Session() session: SessionData,
  ) {
    const userId = session.user?.id;
    const project = await this.projectsService.findOne(id);
    if (!project || project.idUser !== userId) {
      throw new BadRequestException('Project not found or access denied');
    }
    return this.projectsService.updateProject(id, updateProjectDto, userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteProject(@Param('id', ParseIntPipe) id: number, @Session() session: SessionData) {
    const userId = session.user?.id;
    const project = await this.projectsService.findOne(id);
    if (!project || project.idUser !== userId) {
      throw new BadRequestException('Project not found or access denied');
    }
    await this.projectsService.deleteProject(id);
    return { message: 'Project deleted' };
  }
}
