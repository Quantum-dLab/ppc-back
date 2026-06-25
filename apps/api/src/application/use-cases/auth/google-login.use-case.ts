import { Inject, Injectable } from '@nestjs/common';
import { AuthenticationFailedException } from '@libs/shared/exceptions';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '../../../domain/repositories/user.repository.interface';
import { UserRole } from '../../../domain/entities/user.entity';
import { TokenService } from '../../../infrastructure/auth/token.service';
import { GoogleProfile } from '../../../infrastructure/auth/google.strategy';
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

    const updated = await this.userRepository.update(user.uid, {
      lastLoginAt: new Date(),
    });

    return {
      accessToken: this.tokenService.signAccessToken(updated),
      user: updated,
    };
  }
}
