import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAllProjects(): Promise<ProjectDto[]> {
    const projects = await this.prisma.project.findMany();
    return projects.map((project) => ({
      id: project.id,
      projectName: project.projectName,
      description: project.description!,
      githubLink: project.githubLink ?? null,
      websiteLink: project.websiteLink ?? null,
    }));
  }
}
