import { Injectable } from '@nestjs/common';
import { Project } from '@prisma/client'; // This is the Prisma interface/type
import { PrismaService } from 'prisma/prisma.service';
import { ProjectDto } from './dto/project.dto';
import { plainToInstance } from 'class-transformer';
import { inputProjectDto } from './dto/inputProject.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAllforUser(userId: number): Promise<ProjectDto[]> {
    const projects = await this.prisma.project.findMany({
      where: { idUser: userId },
    });
    return plainToInstance(ProjectDto, projects);
  }

  async createProject(createProjectDto: inputProjectDto, userId: number): Promise<Project> {
    return this.prisma.project.create({
      data: {
        ...createProjectDto,
        idUser: userId,
      },
    });
  }

  async findOne(id: number): Promise<ProjectDto | null> {
    return this.prisma.project.findUnique({ where: { id } });
  }

  async updateProject(
    id: number,
    updateProjectDto: inputProjectDto,
    userId: number,
  ): Promise<ProjectDto> {
    const updated = await this.prisma.project.update({
      where: { id },
      data: {
        ...updateProjectDto,
        idUser: userId,
      },
    });
    return plainToInstance(ProjectDto, updated);
  }

  async deleteProject(id: number): Promise<void> {
    await this.prisma.project.delete({ where: { id } });
  }
}
