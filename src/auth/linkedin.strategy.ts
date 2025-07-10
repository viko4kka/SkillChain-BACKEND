import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';
import { Strategy, VerifyCallback } from 'passport-openidconnect';

@Injectable()
export class LinkedinStrategy extends PassportStrategy(Strategy, 'linkedin') {
  constructor() {
    super({
      issuer: 'https://www.linkedin.com',
      authorizationURL: 'https://www.linkedin.com/oauth/v2/authorization',
      tokenURL: 'https://www.linkedin.com/oauth/v2/accessToken',
      userInfoURL: 'https://api.linkedin.com/v2/me',
      clientID: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      callbackURL: 'http://localhost:3000/auth/linkedin/callback',
      scope: ['openid', 'profile', 'email', 'w_member_social'],
      responseType: 'code',
      //passReqToCallback: false,
      //skipUserProfile: false,
    });
  }

   async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    console.log('✅ VALIDATE HIT');
    console.log('👤 LinkedIn profile:', profile);

    const user = {
      linkedinId: profile.id,
      name: `${profile.name?.givenName ?? ''} ${profile.name?.familyName ?? ''}`,
      email: profile.emails?.[0]?.value ?? null,
      accessToken,
    };

    done(null, user);
  }
}
