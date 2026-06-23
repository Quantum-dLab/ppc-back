import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  UpdateProductProps,
  ProductEntity,
} from 'apps/api/src/domain/entities/product.entity';
import {
  PRODUCT_REPOSITORY,
  type IProductRepository,
} from 'apps/api/src/domain/repositories/product.repository.interface';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(uid: string, dto: UpdateProductProps): Promise<ProductEntity> {
    const product = await this.productRepository.findByUid(uid);
    if (!product) throw new NotFoundException(`Product ${uid} not found`);

    product.update(dto);

    return this.productRepository.update(uid, product);
  }
}
