import { Exclude } from 'class-transformer';
import { PaymentStatus } from '../enums/payment-status.enum';

export class PaymentEntity {
  @Exclude()
  id: bigint;
  uid: string;
  orderId: bigint;
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
      amount: Number(row.amount),
      status: row.status,
      authority: row.authority ?? null,
      refId: row.ref_id ?? row.refId,
      gatewayResponse: row.gateway_response ?? row.gatewayResponse ?? null,
      paidAt: row.paid_at ? new Date(row.paid_at) : null,
      failedAt: row.failed_at ? new Date(row.failed_at) : null,
      refundedAt: row.refunded_at ? new Date(row.refunded_at) : null,
      description: row.description ?? null,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
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
