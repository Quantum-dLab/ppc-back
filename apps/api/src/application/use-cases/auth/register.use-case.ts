import { ConflictException } from '@libs/shared/exceptions';
import { hashPassword, hashToken } from '@libs/shared/utils';
import { Inject, Injectable } from '@nestjs/common';
import { UserEntity, UserRole } from '../../../domain/entities/user.entity';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '../../../domain/repositories/user.repository.interface';
import { TokenService } from '../../../infrastructure/auth/token.service';
import { RegisterDto } from '../../dto/auth/register.dto';

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: UserEntity;
}

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(dto: RegisterDto): Promise<AuthResult> {
    console.log('here 1');
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) throw ConflictException('Email is already registered');
    console.log('here 2');
    const passwordHash = await hashPassword(dto.password);
    const user = await this.userRepository.create({
      email: dto.email,
      passwordHash,
      role: UserRole.USER,
    });
    console.log('here 1');
    const { accessToken, refreshToken } =
      this.tokenService.generateTokenPair(user);
    const updatedUser = await this.userRepository.update(user.uid, {
      refreshTokenHash: hashToken(refreshToken),
    });

    return { accessToken, refreshToken, user: updatedUser };
  }
}
