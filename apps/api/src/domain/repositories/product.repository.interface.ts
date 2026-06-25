import { PagingDto, PagingResponseDto } from '@libs/shared';
import {
  CreateProductProps,
  ProductEntity,
  UpdateProductProps,
} from '../entities/product.entity';

export interface IProductRepository {
  findByUid(uid: string): Promise<ProductEntity | null>;

  findBySlug(slug: string): Promise<ProductEntity | null>;
  findAll(pagingDto: PagingDto): Promise<PagingResponseDto<ProductEntity>>;
  create(product: CreateProductProps): Promise<ProductEntity>;
  update(slug: string, product: UpdateProductProps): Promise<ProductEntity>;
  delete(slut: string): Promise<void>;
  existsBySlug(slug: string, excludeUid?: string): Promise<boolean>;
}
export const PRODUCT_REPOSITORY = Symbol('IProductRepository');
