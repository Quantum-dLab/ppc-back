import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsUUID, IsString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateCartItemDto {
  @ApiProperty({
    description: 'Cart unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsString()
  cartUid: string;

  @ApiProperty({
    description: 'Product unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  @IsString()
  productUid: string;

  @ApiPropertyOptional({
    description: 'Quantity of the product',
    minimum: 1,
    default: 1,
    example: 2,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity?: number = 1; // Default to 1 if not provided
}
