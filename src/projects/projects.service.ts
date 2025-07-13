import { Injectable } from '@nestjs/common';
import { Project } from '@prisma/client'; // This is the Prisma interface/type
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAllProjects(): Promise<Project[]> {
    return this.prisma.project.findMany();
  }
}
