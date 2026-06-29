import { Exclude } from 'class-transformer';
import { PaymentStatus } from '../enums/payment-status.enum';

export class PaymentEntity {
  @Exclude()
  id: bigint;
  uid: string;
  orderId: bigint;
  orderUid?: string;
  amount: number;
  status: PaymentStatus;
  authority?: string | null;
  refId?: string | null;
  gatewayResponse?: Record<string, any> | null;
  paidAt?: Date | null;
  failedAt?: Date | null;
  refundedAt?: Date | null;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<PaymentEntity> = {}) {
    Object.assign(this, data);
  }

  static from(row: any): PaymentEntity {
    return new PaymentEntity({
      id: row.id,
      uid: row.uid,
      orderId: row.order_id ?? row.orderId,
      orderUid: row.order?.uid ?? row.orderUid,
      amount: Number(row.amount),
      status: row.status,
      authority: row.authority ?? null,
      refId: row.ref_id ?? row.refId,
      gatewayResponse: row.gateway_response ?? row.gatewayResponse ?? null,
      paidAt: row.paid_at
        ? new Date(row.paid_at)
        : row.paidAt
          ? new Date(row.paidAt)
          : null,
      failedAt: row.failed_at
        ? new Date(row.failed_at)
        : row.failedAt
          ? new Date(row.failedAt)
          : null,
      refundedAt: row.refunded_at
        ? new Date(row.refunded_at)
        : row.refundedAt
          ? new Date(row.refundedAt)
          : null,
      description: row.description ?? null,
      createdAt: new Date(row.created_at ?? row.createdAt),
      updatedAt: new Date(row.updated_at ?? row.updatedAt),
    });
  }

  isPending(): boolean {
    return this.status === PaymentStatus.PENDING;
  }

  isSuccessful(): boolean {
    return this.status === PaymentStatus.SUCCESS;
  }

  canBeRefunded(): boolean {
    return this.status === PaymentStatus.SUCCESS;
  }

  setGatewayResponse(response: Record<string, any>): void {
    this.gatewayResponse = response;
  }

  isValidAmount(): boolean {
    return this.amount > 0;
  }
}
export interface CreatePaymentInput {
  orderId: bigint;
  amount: number;
  status?: PaymentStatus;
  authority?: string;
  description?: string;
}

export interface UpdatePaymentInput {
  status?: PaymentStatus;
  refId?: string;
  gatewayResponse?: Record<string, unknown>;
  paidAt?: Date | null;
  failedAt?: Date | null;
  refundedAt?: Date | null;
}
