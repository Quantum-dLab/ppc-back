import { Inject, Injectable } from '@nestjs/common';
import { comparePassword } from '@libs/shared/utils';
import {
  AuthenticationFailedException,
  InvalidCredentialsException,
} from '@libs/shared/exceptions';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '../../../domain/repositories/user.repository.interface';
import { TokenService } from '../../../infrastructure/auth/token.service';
import { LoginDto } from '../../dto/auth/login.dto';
import { AuthResult } from './register.use-case';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(dto: LoginDto): Promise<AuthResult> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user || !user.passwordHash) throw InvalidCredentialsException();

    const isValid = await comparePassword(dto.password, user.passwordHash);
    if (!isValid) throw InvalidCredentialsException();
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
