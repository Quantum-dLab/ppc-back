import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CartEntity, UpdateCartProps } from 'apps/api/src/domain/entities/cart.entity';
import {
  CART_REPOSITORY,
  type ICartRepository,
} from 'apps/api/src/domain/repositories/cart.repository.interface';

@Injectable()
export class UpdateCartUseCase {
  constructor(
    @Inject(CART_REPOSITORY)
    private readonly cartRepository: ICartRepository,
  ) {}

  async execute(uid: string, dto: UpdateCartProps): Promise<CartEntity> {
    const cart = await this.cartRepository.findByUid(uid);
    if (!cart) throw new NotFoundException(`Cart ${uid} not found`);

    cart.update(dto);

    return this.cartRepository.update(uid, dto);
  }
}
