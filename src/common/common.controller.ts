import { Controller, Get } from '@nestjs/common';
import { CommonService } from './common.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { SkillDto } from '../common/dto/skill.dto';
import { LanguageDto } from '../common/dto/language.dto';
import { LocationDto } from '../common/dto/location.dto';

@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}
  // LANGUAGES
  @ApiOkResponse({
    description: 'Returns all languages',
    type: [LanguageDto],
  })
  @Get('languages')
  async getAllLanguages() {
    return await this.commonService.getAllLanguages();
  }

  // LOCATIONS
  @ApiOkResponse({
    description: 'Returns all locations',
    type: [LocationDto],
  })
  @Get('locations')
  async getAllLocations() {
    return await this.commonService.getAllLocations();
  }
  // SKILLS
  @ApiOkResponse({
    description: 'Returns all skills',
    type: [SkillDto],
  })
  @Get('skills')
  async getAllSkills() {
    return await this.commonService.getAllSkills();
  }
}
