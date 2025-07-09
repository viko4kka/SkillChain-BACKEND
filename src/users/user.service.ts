import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UserService {
  
  constructor(private readonly prisma: PrismaService) {}
  findAllUsers() {
    return this.prisma.user.findMany();
  }

//   findOne(id: number) {
//     return null;
//   }

//   create(data: any) {
//     return data;
//   }

//   update(id: number, data: any) {
//     return { id, ...data };
//   }

//   remove(id: number) {
//     return { deleted: true };
//   }
}