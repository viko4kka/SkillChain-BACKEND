//user.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserDto } from './dto/users.dto';
import { userToDto } from './user.mapper';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllUsers(): Promise<UserDto[]> {
    const users = await this.prisma.user.findMany();
    return users.map(userToDto);
  }
}
