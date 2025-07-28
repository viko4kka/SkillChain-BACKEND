import { Injectable, BadRequestException } from '@nestjs/common';
import { Project } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { ProjectDto } from './dto/project.dto';
import { plainToInstance } from 'class-transformer';
import { InputProjectDto } from './dto/inputProject.dto';
import { PaginationQueryFilter } from 'src/utlis/dto/pagination.dto';
import { PaginationService } from 'src/utlis/pagination.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAllforUser(paginationDto: PaginationQueryFilter, userId: number) {
    const totalCount = await this.prisma.project.count({
      where: { idUser: userId },
    });

    const paginationService = new PaginationService({
      itemsCount: totalCount,
      page: paginationDto.page,
      perPage: paginationDto.perPage,
    });

    const projects = await this.prisma.project.findMany({
      where: { idUser: userId },
      ...paginationService.getPaginationParams(),
    });
    return {
      data: plainToInstance(ProjectDto, projects),
      ...paginationService.getPaginationResult(),
    };
  }

  async createProject(createProjectDto: InputProjectDto, userId: number): Promise<Project> {
    const project = await this.prisma.project.create({
      data: {
        ...createProjectDto,
        idUser: userId,
      },
    });
    return plainToInstance(ProjectDto, project);
  }

  async findOne(id: number): Promise<ProjectDto | null> {
    const project = await this.prisma.project.findUnique({ where: { id } });
    return project ? plainToInstance(ProjectDto, project) : null;
  }

  async updateProject(
    id: number,
    updateProjectDto: InputProjectDto,
    userId: number,
  ): Promise<ProjectDto> {
    const project = await this.findOne(id);
    if (!project) {
      throw new BadRequestException('Project not found');
    }
    if (project.idUser !== userId) {
      throw new BadRequestException('Cannot update other users projects');
    }
    const updated = await this.prisma.project.update({
      where: { id },
      data: {
        ...updateProjectDto,
        idUser: userId,
      },
    });
    return plainToInstance(ProjectDto, updated);
  }

  async deleteProject(id: number, userId: number): Promise<void> {
    const project = await this.findOne(id);
    if (!project) {
      throw new BadRequestException('Project not found');
    }
    if (project.idUser !== userId) {
      throw new BadRequestException('Cannot delete other users projects');
    }
    await this.prisma.project.delete({ where: { id } });
  }
}
