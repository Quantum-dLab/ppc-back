import { Inject, Injectable } from '@nestjs/common';
import { AuthenticationFailedException } from '@libs/shared/exceptions';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '../../../domain/repositories/user.repository.interface';
import { UserEntity } from '../../../domain/entities/user.entity';

@Injectable()
export class ValidateUserByIdUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(uid: string): Promise<UserEntity> {
    const user = await this.userRepository.findByUid(uid);
    if (!user || !user.isActive) throw AuthenticationFailedException();
    return user;
  }
}
