import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { randomUUID } from 'crypto';

@Controller('auth')
export class AuthController {
  @Get('linkedin')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinAuth(@Req() req: Request, @Res() res: Response) {
    const state = randomUUID();
    req.session.linkedinState = state;
    res.redirect(
      `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=http://localhost:3000/auth/linkedin/callback&state=${state}&scope=r_emailaddress%20r_liteprofile`,
    );
  }

  @Get('linkedin/callback')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinAuthRedirect(@Req() req: Request) {
    return {
      message: 'Zalogowano przez LinkedIn!',
      user: req.user,
    };
  }
}
