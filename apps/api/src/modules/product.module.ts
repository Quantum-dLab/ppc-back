import { Module } from '@nestjs/common';

import { FileStorageModule } from '@libs/shared';
import {
  CreateProductUseCase,
  GetProductUseCase,
  ListProductsUseCase,
  UpdateProductUseCase,
} from '../application/use-cases/product';
import { GetProductBySlugUseCase } from '../application/use-cases/product/get-product-by-slug.use-case';
import { AdminProductsController } from '../controllers/products.controller';
import { UserProductsController } from '../controllers/user-products.controller';
import { PRODUCT_REPOSITORY } from '../domain/repositories/product.repository.interface';
import { PrismaProductRepository } from '../infrastructure/repositories/prisma-product.repository';

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
  controllers: [UserProductsController, AdminProductsController],
  exports: [PRODUCT_REPOSITORY, ...USE_CASES],
})
export class ProductModule {}
