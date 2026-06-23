import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ProductEntity } from 'apps/api/src/domain/entities/product.entity';
import {
  PRODUCT_REPOSITORY,
  type IProductRepository,
} from 'apps/api/src/domain/repositories/product.repository.interface';

@Injectable()
export class GetProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(uid: string): Promise<ProductEntity> {
    const product = await this.productRepository.findByUid(uid);
    if (!product) throw new NotFoundException(`Product ${uid} not found`);
    return product;
  }
}
