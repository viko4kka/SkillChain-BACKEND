import { Controller, Get, Query } from '@nestjs/common';
import { CommonService } from './common.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { PaginatedLanguagesDto } from './dto/paginatedLanguages.dto';
import { PaginatedSkillsDto } from './dto/paginatedSkills.dto';
import { PaginatedLocationsDto } from './dto/paginatedLocations.dto';
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
    type: PaginatedSkillsDto,
  })
  @Get('skills')
  async getAllSkills(@Query() paginationQuery: PaginationQueryFilter) {
    return await this.commonService.getAllSkills(paginationQuery);
  }
  // LOCATIONS
  @ApiOkResponse({
    description: 'Returns all locations',
    type: PaginatedLocationsDto,
  })
  @Get('locations')
  async getAllLocations(@Query() paginationQuery: PaginationQueryFilter) {
    return await this.commonService.getAllLocations(paginationQuery);
  }
}
