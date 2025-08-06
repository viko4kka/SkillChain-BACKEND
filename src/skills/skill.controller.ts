import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { SkillService } from './skill.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { UserSkillDto } from './dto/userSkill.dto';
import { SessionData } from 'express-session';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UpdateUserSkillDto } from './dto/updateUserSkill.dto';
import { MessageResponseDto } from 'src/utlis/dto/messageResponse.dto';
import { UserSkillWithConfirmations } from '../users/dto/UserSkillWithConfirmations.dto';

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
    description: 'Returns all skills for a user with confirmations',
    type: [UserSkillWithConfirmations],
  })
  @Get('/user/:id/confirmations')
  async getUserSkillsWithConfirmations(
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<UserSkillWithConfirmations[]> {
    return this.skillService.getUserSkillsWithConfirmations(userId);
  }

  @ApiOkResponse({
    description: 'Creates a new skill for the logged-in user',
    type: UserSkillDto,
  })
  @Post()
  @UseGuards(AuthGuard)
  async createSkill(@Session() session: SessionData, @Body() createSkillDto: UserSkillDto) {
    const userId = session.user?.id;
    return this.skillService.createSkill(createSkillDto, userId!);
  }

  @ApiOkResponse({
    description: 'Updates a skill for the logged-in user',
    type: UserSkillDto,
  })
  @Patch(':id')
  @UseGuards(AuthGuard)
  async updateSkill(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateUserSkillDto,
    @Session() session: SessionData,
  ) {
    const userId = session.user?.id;
    return this.skillService.updateSkill(userId!, id, updateDto);
  }

  @ApiOkResponse({
    description: 'Deletes a skill for the logged-in user',
    type: MessageResponseDto,
  })
  @Delete('/:skillId')
  @UseGuards(AuthGuard)
  async deleteSkill(
    @Param('skillId', ParseIntPipe) skillId: number,
    @Session() session: SessionData,
  ) {
    const userId = session.user?.id;
    await this.skillService.deleteSkill(userId!, skillId);
    return { message: 'Skill deleted successfully' };
  }
}
