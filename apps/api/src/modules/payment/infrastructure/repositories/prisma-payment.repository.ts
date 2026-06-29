import { Injectable } from '@nestjs/common';
import { PrismaService } from '@libs/database';
import { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { PaymentStatus } from '../../domain/enums/payment-status.enum';
import {
  CreatePaymentInput,
  PaymentEntity,
  UpdatePaymentInput,
} from '../../domain';
import { Order, Payment, Prisma } from '@prisma/client';
import { PagingDto, PagingResponseDto } from '@libs/shared';

type PaymentWithOrder = Payment & {
  order?: Pick<Order, 'uid' | 'userId'>;
};

@Injectable()
export class PrismaPaymentRepository implements IPaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreatePaymentInput): Promise<PaymentEntity> {
    const created = await this.prisma.payment.create({
      data: {
        orderId: input.orderId,
        amount: input.amount,
        status: input.status ?? PaymentStatus.PENDING,
        authority: input.authority,
        description: input.description,
      },
      include: this.paymentInclude,
    });

    return this.mapToDomain(created);
  }

  async findById(id: bigint): Promise<PaymentEntity | null> {
    const payment = await this.prisma.payment.findFirst({
      where: { id, deletedAt: null },
      include: this.paymentInclude,
    });

    return payment ? this.mapToDomain(payment) : null;
  }

  async findByUid(uid: string): Promise<PaymentEntity | null> {
    const payment = await this.prisma.payment.findFirst({
      where: { uid, deletedAt: null },
      include: this.paymentInclude,
    });

    return payment ? this.mapToDomain(payment) : null;
  }

  async findByOrderId(orderId: bigint): Promise<PaymentEntity[]> {
    const payments = await this.prisma.payment.findMany({
      where: { orderId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: this.paymentInclude,
    });

    return payments.map((p) => this.mapToDomain(p));
  }

  async findByAuthority(authority: string): Promise<PaymentEntity | null> {
    const payment = await this.prisma.payment.findUnique({
      where: { authority },
      include: this.paymentInclude,
    });

    return payment ? this.mapToDomain(payment) : null;
  }

  async findByRefId(refId: string): Promise<PaymentEntity | null> {
    const payment = await this.prisma.payment.findUnique({
      where: { refId },
      include: this.paymentInclude,
    });

    return payment ? this.mapToDomain(payment) : null;
  }

  async findByUserId(
    userId: bigint,
    query: PagingDto,
  ): Promise<PagingResponseDto<PaymentEntity>> {
    return this.findMany({
      ...query,
      userId,
    });
  }

  async findAll(query: PagingDto): Promise<PagingResponseDto<PaymentEntity>> {
    return this.findMany(query);
  }

  async findByStatus(status: PaymentStatus): Promise<PaymentEntity[]> {
    const payments = await this.prisma.payment.findMany({
      where: { status, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: this.paymentInclude,
    });

    return payments.map((p) => this.mapToDomain(p));
  }

  async update(uid: string, input: UpdatePaymentInput): Promise<PaymentEntity> {
    const payment = await this.prisma.payment.update({
      where: { uid },
      data: {
        ...(input.status !== undefined && { status: input.status }),
        ...(input.refId !== undefined && { refId: input.refId }),
        ...(input.gatewayResponse !== undefined && {
          gatewayResponse: input.gatewayResponse as Prisma.InputJsonValue,
        }),
        ...(input.paidAt !== undefined && { paidAt: input.paidAt }),
        ...(input.failedAt !== undefined && { failedAt: input.failedAt }),
        ...(input.refundedAt !== undefined && { refundedAt: input.refundedAt }),
      },
      include: this.paymentInclude,
    });

    return this.mapToDomain(payment);
  }

  async delete(id: bigint): Promise<void> {
    await this.prisma.payment.delete({
      where: { id },
    });
  }

  private async findMany(
    query: PagingDto & { userId?: bigint },
  ): Promise<PagingResponseDto<PaymentEntity>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;
    const where = {
      deletedAt: null,
      ...(query.userId !== undefined && {
        order: {
          userId: query.userId,
        },
      }),
    };

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: this.paymentInclude,
      }),
      this.prisma.payment.count({ where }),
    ]);

    return {
      rows: rows.map((payment) => this.mapToDomain(payment)),
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private mapToDomain(prismaPayment: PaymentWithOrder): PaymentEntity {
    return PaymentEntity.from(prismaPayment);
  }

  private readonly paymentInclude = {
    order: {
      select: {
        uid: true,
        userId: true,
      },
    },
  };
}
