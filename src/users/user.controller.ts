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
import { AuthGuard } from '../auth/guards/auth.guard';
import { UpdateUserProfileDto } from './dto/updateUserProfile.dto';
import { SkillDto } from 'src/users/dto/skill.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({
    description: 'Returns all skills',
    type: [SkillDto],
  })
  @Get('/skills')
  async getAllSkills() {
    return await this.userService.getAllSkills();
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
    description: 'Returns one user by ID',
    type: [UserDto],
  })
  @Get(':id')
  async findOneUser(@Param('id', ParseIntPipe) id: number) {
    const users = await this.userService.findOneUser(id);
    return users;
  }

  @ApiOkResponse({
    description: 'Updates user profile by ID',
    type: [UpdateUserProfileDto],
  })
  @Patch(':id/profile')
  @UsePipes()
  updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserProfileDto,
  ) {
    return this.userService.updateProfile(id, updateUserDto);
  }

  @Post(':id/language/:languageId')
  async assignLanguageToUser(
    @Param('id', ParseIntPipe) userId: number,
    @Param('languageId', ParseIntPipe) languageId: number,
  ) {
    await this.userService.assignLanguageToUser(userId, languageId);
    return { message: 'Language assigned to user successfully' };
  }

  @Get(':id/languages')
  async getUserLanguages(@Param('id', ParseIntPipe) userId: number) {
    return await this.userService.getUserLanguages(userId);
  }

  @Post('visits-inc/:userId/:type')
  @UseGuards(AuthGuard)
  async incrementVisits(
    @Session() session: SessionData,
    @Param('userId', ParseIntPipe) userId: number,
    @Param('type') type: 'linkedin' | 'github',
  ) {
    if (session.user?.id === userId) {
      throw new BadRequestException({ message: 'You cannot increment your own visits' });
    }
    await this.userService.incrementVisits(userId, type);
    return { message: `${type} visits incremented` };
  }
}
