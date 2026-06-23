import { Inject, Injectable } from '@nestjs/common';
import { CartItemEntity } from 'apps/api/src/domain/entities/cart-item.entity';
import {
  CART_ITEM_REPOSITORY,
  type ICartItemRepository,
} from 'apps/api/src/domain/repositories/cart-item.repository.interface';

@Injectable()
export class ListCartItemUseCase {
  constructor(
    @Inject(CART_ITEM_REPOSITORY)
    private readonly cartItemRepository: ICartItemRepository,
  ) {}

  async execute(): Promise<CartItemEntity[]> {
    return this.cartItemRepository.findAll();
  }
}
