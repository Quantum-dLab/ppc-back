import { PaymentEntity } from '../entities/payment.entity';
import { PaymentStatus } from '../enums/payment-status.enum';


export interface IPaymentRepository {

  create(payment: PaymentEntity): Promise<PaymentEntity>;


  findById(id: bigint): Promise<PaymentEntity | null>;


  findByUid(uid: string): Promise<PaymentEntity | null>;


  findByOrderId(orderId: bigint): Promise<PaymentEntity[]>;


  findByAuthority(authority: string): Promise<PaymentEntity | null>;
  findByRefId(refId: string): Promise<PaymentEntity | null>;


  findByStatus(status: PaymentStatus): Promise<PaymentEntity[]>;
  update(id: bigint, payment: Partial<PaymentEntity>): Promise<PaymentEntity>;

  delete(id: bigint): Promise<void>;
}

export const PAYMENT_REPOSITORY = Symbol('IPaymentRepository');
