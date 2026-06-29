import { PagingDto, PagingResponseDto } from '@libs/shared';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
import {
  ApiCreateProductDocs,
  ApiGetProductBySlugDocs,
  ApiGetProductDocs,
  ApiListProductsDocs,
  ApiUpdateProductDocs,
} from '../common/core-swagger.decorator';
import { AdminPanel } from '../common/decorators/swagger.decorator';

@AdminPanel('Products')
@Controller('products-admin')
export class ProductController {
  constructor(
    private readonly createProduct: CreateProductUseCase,
    private readonly getProduct: GetProductUseCase,
    private readonly listProducts: ListProductsUseCase,
    private readonly updateProduct: UpdateProductUseCase,
    private readonly getBySlug: GetProductBySlugUseCase,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  @ApiCreateProductDocs()
  async create(
    @Body() dto: CreateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<ProductResponseDto> {
    return ProductResponseDto.fromEntity(
      await this.createProduct.execute(dto, file),
    );
  }

  @Get()
  @ApiListProductsDocs()
  async list(
    @Query() dto: PagingDto,
  ): Promise<PagingResponseDto<ProductResponseDto>> {
    return ProductResponseDto.fromPaging(await this.listProducts.execute(dto));
  }

  @Get('by-slug/:slug')
  @ApiGetProductBySlugDocs()
  async getProductBySlug(
    @Param('slug') slug: string,
  ): Promise<ProductResponseDto> {
    return ProductResponseDto.fromEntity(await this.getBySlug.execute(slug));
  }

  @Get(':uid')
  @ApiGetProductDocs()
  async get(@Param('uid') uid: string): Promise<ProductResponseDto> {
    return ProductResponseDto.fromEntity(await this.getProduct.execute(uid));
  }

  @Patch(':uid')
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  @ApiUpdateProductDocs()
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
