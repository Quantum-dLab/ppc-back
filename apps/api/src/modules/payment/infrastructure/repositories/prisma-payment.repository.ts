import { Injectable } from '@nestjs/common';
import { PrismaService } from '@libs/database';
import { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { PaymentStatus } from '../../domain/enums/payment-status.enum';
import { CreatePaymentInput, PaymentEntity } from '../../domain';
import { Payment } from '@prisma/client';

@Injectable()
export class PrismaPaymentRepository implements IPaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreatePaymentInput): Promise<PaymentEntity> {
    const created = await this.prisma.payment.create({
      data: {
        ...input,
        status: PaymentStatus.PENDING,
      },
    });

    return this.mapToDomain(created);
  }

  async findById(id: bigint): Promise<PaymentEntity | null> {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
    });

    return payment ? this.mapToDomain(payment) : null;
  }

  async findByUid(uid: string): Promise<PaymentEntity | null> {
    const payment = await this.prisma.payment.findUnique({
      where: { uid },
    });

    return payment ? this.mapToDomain(payment) : null;
  }

 
  async findByOrderId(orderId: bigint): Promise<PaymentEntity[]> {
    const payments = await this.prisma.payment.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });

    return payments.map((p) => this.mapToDomain(p));
  }

  
  async findByAuthority(authority: string): Promise<PaymentEntity | null> {
    const payment = await this.prisma.payment.findUnique({
      where: { authority },
    });

    return payment ? this.mapToDomain(payment) : null;
  }


  async findByRefId(refId: string): Promise<PaymentEntity | null> {
    const payment = await this.prisma.payment.findUnique({
      where: { refId },
    });

    return payment ? this.mapToDomain(payment) : null;
  }
  async findByStatus(status: PaymentStatus): Promise<PaymentEntity[]> {
    const payments = await this.prisma.payment.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
    });

    return payments.map((p) => this.mapToDomain(p));
  }

  async delete(id: bigint): Promise<void> {
    await this.prisma.payment.delete({
      where: { id },
    });
  }

  private mapToDomain(prismaPayment: Payment): PaymentEntity {
    return PaymentEntity.from(prismaPayment);
  }
}
