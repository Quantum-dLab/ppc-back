import { PagingResponseDto } from '@libs/shared';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { OrderEntity } from '../../domain/entities/order.entity';
import { OrderItemEntity } from '../../domain/entities/order-item.entity';
import { OrderStatus } from '../../domain/enums/order-status.enum';

export class CreateOrderItemRequestDto {
  @ApiProperty({
    description: 'Product public unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  productUid: string;

  @ApiProperty({
    description: 'Quantity requested for the product',
    example: 2,
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderRequestDto {
  @ApiProperty({
    description: 'Order line items',
    type: [CreateOrderItemRequestDto],
    example: [
      {
        productUid: '123e4567-e89b-12d3-a456-426614174001',
        quantity: 2,
      },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemRequestDto)
  items: CreateOrderItemRequestDto[];
}

export class UpdateOrderStatusRequestDto {
  @ApiProperty({
    description: 'New order status',
    enum: OrderStatus,
    example: OrderStatus.PAID,
  })
  @Type(() => Number)
  @IsEnum(OrderStatus)
  status: OrderStatus;
}

export class OrderItemResponseDto {
  @ApiProperty({
    description: 'Order item public unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174010',
  })
  uid: string;

  @ApiProperty({
    description: 'Product public unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  productUid?: string;

  @ApiPropertyOptional({
    description: 'Product name captured for display',
    example: 'iPhone 15 Pro',
  })
  productName?: string;

  @ApiProperty({
    description: 'Quantity purchased',
    example: 2,
  })
  quantity: number;

  @ApiProperty({
    description: 'Unit price captured when the order was created',
    example: 999.99,
  })
  unitPrice: number;

  @ApiProperty({
    description: 'Line total price',
    example: 1999.98,
  })
  totalPrice: number;

  static fromEntity(entity: OrderItemEntity): OrderItemResponseDto {
    const dto = new OrderItemResponseDto();
    dto.uid = entity.uid;
    dto.productUid = entity.productUid;
    dto.productName = entity.productName;
    dto.quantity = entity.quantity;
    dto.totalPrice = entity.price;
    dto.unitPrice = entity.quantity > 0 ? entity.price / entity.quantity : 0;
    return dto;
  }
}

export class OrderResponseDto {
  @ApiProperty({
    description: 'Order public unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174100',
  })
  uid: string;

  @ApiProperty({
    description: 'Order status code',
    enum: OrderStatus,
    example: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @ApiProperty({
    description: 'Human-readable order status',
    example: 'PENDING',
  })
  statusLabel: string;

  @ApiProperty({
    description: 'Order total price',
    example: 1999.98,
  })
  totalPrice: number;

  @ApiPropertyOptional({
    description: 'User public unique identifier. Returned for admin endpoints.',
    example: '123e4567-e89b-12d3-a456-426614174999',
  })
  userUid?: string;

  @ApiPropertyOptional({
    description: 'User email. Returned for admin endpoints.',
    example: 'customer@example.com',
  })
  userEmail?: string;

  @ApiProperty({
    description: 'Order items',
    type: [OrderItemResponseDto],
  })
  items: OrderItemResponseDto[];

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2026-06-28T12:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2026-06-28T12:35:00.000Z',
  })
  updatedAt: Date;

  static fromEntity(entity: OrderEntity): OrderResponseDto {
    const dto = new OrderResponseDto();
    dto.uid = entity.uid;
    dto.status = entity.status;
    dto.statusLabel = OrderStatus[entity.status];
    dto.totalPrice = entity.totalPrice;
    dto.userUid = entity.userUid;
    dto.userEmail = entity.userEmail;
    dto.items = entity.items.map((item) =>
      OrderItemResponseDto.fromEntity(item),
    );
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }

  static fromPaging(paging: {
    rows?: Partial<OrderEntity>[];
    meta?: PagingResponseDto<OrderEntity>['meta'];
  }): PagingResponseDto<OrderResponseDto> {
    return {
      rows: (paging.rows ?? []).map((order) =>
        OrderResponseDto.fromEntity(order as OrderEntity),
      ),
      meta: paging.meta,
    };
  }
}
