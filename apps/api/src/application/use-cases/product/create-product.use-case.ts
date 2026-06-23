import { Injectable, Inject } from '@nestjs/common';
import { ProductEntity } from 'apps/api/src/domain/entities/product.entity';
import {
  CreateProductProps,
  PRODUCT_REPOSITORY,
} from 'apps/api/src/domain/repositories/product.repository.interface';
import type { IProductRepository } from 'apps/api/src/domain/repositories/product.repository.interface';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(dto: CreateProductProps): Promise<ProductEntity> {
    return this.productRepository.create(dto);
  }
}
