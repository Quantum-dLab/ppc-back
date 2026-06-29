import { PagingResponseDto } from '@libs/shared';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductEntity } from '../../../domain/entities/product.entity';

export class ProductResponseDto {
  @ApiProperty({
    description: 'Product public unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  uid: string;

  @ApiProperty({
    description: 'Product display name',
    example: 'iPhone 15 Pro',
  })
  name: string;

  @ApiProperty({
    description: 'SEO-friendly product slug',
    example: 'iphone-15-pro',
  })
  slug: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Latest Apple flagship...',
  })
  description: string;

  @ApiProperty({
    description: 'Product price',
    example: 999.99,
  })
  price: number;

  @ApiProperty({
    description: 'Available product stock',
    example: 100,
  })
  stock: number;

  @ApiPropertyOptional({
    description: 'Product image URL',
    example: '/uploads/products/iphone-15-pro.webp',
  })
  imageUrl?: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2026-06-29T12:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2026-06-29T12:30:00.000Z',
  })
  updatedAt: Date;

  static fromEntity(product: ProductEntity): ProductResponseDto {
    const dto = new ProductResponseDto();
    dto.uid = product.uid;
    dto.name = product.name;
    dto.slug = product.slug;
    dto.description = product.description;
    dto.price = product.price;
    dto.stock = product.stock;
    dto.imageUrl = product.imageUrl;
    dto.createdAt = product.createdAt;
    dto.updatedAt = product.updatedAt;
    return dto;
  }

  static fromPaging(
    paging: PagingResponseDto<ProductEntity>,
  ): PagingResponseDto<ProductResponseDto> {
    return {
      rows: (paging.rows ?? []).map((product) =>
        ProductResponseDto.fromEntity(product as ProductEntity),
      ),
      meta: paging.meta,
    };
  }
}
