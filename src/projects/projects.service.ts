import { Injectable } from '@nestjs/common';
import { Project } from '@prisma/client'; // This is the Prisma interface/type
import { PrismaService } from 'prisma/prisma.service';
import { ProjectDto } from './dto/project.dto';
import { plainToInstance } from 'class-transformer';
import { CreateProjectDto } from './dto/create.project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAllProjects(): Promise<ProjectDto[]> {
    const projects = await this.prisma.project.findMany();
    return plainToInstance(ProjectDto, projects);
  }

  async createProject(createProjectDto: CreateProjectDto): Promise<Project> {
    return this.prisma.project.create({
      data: {
        ...createProjectDto,
      },
    });
  }

  async getProjectDataById(id: number) {
    return this.prisma.project.findUnique({ where: { id } });
  }
}
