import { Injectable } from '@nestjs/common';
import { Project } from '@prisma/client'; // This is the Prisma interface/type
import { PrismaService } from 'prisma/prisma.service';
import { ProjectDto } from './dto/project.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAllProjects(): Promise<ProjectDto[]> {
    const projects = await this.prisma.project.findMany();
    return plainToInstance(ProjectDto, projects);
  }
}
