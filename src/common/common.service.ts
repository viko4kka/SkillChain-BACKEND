import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { SkillDto } from 'src/common/dto/skill.dto';
import { LanguageDto } from '../common/dto/language.dto';
import { LocationDto } from '../common/dto/location.dto';

const DEFAULT_PAGE_SIZE = 5;

@Injectable()
export class CommonService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllLanguages(): Promise<LanguageDto[]> {
    const languages = await this.prisma.language.findMany();
    return plainToInstance(LanguageDto, languages);
  }
  // Skills
  async getAllSkills(): Promise<SkillDto[]> {
    const skills = await this.prisma.skill.findMany();
    return plainToInstance(SkillDto, skills);
  }

  // LOCATIONs
  async getAllLocations(): Promise<LocationDto[]> {
    const locations = await this.prisma.location.findMany();
    return plainToInstance(LocationDto, locations);
  }
}
