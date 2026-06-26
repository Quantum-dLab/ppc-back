import { Module } from '@nestjs/common';

import {
  CreateProductUseCase,
  GetProductUseCase,
  ListProductsUseCase,
  UpdateProductUseCase,
} from '../application/use-cases/product';
import { PRODUCT_REPOSITORY } from '../domain/repositories/product.repository.interface';
import { PrismaProductRepository } from '../infrastructure/repositories/prisma-product.repository';
import { ProductController } from '../controllers/product/products.controller';
import { FileStorageModule } from '@libs/shared';
import { GetProductBySlugUseCase } from '../application/use-cases/product/get-product-by-slug.use-case';

const USE_CASES = [
  CreateProductUseCase,
  GetProductUseCase,
  ListProductsUseCase,
  UpdateProductUseCase,
  GetProductBySlugUseCase,
];

@Module({
  imports: [FileStorageModule],
  providers: [
    { provide: PRODUCT_REPOSITORY, useClass: PrismaProductRepository },
    ...USE_CASES,
  ],
  controllers: [ProductController],
  exports: [...USE_CASES],
})
export class ProductModule {}
