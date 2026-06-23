import { ProductEntity, UpdateProductProps } from '../entities/product.entity';

export interface CreateProductProps {
  name: string;
  description: string;
  price: number;
  stock: number;
}
export interface IProductRepository {
  findByUid(uid: string): Promise<ProductEntity | null>;
  findAll(): Promise<ProductEntity[]>;
  create(product: CreateProductProps): Promise<ProductEntity>;
  update(uid: string, product: UpdateProductProps): Promise<ProductEntity>;
  delete(uid: string): Promise<void>;
}
export const PRODUCT_REPOSITORY = Symbol('IProductRepository');
