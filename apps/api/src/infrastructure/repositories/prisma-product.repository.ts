import { Injectable } from '@nestjs/common';
import {
  CreateProductProps,
  ProductEntity,
  UpdateProductProps,
} from '../../domain/entities/product.entity';
import { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { PrismaService } from '@libs/database';
import { Product } from '@prisma/client';
import { PagingDto, PagingResponseDto } from '@libs/shared';

@Injectable()
export class PrismaProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(raw: Product): ProductEntity {
    return new ProductEntity({
      uid: raw.uid,
      name: raw.name,
      description: raw.description,
      slug: raw.slug,
      price: Number(raw.price),
      stock: raw.stock,
      imageUrl: raw.imageUrl ?? undefined, // ← converts null to undefined
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

  async existsBySlug(slug: string, excludeUid?: string): Promise<boolean> {
    const row = await this.prisma.product.findFirst({
      where: {
        slug,
        ...(excludeUid && { uid: { not: excludeUid } }), // exclude current product on update
      },
    });
    return !!row;
  }

  async findAll(
    pagingDto: PagingDto,
  ): Promise<PagingResponseDto<ProductEntity>> {
    const { page, limit } = pagingDto;
    const skip = (page - 1) * limit;

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count(),
    ]);

    return {
      rows: rows.map((r) => this.toEntity(r)),
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    };
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

  async findBySlug(slug: string): Promise<ProductEntity | null> {
    const row = await this.prisma.product.findUnique({ where: { slug } });
    return row ? this.toEntity(row) : null;
  }
}
