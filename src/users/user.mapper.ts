// user.mapper.ts
import { User } from '@prisma/client';
import { UserDto } from './dto/users.dto';

export const userToDto = (user: User): UserDto => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  description: user.description ?? null,
  gitUrl: user.gitUrl ?? null,
  linkedinUrl: user.linkedinUrl ?? null,
});
