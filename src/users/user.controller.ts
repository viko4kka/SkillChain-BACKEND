import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UsePipes,
  Session,
  UseGuards,
  ParseIntPipe,
  Post,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { GetUsersQueryDto } from './dto/getUsers.dto';
import { UserDto } from './dto/user.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { SessionData } from 'express-session';
import { UpdateUserSkillsDto, UserSkillInputDto } from './dto/updateUserSkills.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UpdateUserProfileDto } from './dto/updateUserProfile.dto';
import { LanguageDto } from 'src/common/dto/language.dto';
import { MessageResponseDto } from 'src/utlis/dto/messageResponse.dto';
import { UserSkillDto } from './dto/userSkill.dto';
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({
    description: 'Returns all languages for a user',
    type: [LanguageDto],
  })
  @Get(':id/languages')
  async getUserLanguages(@Param('id', ParseIntPipe) userId: number) {
    return await this.userService.getUserLanguages(userId);
  }

  @ApiOkResponse({
    description: 'Returns all users',
    type: [UserDto],
  })
  @Get()
  async getUsers(@Query() getUsersQueryDto: GetUsersQueryDto) {
    return await this.userService.getUsers(getUsersQueryDto);
  }

  @ApiOkResponse({
    description: 'Returns all UserSkill records from database',
    type: [UserSkillDto],
  })
  @Get('all-skills') // Move this BEFORE any :id routes
  async getAllUserSkills() {
    return this.userService.getAllUserSkills();
  }

  @ApiOkResponse({
    description: 'Returns one user by ID',
    type: UserDto,
  })
  @Get(':id')
  async findOneUser(@Param('id', ParseIntPipe) id: number) {
    const users = await this.userService.findOneUser(id);
    return users;
  }

  @ApiOkResponse({
    description: 'Updates user profile by ID',
    type: UpdateUserProfileDto,
  })
  @Patch(':id/profile')
  @UsePipes()
  updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserProfileDto,
  ) {
    return this.userService.updateProfile(id, updateUserDto);
  }

  @ApiOkResponse({
    description: 'Increments visits for a user by ID and type',
    type: MessageResponseDto,
  })
  @Post('visits-inc/:userId/:type')
  @UseGuards(AuthGuard)
  async incrementVisits(
    @Session() session: SessionData,
    @Param('userId', ParseIntPipe) userId: number,
    @Param('type') type: 'linkedin' | 'github',
  ) {
    if (session.user?.id === userId) {
      throw new BadRequestException('You cannot increment your own visits');
    }
    await this.userService.incrementVisits(userId, type);
    return { message: `${type} visits incremented` };
  }

  @ApiOkResponse({
    description: 'Sets skills for a user',
    type: [UserSkillInputDto],
  })
  @Post('skills')
  @UseGuards(AuthGuard)
  async setSkillsForUser(@Session() session: SessionData, @Body() body: UpdateUserSkillsDto) {
    const userId = session.user?.id;
    return this.userService.setSkillsForUser(userId!, body.skills);
  }

  @Get(':id/skills')
  async getUserSkills(@Param('id') id: string) {
    return this.userService.getSkillsForUser(Number(id));
  }
}
