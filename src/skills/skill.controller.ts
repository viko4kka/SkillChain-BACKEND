import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { SkillService } from './skill.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { UserSkillDto } from './dto/userSkill.dto';
import { SessionData } from 'express-session';
import { AuthGuard } from '@nestjs/passport';

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

  @ApiOkResponse({
    description: 'Creates a new skill for the logged-in user',
    type: UserSkillDto,
  })
  @Post()
  @UseGuards(AuthGuard)
  async createSkill(
    @Session() session: SessionData, 
    @Body() createSkillDto: UserSkillDto) {
    const userId = session.user?.id;
    return this.skillService.createSkill(createSkillDto, userId!);
  }
}
