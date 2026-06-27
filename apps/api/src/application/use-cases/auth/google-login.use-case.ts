import { AuthenticationFailedException } from '@libs/shared/exceptions';
import { hashToken } from '@libs/shared/utils';
import { Inject, Injectable } from '@nestjs/common';
import { UserRole } from '../../../domain/entities/user.entity';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '../../../domain/repositories/user.repository.interface';
import { GoogleProfile } from '../../../infrastructure/auth/google.strategy';
import { TokenService } from '../../../infrastructure/auth/token.service';
import { AuthResult } from './register.use-case';

@Injectable()
export class GoogleLoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(profile: GoogleProfile): Promise<AuthResult> {
    let user = await this.userRepository.findByGoogleId(profile.googleId);

    if (!user) {
      const existingByEmail = await this.userRepository.findByEmail(
        profile.email,
      );
      user = existingByEmail
        ? await this.userRepository.update(existingByEmail.uid, {
            googleId: profile.googleId,
          })
        : await this.userRepository.create({
            email: profile.email,
            googleId: profile.googleId,
            role: UserRole.USER,
          });
    }

    if (!user.isActive) throw AuthenticationFailedException();

    const { accessToken, refreshToken } =
      this.tokenService.generateTokenPair(user);
    const updated = await this.userRepository.update(user.uid, {
      lastLoginAt: new Date(),
      refreshTokenHash: hashToken(refreshToken),
    });

    return {
      accessToken,
      refreshToken,
      user: updated,
    };
  }
}
