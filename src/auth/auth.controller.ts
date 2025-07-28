import {
  Controller,
  Get,
  Res,
  Query,
  Post,
  Session,
  UseGuards,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { SessionData } from 'express-session';
import { Session as ExpressSession } from 'express-session';
import { Response } from 'express';
import { LinkedInUserInfo } from './interfaces/linkedinUserInfo.interface';
import { AuthGuard } from './guards/auth.guard';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { LinkedinService } from './linkedin.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly linkedinService: LinkedinService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  @Get('linkedin')
  linkedinAuth(@Session() session: SessionData, @Res() res: Response) {
    const clientId = this.configService.get<string>('LINKEDIN_CLIENT_ID');
    const redirectUri = this.configService.get<string>('LINKEDIN_REDIRECT_URI');
    const state = randomUUID();
    session.linkedinState = state;

    const redirectUrl =
      `https://www.linkedin.com/oauth/v2/authorization` +
      `?response_type=code` +
      `&client_id=${clientId}` +
      `&redirect_uri=${redirectUri}` +
      `&state=${state}` +
      `&scope=openid%20profile%20email`;

    return res.redirect(redirectUrl);
  }

  @Get('linkedin/callback')
  async linkedinCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Session() session: SessionData,
    @Res() res: Response,
  ) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000/';

    if (state !== session.linkedinState) {
      throw new BadRequestException('Invalid state parameter');
    }

    try {
      const accessToken = await this.linkedinService.exchangeCodeForToken(code);
      const userInfo: LinkedInUserInfo = await this.linkedinService.fetchUserInfo(accessToken);

      const { user } = await this.authService.validateOAuthLogin({
        linkedinId: userInfo.sub,
        firstName: userInfo.given_name,
        lastName: userInfo.family_name,
        email: userInfo.email,
        imgUrl: userInfo.picture,
      });

      session.user = user;

      return res.redirect(frontendUrl + '/profile/' + user.id);
    } catch (error) {
      console.error('LinkedIn callback error:', error);
      throw new InternalServerErrorException('LinkedIn login error');
    }
  }

  @Get('me')
  @UseGuards(AuthGuard)
  getMe(@Session() session: SessionData) {
    return session.user;
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  logout(@Session() session: ExpressSession & SessionData, @Res() res: Response) {
    session.destroy(err => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.clearCookie('connect.sid');
      return res.json({ message: 'Logged out successfully' });
    });
  }
}
