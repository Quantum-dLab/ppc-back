import {
  CreateProductUseCase,
  GetProductUseCase,
  ListProductsUseCase,
  UpdateProductUseCase,
} from '../application/use-cases/product';

import type { CreateProductProps } from '../domain/repositories/product.repository.interface';
import type { UpdateProductProps } from '../domain/entities/product.entity';
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly createProduct: CreateProductUseCase,
    private readonly getProduct: GetProductUseCase,
    private readonly listProducts: ListProductsUseCase,
    private readonly updateProduct: UpdateProductUseCase,
  ) {}

  @Post()
  create(@Body() dto: CreateProductProps) {
    return this.createProduct.execute(dto);
  }

  @Get()
  list() {
    return this.listProducts.execute();
  }

  @Get(':uid')
  get(@Param('uid') uid: string) {
    return this.getProduct.execute(uid);
  }

  @Patch(':uid')
  update(@Param('uid') uid: string, @Body() dto: UpdateProductProps) {
    return this.updateProduct.execute(uid, dto);
  }
}
