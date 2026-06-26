import { PagingDto, PagingResponseDto } from '@libs/shared';
import { Inject, Injectable } from '@nestjs/common';
import { CartEntity } from 'apps/api/src/domain/entities/cart.entity';
import {
  CART_REPOSITORY,
  type ICartRepository,
} from 'apps/api/src/domain/repositories/cart.repository.interface';

@Injectable()
export class ListCartsUseCase {
  constructor(
    @Inject(CART_REPOSITORY)
    private readonly cartRepository: ICartRepository,
  ) {}

  async execute(dto: PagingDto): Promise<PagingResponseDto<CartEntity>> {
    return await this.cartRepository.findAll(dto);
  }
}
