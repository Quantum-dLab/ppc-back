export class OrderItemEntity {
  id: bigint;
  uid: string;
  orderId: bigint;
  productId: bigint;
  productUid?: string;
  productName?: string;
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  constructor(data: Partial<OrderItemEntity> = {}) {
    Object.assign(this, data);
  }

  static from(row: any): OrderItemEntity {
    return new OrderItemEntity({
      id: row.id,
      uid: row.uid,
      orderId: row.order_id ?? row.orderId,
      productId: row.product_id ?? row.productId,
      productUid: row.product?.uid ?? row.productUid,
      productName: row.product?.name ?? row.productName,
      quantity: Number(row.quantity),
      price: Number(row.price),
      createdAt: new Date(row.created_at ?? row.createdAt),
      updatedAt: new Date(row.updated_at ?? row.updatedAt),
      deletedAt: row.deleted_at
        ? new Date(row.deleted_at)
        : (row.deletedAt ?? null),
    });
  }

  isValidQuantity(): boolean {
    return this.quantity > 0;
  }
}
