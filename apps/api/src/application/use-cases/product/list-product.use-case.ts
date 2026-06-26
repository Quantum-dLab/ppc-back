import { PagingDto, PagingResponseDto } from '@libs/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ProductEntity } from 'apps/api/src/domain/entities/product.entity';
import {
  PRODUCT_REPOSITORY,
  type IProductRepository,
} from 'apps/api/src/domain/repositories/product.repository.interface';

@Injectable()
export class ListProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(dto: PagingDto): Promise<PagingResponseDto<ProductEntity>> {
    return await this.productRepository.findAll(dto);
  }
}
