import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import axios from 'axios';

@Controller('auth')
export class AuthController {
  @Get('linkedin')
  async linkedinAuth(@Req() req: Request, @Res() res: Response) {
    const state = randomUUID();
    req.session.linkedinState = state;

    const redirectUrl = `https://www.linkedin.com/oauth/v2/authorization` +
      `?response_type=code` +
      `&client_id=${process.env.LINKEDIN_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent('http://localhost:3000/auth/linkedin/callback')}` +
      `&state=${state}` +
      `&scope=openid%20profile%20email`;

    return res.redirect(redirectUrl);
  }

  @Get('linkedin/callback')
  async linkedinCallback(@Req() req: Request, @Res() res: Response) {
    const { code, state } = req.query;

    // 1. Sprawdź state
    if (state !== req.session.linkedinState) {
      return res.status(400).send('Invalid state parameter');
    }

    try {
      // 2. Wymień code na access token
      const tokenResponse = await axios.post(
        'https://www.linkedin.com/oauth/v2/accessToken',
        new URLSearchParams({
          grant_type: 'authorization_code',
          code: code as string,
          redirect_uri: 'http://localhost:3000/auth/linkedin/callback',
          client_id: process.env.LINKEDIN_CLIENT_ID!,
          client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      );

      const accessToken = tokenResponse.data.access_token;

      // 3. Pobierz dane użytkownika z LinkedIn (OIDC userinfo endpoint)
      const userInfoResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const user = userInfoResponse.data;

      console.log('LinkedIn user:', user);

      // 4. Tutaj możesz zalogować użytkownika do sesji lub zwrócić token
      return res.json({
        message: 'Zalogowano przez LinkedIn!',
        user,
      });
    } catch (error) {
      console.error('LinkedIn callback error:', error?.response?.data || error);
      return res.status(500).send('Błąd logowania przez LinkedIn.');
    }
  }
}