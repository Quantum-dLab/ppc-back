import { Exclude } from 'class-transformer';
import { OrderStatus } from '../enums/order-status.enum';
import { OrderItemEntity } from './order-item.entity';

export class OrderEntity {
  @Exclude()
  id: bigint;
  uid: string;
  status: OrderStatus;
  totalPrice: number;
  userId: bigint;
  items: OrderItemEntity[] = [];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  constructor(data: Partial<OrderEntity> = {}) {
    Object.assign(this, data);
  }
  static from(row: any): OrderEntity {
    return new OrderEntity({
      id: row.id,
      uid: row.uid,
      status: row.status,
      totalPrice: Number(row.total_price ?? row.totalPrice),
      userId: row.user_id ?? row.userId,
      items: Array.isArray(row.items)
        ? row.items.map((item: any) => OrderItemEntity.from(item))
        : [],
      createdAt: new Date(row.created_at ?? row.createdAt),
      updatedAt: new Date(row.updated_at ?? row.updatedAt),
      deletedAt: row.deleted_at
        ? new Date(row.deleted_at)
        : (row.deletedAt ?? null),
    });
  }
  canBePaid(): boolean {
    return (
      this.status === OrderStatus.PENDING &&
      this.items.length > 0 &&
      this.totalPrice > 0
    );
  }

  canBeCancelled(): boolean {
    return this.status === OrderStatus.PENDING && !this.deletedAt;
  }
}
export interface CreateOrderInput {
  totalPrice: number;
  userId: bigint;
  status: OrderStatus;
}