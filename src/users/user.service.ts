import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserDto } from './dto/users.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateUserProfileDto } from './dto/update-use-profile.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllUsers(): Promise<UserDto[]> {
    const users = await this.prisma.user.findMany();
    return plainToInstance(UserDto, users);
  }

  async updateProfile(id: number, data: UpdateUserProfileDto) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }
}
