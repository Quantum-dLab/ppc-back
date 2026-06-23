import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CartItemEntity, UpdateCartItemProps } from 'apps/api/src/domain/entities/cart-item.entity';
import {
  CART_ITEM_REPOSITORY,
  type ICartItemRepository,
} from 'apps/api/src/domain/repositories/cart-item.repository.interface';

@Injectable()
export class UpdateCartItemUseCase {
  constructor(
    @Inject(CART_ITEM_REPOSITORY)
    private readonly cartItemRepository: ICartItemRepository,
  ) {}

  async execute(uid: string, dto: UpdateCartItemProps): Promise<CartItemEntity> {
    const item = await this.cartItemRepository.findByUid(uid);
    if (!item) throw new NotFoundException(`CartItem ${uid} not found`);

    item.update(dto);

    return this.cartItemRepository.update(uid, dto);
  }
}
