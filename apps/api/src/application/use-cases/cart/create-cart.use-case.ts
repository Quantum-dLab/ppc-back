import { Inject, Injectable } from '@nestjs/common';
import { CartEntity } from 'apps/api/src/domain/entities/cart.entity';
import {
  CreateCartProps,
  CART_REPOSITORY,
  type ICartRepository,
} from 'apps/api/src/domain/repositories/cart.repository.interface';

@Injectable()
export class CreateCartUseCase {
  constructor(
    @Inject(CART_REPOSITORY)
    private readonly cartRepository: ICartRepository,
  ) {}

  async execute(dto: CreateCartProps): Promise<CartEntity> {
    return this.cartRepository.create(dto);
  }
}
