import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.project.findMany();
  }
}
