/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Exclude } from 'class-transformer';

export class ProductEntity {
  @Exclude()
  readonly id!: bigint;
  readonly uid!: string;
  name!: string;
  description!: string;
  slug!: string;
  price!: number;
  stock!: number;
  imageUrl?: string;
  readonly createdAt!: Date;
  updatedAt!: Date;

  constructor(partial: Partial<ProductEntity>) {
    Object.assign(this, partial);
    if (!this.slug && this.name) {
      this.slug = this.generateSlug(this.name);
    }
  }

  update(data: UpdateProductProps): void {
    if (data.name !== undefined) this.name = data.name;
    if (data.description !== undefined) this.description = data.description;
    if (data.slug !== undefined) this.slug = data.slug;
    if (data.price !== undefined) this.price = data.price;
    if (data.stock !== undefined) this.stock = data.stock;
    if (data.imageUrl !== undefined) this.imageUrl = data.imageUrl;
    this.updatedAt = new Date();
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

export interface UpdateProductProps {
  name?: string;
  description?: string;
  slug?: string;
  price?: number;

  stock?: number;
  imageUrl?: string;
}
export interface CreateProductProps {
  name: string;
  description: string;
  slug: string;
  price: number;
  stock: number;
  imageUrl?: string;
}
