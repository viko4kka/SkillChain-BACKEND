import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { SkillService } from './skill.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { UserSkillDto } from './dto/userSkill.dto';

@Controller('skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @ApiOkResponse({
    description: 'Returns all skills for a user',
    type: [UserSkillDto],
  })
  @Get('/user/:id')
  async getUserSkills(@Param('id', ParseIntPipe) userId: number) {
    return this.skillService.getUserSkills(userId);
  }
}
