import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LinkedinService {
  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async exchangeCodeForToken(code: string): Promise<string> {
    const clientId = this.configService.get<string>('LINKEDIN_CLIENT_ID');
    const clientSecret = this.configService.get<string>('LINKEDIN_CLIENT_SECRET');
    const redirectUri = this.configService.get<string>('LINKEDIN_REDIRECT_URI');

    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', redirectUri!);
    params.append('client_id', clientId!);
    params.append('client_secret', clientSecret!);

    const response: AxiosResponse = await firstValueFrom(
      this.httpService.post(
        'https://www.linkedin.com/oauth/v2/accessToken',
        params.toString(),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      ),
    );

    return response.data.access_token;
  }

  async fetchUserInfo(accessToken: string): Promise<any> {
    const response: AxiosResponse = await firstValueFrom(
      this.httpService.get('https://api.linkedin.com/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    );

    return response.data;
  }
}
