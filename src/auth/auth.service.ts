import { Injectable } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateOAuthLogin(profile: { linkedinId: string; name: string; email: string }) {
    let user = await this.usersService.findByLinkedinId(profile.linkedinId);

    if (!user) {
      const [firstName, ...lastNameParts] = profile.name.split(' ');
      const lastName = lastNameParts.join(' ');

      const createUserInput = {
        linkedinId: profile.linkedinId,
        firstName,
        lastName,
        email: profile.email,
      };

      user = await this.usersService.create(createUserInput);
    }

    const payload = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);

    return { user, access_token };
  }
}
