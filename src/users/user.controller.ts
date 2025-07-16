import { Controller, Get, Patch, Param, Body, UsePipes, ParseIntPipe } from '@nestjs/common';
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
