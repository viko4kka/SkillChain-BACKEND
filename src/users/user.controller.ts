import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/users.dto';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({
    description: 'Returns all users',
    type: [UserDto],
  })
  @Get()
  findAllUsers(): Promise<UserDto[]> {
    return this.userService.findAllUsers();
  }
}
