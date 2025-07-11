import {
  Controller,
  Get,
  Req,
  Res,
  Query,
  Session,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';
import { randomUUID } from 'crypto';
import { LinkedinService } from './linkedin.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly linkedinService: LinkedinService) {}

  @Get('linkedin')
  async linkedinAuth(@Session() session: Record<string, any>, @Res() res: any) {
    const state = randomUUID();
    session.linkedinState = state;

    const redirectUrl =
      `https://www.linkedin.com/oauth/v2/authorization` +
      `?response_type=code` +
      `&client_id=${process.env.LINKEDIN_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent('http://localhost:3000/auth/linkedin/callback')}` +
      `&state=${state}` +
      `&scope=openid%20profile%20email`;

    return res.redirect(redirectUrl); // tu zostawiamy ręczny redirect
  }

  @Get('linkedin/callback')
  async linkedinCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Req() req: Request,
  ) {
    if (state !== req.session.linkedinState) {
      throw new BadRequestException('Invalid state parameter');
    }

    try {
      const accessToken = await this.linkedinService.exchangeCodeForToken(code);
      const user = await this.linkedinService.fetchUserInfo(accessToken);

      return {
        message: 'Zalogowano przez LinkedIn!',
        user,
      };
    } catch (error) {
      console.error('LinkedIn callback error:', error?.response?.data || error);
      throw new InternalServerErrorException('Błąd logowania przez LinkedIn.');
    }
  }
}