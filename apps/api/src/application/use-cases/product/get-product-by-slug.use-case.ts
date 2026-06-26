import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductEntity } from 'apps/api/src/domain/entities/product.entity';
import {
  PRODUCT_REPOSITORY,
  type IProductRepository,
} from 'apps/api/src/domain/repositories/product.repository.interface';

@Injectable()
export class GetProductBySlugUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(slug: string): Promise<ProductEntity> {
    const product = await this.productRepository.findBySlug(slug);
    if (!product)
      throw new NotFoundException(`Product with slug "${slug}" not found`);
    return product;
  }
}
