import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '../../../domain/repositories/user.repository.interface';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UpdateUserDto } from '../../dto/user/update-user.dto';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(uid: string, dto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findByUid(uid);
    if (!user) throw new NotFoundException(`User ${uid} not found`);

    user.update(dto);

    return this.userRepository.update(uid, user);
  }
}
