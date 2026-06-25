import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity, UserRole } from '../../domain/entities/user.entity';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  signAccessToken(user: UserEntity): string {
    const payload: JwtPayload = {
      sub: user.uid,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }
}
