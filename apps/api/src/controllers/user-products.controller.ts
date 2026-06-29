import { PagingDto, PagingResponseDto } from '@libs/shared';
import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common';
import { ApiParam, ApiQuery } from '@nestjs/swagger';
import { ProductResponseDto } from '../application/dto/product/product-response.dto';
import {
  GetProductUseCase,
  ListProductsUseCase,
} from '../application/use-cases/product';
import { GetProductBySlugUseCase } from '../application/use-cases/product/get-product-by-slug.use-case';
import { ApiDoc } from '../common/decorators';
import { UserPanel } from '../common/decorators/swagger.decorator';

@UserPanel('Products')
@Controller('user/products')
export class UserProductsController {
  constructor(
    private readonly getProduct: GetProductUseCase,
    private readonly listProducts: ListProductsUseCase,
    private readonly getBySlug: GetProductBySlugUseCase,
  ) {}

  @Get()
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Requested page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Items per page',
  })
  @ApiDoc({
    summary: 'Get Products',
    description: 'Returns paginated products for the user panel.',
    successDescription: 'Products retrieved successfully',
    successResponse: ProductResponseDto,
    isPaginated: true,
    errors: [HttpStatus.BAD_REQUEST],
  })
  async list(
    @Query() dto: PagingDto,
  ): Promise<PagingResponseDto<ProductResponseDto>> {
    return ProductResponseDto.fromPaging(await this.listProducts.execute(dto));
  }

  @Get('by-slug/:slug')
  @ApiParam({
    name: 'slug',
    description: 'Product slug',
    example: 'iphone-15-pro',
  })
  @ApiDoc({
    summary: 'Get Product By Slug',
    description: 'Returns a product by slug for the user panel.',
    successDescription: 'Product retrieved successfully',
    successResponse: ProductResponseDto,
    errors: [HttpStatus.NOT_FOUND],
  })
  async getProductBySlug(
    @Param('slug') slug: string,
  ): Promise<ProductResponseDto> {
    return ProductResponseDto.fromEntity(await this.getBySlug.execute(slug));
  }

  @Get(':uid')
  @ApiParam({
    name: 'uid',
    description: 'Product public unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @ApiDoc({
    summary: 'Get Product',
    description:
      'Returns a product by public unique identifier for the user panel.',
    successDescription: 'Product retrieved successfully',
    successResponse: ProductResponseDto,
    errors: [HttpStatus.NOT_FOUND],
  })
  async get(@Param('uid') uid: string): Promise<ProductResponseDto> {
    return ProductResponseDto.fromEntity(await this.getProduct.execute(uid));
  }
}
