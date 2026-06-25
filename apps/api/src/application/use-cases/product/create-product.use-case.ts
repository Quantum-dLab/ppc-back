import { FileStorageService } from '@libs/shared';
import { Injectable, Inject, ConflictException } from '@nestjs/common';
import {
  ProductEntity,
  CreateProductProps,
} from 'apps/api/src/domain/entities/product.entity';
import {
  PRODUCT_REPOSITORY,
  type IProductRepository,
} from 'apps/api/src/domain/repositories/product.repository.interface';
import { join } from 'path';
import { CreateProductDto } from '../../dto/product/create-product.dto';

@Injectable()
export class CreateProductUseCase {
  private readonly uploadDir = join(process.cwd(), 'uploads', 'products');

  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    private readonly fileStorage: FileStorageService,
  ) {}

  async execute(
    dto: CreateProductDto,
    file?: Express.Multer.File,
  ): Promise<ProductEntity> {
    const imageUrl = file ? await this.fileStorage.save(file) : undefined;

    // build entity first so slug gets generated
    const product = new ProductEntity({
      name: dto.name,
      description: dto.description,
      price: dto.price,
      stock: dto.stock,
      imageUrl,
    });

    // now slug is guaranteed to exist
    const exists = await this.productRepository.existsBySlug(product.slug);
    if (exists)
      throw new ConflictException(`Slug "${product.slug}" already exists`);

    const props: CreateProductProps = {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl,
      slug: product.slug, // ← guaranteed string from entity
    };

    return this.productRepository.create(props);
  }
}
