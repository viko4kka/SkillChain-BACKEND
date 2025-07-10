import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateOAuthLogin(profile: { linkedinId: string; name: string; email: string }) {
    let user = await this.usersService.findByLinkedinId(profile.linkedinId);

    if (!user) {
      user = await this.usersService.create(profile);
    }

    const payload = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);
    return { user, access_token };
  }
}