import { Module } from '@nestjs/common';

import {
  CreateProductUseCase,
  GetProductUseCase,
  ListProductsUseCase,
  UpdateProductUseCase,
} from '../application/use-cases/product';
import { PRODUCT_REPOSITORY } from '../domain/repositories/product.repository.interface';
import { PrismaProductRepository } from '../infrastructure/repositories/prisma-product.repository';
import { ProductsController } from '../controllers/product.controller';

const USE_CASES = [
  CreateProductUseCase,
  GetProductUseCase,
  ListProductsUseCase,
  UpdateProductUseCase,
];

@Module({
  providers: [
    { provide: PRODUCT_REPOSITORY, useClass: PrismaProductRepository },
    ...USE_CASES,
  ],
  controllers: [ProductsController],
  exports: [...USE_CASES],
})
export class ProductModule {}
