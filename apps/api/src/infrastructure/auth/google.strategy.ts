import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

export interface GoogleProfile {
  googleId: string;
  email: string;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super({
      // Fall back to placeholders so the app can boot before Google OAuth
      // credentials are provisioned; passport-google-oauth20 throws at
      // construction time if these are empty. The /auth/google routes will
      // simply fail until real values are set in the environment.
      clientID: configService.get<string>('google.clientId') || 'not-configured',
      clientSecret:
        configService.get<string>('google.clientSecret') || 'not-configured',
      callbackURL:
        configService.get<string>('google.callbackUrl') || 'not-configured',
      scope: ['email', 'profile'],
    });
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): void {
    const email = profile.emails?.[0]?.value;
    const googleProfile: GoogleProfile = {
      googleId: profile.id,
      email: email as string,
    };
    done(null, googleProfile);
  }
}
