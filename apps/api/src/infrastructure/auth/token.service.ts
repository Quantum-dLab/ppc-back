import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserEntity, UserRole } from '../../domain/entities/user.entity';

export enum JwtTokenType {
  ACCESS = 'access',
  REFRESH = 'refresh',
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  tokenType: JwtTokenType;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  signAccessToken(user: UserEntity): string {
    const payload: JwtPayload = {
      sub: user.uid,
      email: user.email,
      role: user.role,
      tokenType: JwtTokenType.ACCESS,
    };
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('jwt.expiresIn'),
    });
  }

  signRefreshToken(user: UserEntity): string {
    const payload: JwtPayload = {
      sub: user.uid,
      email: user.email,
      role: user.role,
      tokenType: JwtTokenType.REFRESH,
    };
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('jwt.refreshExpiresIn'),
    });
  }

  generateTokenPair(user: UserEntity): TokenPair {
    return {
      accessToken: this.signAccessToken(user),
      refreshToken: this.signRefreshToken(user),
    };
  }

  verifyRefreshToken(token: string): JwtPayload {
    const payload = this.jwtService.verify<JwtPayload>(token);
    if (payload.tokenType !== JwtTokenType.REFRESH) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return payload;
  }
}
