/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Exclude } from 'class-transformer';

export interface UpdateProductProps {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  imageUrl?: string;
}

export class ProductEntity {
  @Exclude()
  readonly id!: bigint;
  readonly uid!: string;
  name!: string;
  description!: string;
  price!: number;
  stock!: number;
  imageUrl?: string;
  readonly createdAt!: Date;
  updatedAt!: Date;

  constructor(partial: Partial<ProductEntity>) {
    Object.assign(this, partial);
  }

  update(data: UpdateProductProps): void {
    if (data.name !== undefined) this.name = data.name;
    if (data.description !== undefined) this.description = data.description;
    if (data.price !== undefined) this.price = data.price;
    if (data.stock !== undefined) this.stock = data.stock;
    if (data.imageUrl !== undefined) this.imageUrl = data.imageUrl;
    this.updatedAt = new Date();
  }
}
