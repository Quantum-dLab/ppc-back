import { compareToken, hashToken } from '@libs/shared/utils';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '../../../domain/repositories/user.repository.interface';
import { TokenService } from '../../../infrastructure/auth/token.service';
import { RefreshTokenDto } from '../../dto/auth/refresh-token.dto';
import { AuthResult } from './register.use-case';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(dto: RefreshTokenDto): Promise<AuthResult> {
    try {
      const payload = this.tokenService.verifyRefreshToken(dto.refreshToken);
      const user = await this.userRepository.findByUid(payload.sub);

      if (
        !user ||
        !user.isActive ||
        !user.refreshTokenHash ||
        !compareToken(dto.refreshToken, user.refreshTokenHash)
      ) {
        throw new UnauthorizedException(
          'Invalid refresh token or user is inactive',
        );
      }

      const { accessToken, refreshToken } = this.tokenService.generateTokenPair(
        user,
      );
      const updatedUser = await this.userRepository.update(user.uid, {
        refreshTokenHash: hashToken(refreshToken),
      });
      return {
        accessToken,
        refreshToken,
        user: updatedUser,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
