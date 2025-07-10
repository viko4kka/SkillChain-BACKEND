import { PrismaService } from 'prisma/prisma.service';
import { UserDto } from './dto/users.dto';
import { plainToInstance } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly prisma: PrismaService
  ) {}

  async findByLinkedinId(linkedinId: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { linkedinId } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  async findAllUsers(): Promise<UserDto[]> {
    const users = await this.prisma.user.findMany();
    return plainToInstance(UserDto, users);
  }
}

