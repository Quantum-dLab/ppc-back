import { Injectable } from '@nestjs/common';
import {
  ProductEntity,
  UpdateProductProps,
} from '../../domain/entities/product.entity';
import {
  CreateProductProps,
  IProductRepository,
} from '../../domain/repositories/product.repository.interface';
import { PrismaService } from '@libs/database';
import { Product } from '@prisma/client';

@Injectable()
export class PrismaProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(raw: Product): ProductEntity {
    return new ProductEntity({
      uid: raw.uid,
      name: raw.name,
      description: raw.description,
      price: Number(raw.price),
      stock: raw.stock,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  async findByUid(uid: string): Promise<ProductEntity | null> {
    const raw = await this.prisma.product.findUnique({
      where: { uid },
    });
    return raw ? this.toEntity(raw) : null;
  }

  async findAll(): Promise<ProductEntity[]> {
    const rows = await this.prisma.product.findMany();
    return rows.map((r) => this.toEntity(r));
  }

  async create(data: CreateProductProps): Promise<ProductEntity> {
    const raw = await this.prisma.product.create({ data });
    return this.toEntity(raw);
  }

  async update(uid: string, data: UpdateProductProps): Promise<ProductEntity> {
    const raw = await this.prisma.product.update({
      where: { uid },
      data,
    });
    return this.toEntity(raw);
  }

  async delete(uid: string): Promise<void> {
    await this.prisma.product.delete({ where: { uid } });
  }
}
