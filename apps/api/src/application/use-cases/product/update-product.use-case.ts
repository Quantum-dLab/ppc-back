import {
  Inject,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import {
  UpdateProductProps,
  ProductEntity,
} from 'apps/api/src/domain/entities/product.entity';
import {
  PRODUCT_REPOSITORY,
  type IProductRepository,
} from 'apps/api/src/domain/repositories/product.repository.interface';
import { FileStorageService } from '@libs/shared';
import { UpdateProductDto } from '../../dto/product/update-product.dto';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    private readonly fileStorage: FileStorageService,
  ) {}

  async execute(
    uid: string,
    dto: UpdateProductDto,
    file?: Express.Multer.File,
  ): Promise<ProductEntity> {
    const product = await this.productRepository.findByUid(uid);
    if (!product) throw new NotFoundException(`Product ${uid} not found`);

    const imageUrl = file ? await this.fileStorage.save(file) : undefined;

    const props: UpdateProductProps = {
      name: dto.name,
      description: dto.description,
      price: dto.price,
      stock: dto.stock,
      imageUrl,
    };

    if (dto.name && dto.name !== product.name) {
      const tempProduct = new ProductEntity({ ...product, name: dto.name });
      const exists = await this.productRepository.existsBySlug(
        tempProduct.slug,
        uid,
      );
      if (exists)
        throw new ConflictException(
          `Slug "${tempProduct.slug}" already exists`,
        );
    }

    product.update(props);

    return this.productRepository.update(uid, product);
  }
}
