import { Inject, Injectable } from '@nestjs/common';
import { hashPassword } from '@libs/shared/utils';
import { ConflictException } from '@libs/shared/exceptions';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '../../../domain/repositories/user.repository.interface';
import { UserEntity, UserRole } from '../../../domain/entities/user.entity';
import { TokenService } from '../../../infrastructure/auth/token.service';
import { RegisterDto } from '../../dto/auth/register.dto';

export interface AuthResult {
  accessToken: string;
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
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) throw ConflictException('Email is already registered');

    const passwordHash = await hashPassword(dto.password);
    const user = await this.userRepository.create({
      email: dto.email,
      passwordHash,
      role: UserRole.USER,
    });

    return { accessToken: this.tokenService.signAccessToken(user), user };
  }
}
