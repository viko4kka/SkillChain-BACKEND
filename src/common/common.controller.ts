import { Controller, Get, Query } from '@nestjs/common';
import { CommonService } from './common.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { SkillDto } from '../common/dto/skill.dto';
import { LocationDto } from '../common/dto/location.dto';
import { PaginatedLanguagesDto } from './dto/pagingLanguages';
import { PaginationQueryFilter } from 'src/utlis/dto/pagination.dto';

@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}
  // LANGUAGES
  @ApiOkResponse({
    description: 'Returns all languages',
    type: PaginatedLanguagesDto,
  })
  @Get('languages')
  async getAllLanguages(@Query() paginationQuery: PaginationQueryFilter) {
    return await this.commonService.getAllLanguages(paginationQuery);
  }
  // SKILLS
  @ApiOkResponse({
    description: 'Returns all skills',
    type: SkillDto,
  })
  @Get('skills')
  async getAllSkills(@Query() paginationQuery: PaginationQueryFilter) {
    return await this.commonService.getAllSkills(paginationQuery);
  }
  // LOCATIONS
  @ApiOkResponse({
    description: 'Returns all locations',
    type: LocationDto,
  })
  @Get('locations')
  async getAllLocations(@Query() paginationQuery: PaginationQueryFilter) {
    return await this.commonService.getAllLocations(paginationQuery);
  }
}
