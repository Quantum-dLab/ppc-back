import { PagingResponseDto } from '@libs/shared';
import { ApiProperty } from '@nestjs/swagger';
import { CartEntity } from '../../../domain/entities/cart.entity';

export class CartResponseDto {
  @ApiProperty({
    description: 'Cart public unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174010',
  })
  uid: string;

  @ApiProperty({
    description: 'Cart owner public unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userUid: string;

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

  static fromEntity(cart: CartEntity): CartResponseDto {
    const dto = new CartResponseDto();
    dto.uid = cart.uid;
    dto.userUid = cart.userUid;
    dto.createdAt = cart.createdAt;
    dto.updatedAt = cart.updatedAt;
    return dto;
  }

  static fromPaging(
    paging: PagingResponseDto<CartEntity>,
  ): PagingResponseDto<CartResponseDto> {
    return {
      rows: (paging.rows ?? []).map((cart) =>
        CartResponseDto.fromEntity(cart as CartEntity),
      ),
      meta: paging.meta,
    };
  }
}
