import { PagingResponseDto } from '@libs/shared';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { PaymentEntity } from '../../domain/entities/payment.entity';
import { PaymentStatus } from '../../domain/enums/payment-status.enum';

export class CreatePaymentRequestDto {
  @ApiProperty({
    description: 'Order public unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174100',
  })
  @IsUUID()
  orderUid: string;

  @ApiPropertyOptional({
    description: 'User-facing payment description',
    example: 'Payment for order 123e4567-e89b-12d3-a456-426614174100',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

export class VerifyPaymentRequestDto {
  @ApiProperty({
    description:
      'Payment gateway authority token returned during payment creation',
    example: '0f707e5d-77e5-4e84-b30e-6ea2d1e5d3f0',
  })
  @IsString()
  @IsNotEmpty()
  authority: string;

  @ApiProperty({
    description: 'Whether the gateway reports the payment as successful',
    example: true,
  })
  @Type(() => Boolean)
  @IsBoolean()
  success: boolean;

  @ApiPropertyOptional({
    description: 'Gateway reference id. Required when success is true.',
    example: 'A000000000000001234567',
  })
  @ValidateIf((dto: VerifyPaymentRequestDto) => dto.success === true)
  @IsString()
  @IsNotEmpty()
  refId?: string;

  @ApiPropertyOptional({
    description: 'Raw gateway response stored for auditing',
    example: {
      code: 100,
      message: 'Payment verified',
    },
  })
  @IsOptional()
  @IsObject()
  gatewayResponse?: Record<string, unknown>;
}

export class PaymentResponseDto {
  @ApiProperty({
    description: 'Payment public unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174200',
  })
  uid: string;

  @ApiPropertyOptional({
    description: 'Order public unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174100',
  })
  orderUid?: string;

  @ApiProperty({
    description: 'Payment amount',
    example: 1999.98,
  })
  amount: number;

  @ApiProperty({
    description: 'Payment status code',
    enum: PaymentStatus,
    example: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @ApiProperty({
    description: 'Human-readable payment status',
    example: 'PENDING',
  })
  statusLabel: string;

  @ApiPropertyOptional({
    description: 'Payment gateway authority token',
    example: '0f707e5d-77e5-4e84-b30e-6ea2d1e5d3f0',
  })
  authority?: string | null;

  @ApiPropertyOptional({
    description: 'Gateway reference id after successful verification',
    example: 'A000000000000001234567',
  })
  refId?: string | null;

  @ApiPropertyOptional({
    description: 'User-facing payment description',
    example: 'Payment for order 123e4567-e89b-12d3-a456-426614174100',
  })
  description?: string | null;

  @ApiPropertyOptional({
    description: 'Raw gateway response stored for auditing',
    example: {
      code: 100,
      message: 'Payment verified',
    },
  })
  gatewayResponse?: Record<string, unknown> | null;

  @ApiPropertyOptional({
    description: 'Payment success timestamp',
    example: '2026-06-28T12:40:00.000Z',
  })
  paidAt?: Date | null;

  @ApiPropertyOptional({
    description: 'Payment failure timestamp',
    example: '2026-06-28T12:40:00.000Z',
  })
  failedAt?: Date | null;

  @ApiPropertyOptional({
    description: 'Payment refund timestamp',
    example: '2026-06-28T12:40:00.000Z',
  })
  refundedAt?: Date | null;

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

  static fromEntity(entity: PaymentEntity): PaymentResponseDto {
    const dto = new PaymentResponseDto();
    dto.uid = entity.uid;
    dto.orderUid = entity.orderUid;
    dto.amount = entity.amount;
    dto.status = entity.status;
    dto.statusLabel = PaymentStatus[entity.status];
    dto.authority = entity.authority;
    dto.refId = entity.refId;
    dto.description = entity.description;
    dto.gatewayResponse = entity.gatewayResponse;
    dto.paidAt = entity.paidAt;
    dto.failedAt = entity.failedAt;
    dto.refundedAt = entity.refundedAt;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }

  static fromPaging(paging: {
    rows?: Partial<PaymentEntity>[];
    meta?: PagingResponseDto<PaymentEntity>['meta'];
  }): PagingResponseDto<PaymentResponseDto> {
    return {
      rows: (paging.rows ?? []).map((payment) =>
        PaymentResponseDto.fromEntity(payment as PaymentEntity),
      ),
      meta: paging.meta,
    };
  }
}
