import {
  Controller,
  Get,
  Res,
  Query,
  Session,
  UseGuards,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
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
  async linkedinAuth(@Session() session: Record<string, any>, @Res() res: any) {
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
    @Session() session: Record<string, any>,
  ) {
    if (state !== session.linkedinState) {
      throw new BadRequestException('Invalid state parameter');
    }

    try {
      const accessToken = await this.linkedinService.exchangeCodeForToken(code);
      const userInfo = await this.linkedinService.fetchUserInfo(accessToken);

      console.log('LinkedIn user info:', userInfo);

      const { user } = await this.authService.validateOAuthLogin({
        linkedinId: userInfo.sub,
        firstName: userInfo.given_name,
        lastName: userInfo.family_name,
        email: userInfo.email,
        imgUrl: userInfo.picture,
      });

      session.user = user;

      return {
        message: 'Zalogowano przez LinkedIn!',
        user,
      };
    } catch (error) {
      console.error('LinkedIn callback error:', error?.response?.data || error);
      throw new InternalServerErrorException('Błąd logowania przez LinkedIn.');
    }
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@Session() session: Record<string, any>) {
    if (!session.user) {
      throw new BadRequestException('Brak zalogowanego użytkownika');
    }
    return session.user;
  }
}
