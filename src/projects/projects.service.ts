import { Injectable } from '@nestjs/common';
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
