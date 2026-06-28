import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserEntity } from '../../domain/entities/user.entity';
import { ValidateUserByIdUseCase } from '../../application/use-cases/auth/validate-user-by-id.use-case';
import { JwtPayload, JwtTokenType } from './token.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly validateUserById: ValidateUserByIdUseCase,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('jwt.secret'),
    });
  }

  async validate(payload: JwtPayload): Promise<UserEntity> {
    if (payload.tokenType !== JwtTokenType.ACCESS) {
      throw new UnauthorizedException('Invalid access token');
    }
    return this.validateUserById.execute(payload.sub);
  }
}
