import { PagingDto, PagingResponseDto } from '@libs/shared';
import {
  CreatePaymentInput,
  PaymentEntity,
  UpdatePaymentInput,
} from '../entities/payment.entity';
import { PaymentStatus } from '../enums/payment-status.enum';

export interface IPaymentRepository {
  create(payment: CreatePaymentInput): Promise<PaymentEntity>;

  findById(id: bigint): Promise<PaymentEntity | null>;

  findByUid(uid: string): Promise<PaymentEntity | null>;

  findByOrderId(orderId: bigint): Promise<PaymentEntity[]>;

  findByAuthority(authority: string): Promise<PaymentEntity | null>;
  findByRefId(refId: string): Promise<PaymentEntity | null>;

  findByUserId(
    userId: bigint,
    query: PagingDto,
  ): Promise<PagingResponseDto<PaymentEntity>>;
  findAll(query: PagingDto): Promise<PagingResponseDto<PaymentEntity>>;
  findByStatus(status: PaymentStatus): Promise<PaymentEntity[]>;
  update(uid: string, payment: UpdatePaymentInput): Promise<PaymentEntity>;
  delete(id: bigint): Promise<void>;
}

export const PAYMENT_REPOSITORY = Symbol('IPaymentRepository');
