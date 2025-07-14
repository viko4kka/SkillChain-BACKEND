import { Controller, Get, Patch, Param, Body, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/users.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { UpdateUserProfileDto } from './dto/update-use-profile.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({
    description: 'Returns all users',
    type: [UserDto],
  })
  @Get()
  async findAllUsers() {
    const users = await this.userService.findAllUsers();
    return users;
  }

  @ApiOkResponse({
    description: 'Returns one user by ID',
    type: [UserDto],
  })
  @Get(':id')
  async findOneUser(@Param('id') id: string) {
    const users = await this.userService.findOneUser(+id);
    return users;
  }

  @Patch(':id/profile')
  @UsePipes()
  updateProfile(@Param('id') id: string, @Body() updateUserDto: UpdateUserProfileDto) {
    return this.userService.updateProfile(+id, updateUserDto);
  }
}
