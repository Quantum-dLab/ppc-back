import { PagingResponseDto, PagingDto } from '@libs/shared';
import {
  Controller,
  Post,
  HttpStatus,
  Body,
  UploadedFile,
  Get,
  Param,
  Query,
  Patch,
  UseInterceptors,
} from '@nestjs/common';

import { ApiTags, ApiParam } from '@nestjs/swagger';

import { CreateProductDto } from '../application/dto/product/create-product.dto';
import {
  CreateProductUseCase,
  GetProductUseCase,
  ListProductsUseCase,
  UpdateProductUseCase,
} from '../application/use-cases/product';
import { ApiDoc } from '../common/decorators';
import { ApiCustomResponse } from '../common/types';
import { ProductEntity } from '../domain/entities/product.entity';
import { UpdateProductDto } from '../application/dto/product/update-product.dto';
import { GetProductBySlugUseCase } from '../application/use-cases/product/get-product-by-slug.use-case';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly createProduct: CreateProductUseCase,
    private readonly getProduct: GetProductUseCase,
    private readonly listProducts: ListProductsUseCase,
    private readonly updateProduct: UpdateProductUseCase,
    private readonly getBySlug: GetProductBySlugUseCase,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  @ApiDoc({
    summary: 'Create a new product',
    description: 'Creates a product with an optional image upload',
    body: CreateProductDto,
    multipart: true,
    successStatus: HttpStatus.CREATED,
    successDescription: 'Product created successfully',
    successResponse: ApiCustomResponse<Promise<ProductEntity>>,
    errors: [
      HttpStatus.BAD_REQUEST,
      HttpStatus.UNAUTHORIZED,
      HttpStatus.FORBIDDEN,
      {
        status: HttpStatus.CONFLICT,
        description: 'Product with this slug already exists',
      },
    ],
  })
  async create(
    @Body() dto: CreateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<ProductEntity> {
    return await this.createProduct.execute(dto, file);
  }

  @Get()
  @ApiDoc({
    summary: 'Get all products',
    successResponse: ApiCustomResponse<PagingResponseDto<ProductEntity>>,
    isPaginated: true,
    successDescription: 'Products retrieved successfully',
    errors: [HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN],
  })
  async list(
    @Query() dto: PagingDto,
  ): Promise<PagingResponseDto<ProductEntity>> {
    return await this.listProducts.execute(dto);
  }

  @Get('by-slug/:slug')
  @ApiDoc({
    summary: 'Get product by slug',
    successResponse: ApiCustomResponse<Promise<ProductEntity>>,
    successDescription: 'Product retrieved successfully',
    errors: [HttpStatus.NOT_FOUND, HttpStatus.UNAUTHORIZED],
  })
  async getProductBySlug(@Param('slug') slug: string): Promise<ProductEntity> {
    return await this.getBySlug.execute(slug);
  }

  @Get(':uid')
  @ApiDoc({
    summary: 'Get product by uid',
    successResponse: ApiCustomResponse<Promise<ProductEntity>>,
    successDescription: 'Product retrieved successfully',
    errors: [
      HttpStatus.UNAUTHORIZED,
      HttpStatus.FORBIDDEN,
      HttpStatus.NOT_FOUND,
    ],
  })
  @ApiParam({
    name: 'uid',
    description: 'Product unique identifier',
    example: 'a1b2c3-uuid',
  })
  async get(@Param('uid') uid: string): Promise<ProductEntity> {
    return await this.getProduct.execute(uid);
  }

  @Patch(':uid')
  @ApiDoc({
    summary: 'Update a product',
    description:
      'All fields are optional. Only provided fields will be updated.',
    body: UpdateProductDto,
    multipart: true,
    successResponse: ApiCustomResponse<ProductEntity>,
    successStatus: HttpStatus.OK,
    successDescription: 'Product updated successfully',
    errors: [
      HttpStatus.BAD_REQUEST,
      HttpStatus.UNAUTHORIZED,
      HttpStatus.FORBIDDEN,
      HttpStatus.NOT_FOUND,
      { status: HttpStatus.CONFLICT, description: 'Slug already exists' },
    ],
  })
  async update(
    @Param('uid') uid: string,
    @Body() dto: UpdateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.updateProduct.execute(uid, dto, file);
  }
}
