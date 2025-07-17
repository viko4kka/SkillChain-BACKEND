import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UsePipes,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { GetUsersQueryDto } from './dto/get-users.dto';
import { UserDto } from './dto/users.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { UpdateUserProfileDto } from './dto/update-use-profile.dto';
import { SkillDto } from 'src/users/dto/skill.dto';
import { LanguageDto } from 'src/languages/dto/language.dto';

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

  // LANGUAGES enpoints
  @Post(':id/language/:languageId')
  async assignLanguageToUser(
    @Param('id', ParseIntPipe) userId: number,
    @Param('languageId', ParseIntPipe) languageId: number,
  ) {
    await this.userService.assignLanguageToUser(userId, languageId);
    return { message: 'Language assigned to user successfully' };
  }
  @ApiOkResponse({
    description: 'Returns all languages',
    type: [LanguageDto],
  })
  @Get('languages')
  async getAllLanguages() {
    return await this.userService.getAllLanguages();
  }
  @Get(':id/languages')
  async getUserLanguages(@Param('id', ParseIntPipe) userId: number) {
    return await this.userService.getUserLanguages(userId);
  }
}
