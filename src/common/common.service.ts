import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { SkillDto } from 'src/common/dto/skill.dto';
import { LanguageDto } from '../common/dto/language.dto';
import { LocationDto } from '../common/dto/location.dto';
import { PaginationQueryFilter } from 'src/utlis/dto/pagination.dto';
import { PaginationService } from 'src/utlis/pagination.service';

@Injectable()
export class CommonService {
  constructor(private readonly prisma: PrismaService) {}
  // Languages
  async getAllLanguages(paginationDto: PaginationQueryFilter) {
    const totalCount = await this.prisma.language.count();

    const paginationService = new PaginationService({
      itemsCount: totalCount,
      page: paginationDto.page,
      perPage: paginationDto.perPage,
    });

    const languages = await this.prisma.language.findMany({
      ...paginationService.getPaginationParams(),
    });
    return {
      data: plainToInstance(LanguageDto, languages),
      ...paginationService.getPaginationResult(),
    };
  }
  // Skills
  async getAllSkills(paginationDto: PaginationQueryFilter) {
    const totalCount = await this.prisma.skill.count();

    const paginationService = new PaginationService({
      itemsCount: totalCount,
      page: paginationDto.page,
      perPage: paginationDto.perPage,
    });

    const skills = await this.prisma.skill.findMany({
      ...paginationService.getPaginationParams(),
    });
    return { data: plainToInstance(SkillDto, skills), ...paginationService.getPaginationResult() };
  }

  // Locations
  async getAllLocations(paginationDto: PaginationQueryFilter) {
    const totalCount = await this.prisma.location.count();

    const paginationService = new PaginationService({
      itemsCount: totalCount,
      page: paginationDto.page,
      perPage: paginationDto.perPage,
    });

    const locations = await this.prisma.location.findMany({
      ...paginationService.getPaginationParams(),
    });
    return {
      data: plainToInstance(LocationDto, locations),
      ...paginationService.getPaginationResult(),
    };
  }
}
