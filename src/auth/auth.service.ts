import { Injectable } from '@nestjs/common';
import { UserService } from '../users/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
  ) {}

  async validateOAuthLogin(profile: { 
    linkedinId: string;
    firstName: string;
    lastName: string;
    email: string;
    imgUrl?: string;
   }) {
    let user = await this.usersService.findByLinkedinId(profile.linkedinId);

    if (!user) {

      const createUserInput = {
        linkedinId: profile.linkedinId,
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        imgUrl: profile.imgUrl ?? null,
      };

      user = await this.usersService.create(createUserInput);
    }

    return { user };
  }
}
