import { PagingDto, PagingResponseDto } from '@libs/shared';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { CreateProductDto } from '../application/dto/product/create-product.dto';
import { ProductResponseDto } from '../application/dto/product/product-response.dto';
import { UpdateProductDto } from '../application/dto/product/update-product.dto';
import {
  CreateProductUseCase,
  GetProductUseCase,
  ListProductsUseCase,
  UpdateProductUseCase,
} from '../application/use-cases/product';
import { GetProductBySlugUseCase } from '../application/use-cases/product/get-product-by-slug.use-case';
import { ApiDoc } from '../common/decorators';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminPanel } from '../common/decorators/swagger.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../domain/entities/user.entity';

@AdminPanel('Products')
@Controller('admin/products')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminProductsController {
  constructor(
    private readonly createProduct: CreateProductUseCase,
    private readonly getProduct: GetProductUseCase,
    private readonly listProducts: ListProductsUseCase,
    private readonly updateProduct: UpdateProductUseCase,
    private readonly getBySlug: GetProductBySlugUseCase,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  @ApiBearerAuth('Authorization')
  @ApiDoc({
    summary: 'Create Product',
    description: 'Creates a product with an optional image upload.',
    body: CreateProductDto,
    multipart: true,
    successStatus: HttpStatus.CREATED,
    successDescription: 'Product created successfully',
    successResponse: ProductResponseDto,
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
  ): Promise<ProductResponseDto> {
    return ProductResponseDto.fromEntity(
      await this.createProduct.execute(dto, file),
    );
  }

  @Get()
  @ApiBearerAuth('Authorization')
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
    description: 'Returns paginated products for admin management.',
    successDescription: 'Products retrieved successfully',
    successResponse: ProductResponseDto,
    isPaginated: true,
    errors: [HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN],
  })
  async list(
    @Query() dto: PagingDto,
  ): Promise<PagingResponseDto<ProductResponseDto>> {
    return ProductResponseDto.fromPaging(await this.listProducts.execute(dto));
  }

  @Get('by-slug/:slug')
  @ApiBearerAuth('Authorization')
  @ApiParam({
    name: 'slug',
    description: 'Product slug',
    example: 'iphone-15-pro',
  })
  @ApiDoc({
    summary: 'Get Product By Slug',
    description: 'Returns a product by slug for admin management.',
    successDescription: 'Product retrieved successfully',
    successResponse: ProductResponseDto,
    errors: [
      HttpStatus.UNAUTHORIZED,
      HttpStatus.FORBIDDEN,
      HttpStatus.NOT_FOUND,
    ],
  })
  async getProductBySlug(
    @Param('slug') slug: string,
  ): Promise<ProductResponseDto> {
    return ProductResponseDto.fromEntity(await this.getBySlug.execute(slug));
  }

  @Get(':uid')
  @ApiBearerAuth('Authorization')
  @ApiParam({
    name: 'uid',
    description: 'Product public unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @ApiDoc({
    summary: 'Get Product',
    description: 'Returns a product by public unique identifier.',
    successDescription: 'Product retrieved successfully',
    successResponse: ProductResponseDto,
    errors: [
      HttpStatus.UNAUTHORIZED,
      HttpStatus.FORBIDDEN,
      HttpStatus.NOT_FOUND,
    ],
  })
  async get(@Param('uid') uid: string): Promise<ProductResponseDto> {
    return ProductResponseDto.fromEntity(await this.getProduct.execute(uid));
  }

  @Patch(':uid')
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  @ApiBearerAuth('Authorization')
  @ApiParam({
    name: 'uid',
    description: 'Product public unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @ApiDoc({
    summary: 'Update Product',
    description: 'Updates product fields. Only provided fields are changed.',
    body: UpdateProductDto,
    multipart: true,
    successDescription: 'Product updated successfully',
    successResponse: ProductResponseDto,
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
  ): Promise<ProductResponseDto> {
    return ProductResponseDto.fromEntity(
      await this.updateProduct.execute(uid, dto, file),
    );
  }
}
