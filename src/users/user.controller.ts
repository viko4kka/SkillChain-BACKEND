import { Controller, Get, Patch, Param, Body, UsePipes, ParseIntPipe, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUsersQueryDto } from './dto/getUsers.dto';
import { UserDto } from './dto/users.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { UpdateUserProfileDto } from './dto/updateUserProfile.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  // LANGUAGES enpoints
  @Get(':id/languages')
  async getUserLanguages(@Param('id', ParseIntPipe) userId: number) {
    return await this.userService.getUserLanguages(userId);
  }

  // USERS endpoints
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
}
