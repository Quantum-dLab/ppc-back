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
  userUid?: string;
  userEmail?: string;
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
      userUid: row.user?.uid ?? row.userUid,
      userEmail: row.user?.email ?? row.userEmail,
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

  static createPending(data: CreatePendingOrderData): OrderEntity {
    const items = data.items.map(
      (item) =>
        new OrderItemEntity({
          productId: item.productId,
          productUid: item.productUid,
          productName: item.productName,
          quantity: item.quantity,
          price: item.unitPrice * item.quantity,
        }),
    );

    return new OrderEntity({
      userId: data.userId,
      status: OrderStatus.PENDING,
      items,
      totalPrice: items.reduce((sum, item) => sum + item.price, 0),
    });
  }
}

export interface CreatePendingOrderItemData {
  productId: bigint;
  productUid?: string;
  productName?: string;
  quantity: number;
  unitPrice: number;
}

export interface CreatePendingOrderData {
  userId: bigint;
  items: CreatePendingOrderItemData[];
}

export interface CreateOrderItemInput {
  productId: bigint;
  quantity: number;
  price: number;
}

export interface CreateOrderInput {
  totalPrice: number;
  userId: bigint;
  status: OrderStatus;
  items: CreateOrderItemInput[];
}
