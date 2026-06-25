import { Injectable } from '@nestjs/common';
import { PrismaService } from '@libs/database';
import { IOrderRepository } from '../../domain/repositories/order.repository.interface';
import { Order } from '@prisma/client';
import { CreateOrderInput, OrderEntity } from '../../domain';
@Injectable()
export class PrismaOrderRepository implements IOrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  private orderToDomain(order: Order): OrderEntity {
    return OrderEntity.from(order);
  }

  async create(input:CreateOrderInput): Promise<OrderEntity> {
    const created = await this.prisma.order.create({
      data: {
        ...input
      },
      include: {
        items: true,
      },
    });

    return this.orderToDomain(created);
  }


  async findById(id: bigint): Promise<OrderEntity | null> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    return order ? this.orderToDomain(order) : null;
  }


  async findByUid(uid: string): Promise<OrderEntity | null> {
    const order = await this.prisma.order.findUnique({
      where: { uid ,deletedAt:null},
    });

    return order ? this.orderToDomain(order) : null;
  }

  
  async findByUserId(userId: bigint): Promise<OrderEntity[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((o) => this.orderToDomain(o));
  }
  async softDelete(id: bigint): Promise<void> {
    await this.prisma.order.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }


  async restore(id: bigint): Promise<void> {
    await this.prisma.order.update({
      where: { id },
      data: {
        deletedAt: null,
      },
    });
  }

  async delete(id: bigint): Promise<void> {
    await this.prisma.order.delete({
      where: { id },
    });
  }


}
