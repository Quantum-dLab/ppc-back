import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '../../../domain/repositories/user.repository.interface';
import { UserEntity } from '../../../domain/entities/user.entity';

@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(uid: string): Promise<UserEntity> {
    const user = await this.userRepository.findByUid(uid);
    if (!user) throw new NotFoundException(`User ${uid} not found`);
    return user;
  }
}
