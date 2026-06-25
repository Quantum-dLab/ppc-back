import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 15 Pro', description: 'Product name' })
  @IsString()
  name!: string;

  @ApiProperty({
    example: 'Latest Apple flagship...',
    description: 'Product description',
  })
  @IsString()
  description!: string;

  @ApiProperty({ example: 999.99, description: 'Price in USD', minimum: 0 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price!: number;

  @ApiProperty({ example: 100, description: 'Available stock', minimum: 0 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  stock!: number;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Product image (jpeg, png, webp — max 5MB)',
  })
  @IsOptional()
  image?: Express.Multer.File;
}
