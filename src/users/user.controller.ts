import { Controller, Get, Patch, Param, Body, UsePipes, ParseIntPipe, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/users.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { UpdateUserProfileDto } from './dto/update-use-profile.dto';
import { LanguageDto } from 'src/languages/dto/language.dto';
import { LocationDto } from './dto/location.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
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
  // LOCATIONS enpoints
  @Post(':id/location/:locationId')
  async assignLocationToUser(
    @Param('id', ParseIntPipe) userId: number,
    @Param('locationId', ParseIntPipe) locationId: number,
  ) {
    await this.userService.assignLocationToUser(userId, locationId);
    return { message: 'Location assigned to user successfully' };
  }
  @ApiOkResponse({
    description: 'Returns all locations',
    type: [LocationDto],
  })
  @Get('locations')
  async getAllLocations() {
    return await this.userService.getAllLocations();
  }
  @Get(':id/locations')
  async getUserLocations(@Param('id', ParseIntPipe) userId: number) {
    return await this.userService.getUserLocations(userId);
  }

  // USERS endpoints
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
