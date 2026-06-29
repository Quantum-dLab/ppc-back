import { ApiProperty } from '@nestjs/swagger';
import { CartItemEntity } from '../../../domain/entities/cart-item.entity';

export class CartItemResponseDto {
  @ApiProperty({
    description: 'Cart item public unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174020',
  })
  uid: string;

  @ApiProperty({
    description: 'Quantity of the product in the cart',
    example: 2,
  })
  quantity: number;

  static fromEntity(item: CartItemEntity): CartItemResponseDto {
    const dto = new CartItemResponseDto();
    dto.uid = item.uid;
    dto.quantity = item.quantity;
    return dto;
  }
}
