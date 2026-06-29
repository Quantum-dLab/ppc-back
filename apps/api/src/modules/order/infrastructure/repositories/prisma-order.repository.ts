import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@libs/database';
import { IOrderRepository } from '../../domain/repositories/order.repository.interface';
import { Order, OrderItem, Prisma, Product, User } from '@prisma/client';
import { CreateOrderInput, OrderEntity } from '../../domain';
import { PagingDto, PagingResponseDto } from '@libs/shared';
import { OrderStatus } from '../../domain/enums/order-status.enum';

type OrderWithRelations = Order & {
  items?: (OrderItem & {
    product?: Pick<Product, 'uid' | 'name'>;
  })[];
  user?: Pick<User, 'uid' | 'email'>;
};

@Injectable()
export class PrismaOrderRepository implements IOrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  private orderToDomain(order: OrderWithRelations): OrderEntity {
    return OrderEntity.from(order);
  }

  async create(input: CreateOrderInput): Promise<OrderEntity> {
    const created = await this.prisma.$transaction(async (tx) => {
      for (const item of input.items) {
        const result = await tx.product.updateMany({
          where: {
            id: item.productId,
            deletedAt: null,
            stock: {
              gte: item.quantity,
            },
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        if (result.count !== 1) {
          throw new BadRequestException(
            'Insufficient stock for one or more order items',
          );
        }
      }

      return tx.order.create({
        data: {
          userId: input.userId,
          status: input.status,
          totalPrice: input.totalPrice,
          items: {
            create: input.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: this.orderInclude,
      });
    });

    return this.orderToDomain(created);
  }

  async findById(id: bigint): Promise<OrderEntity | null> {
    const order = await this.prisma.order.findFirst({
      where: { id, deletedAt: null },
      include: this.orderInclude,
    });

    return order ? this.orderToDomain(order) : null;
  }

  async findByUid(uid: string): Promise<OrderEntity | null> {
    const order = await this.prisma.order.findFirst({
      where: { uid, deletedAt: null },
      include: this.orderInclude,
    });

    return order ? this.orderToDomain(order) : null;
  }

  async findByUserId(
    userId: bigint,
    query: PagingDto,
  ): Promise<PagingResponseDto<OrderEntity>> {
    return this.findMany({
      ...query,
      userId,
    });
  }

  async findAll(query: PagingDto): Promise<PagingResponseDto<OrderEntity>> {
    return this.findMany(query);
  }

  async updateStatus(uid: string, status: OrderStatus): Promise<OrderEntity> {
    const order = await this.prisma.order.update({
      where: { uid },
      data: { status },
      include: this.orderInclude,
    });

    return this.orderToDomain(order);
  }

  async updateStatusById(
    id: bigint,
    status: OrderStatus,
  ): Promise<OrderEntity> {
    const order = await this.prisma.order.update({
      where: { id },
      data: { status },
      include: this.orderInclude,
    });

    return this.orderToDomain(order);
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

  private async findMany(
    query: PagingDto & { userId?: bigint },
  ): Promise<PagingResponseDto<OrderEntity>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;
    const where = {
      deletedAt: null,
      ...(query.userId !== undefined && { userId: query.userId }),
    };

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: this.orderInclude,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      rows: rows.map((order) => this.orderToDomain(order)),
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private readonly orderInclude = {
    items: {
      where: {
        deletedAt: null,
      },
      include: {
        product: {
          select: {
            uid: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    },
    user: {
      select: {
        uid: true,
        email: true,
      },
    },
  } as const satisfies Prisma.OrderInclude;
}
