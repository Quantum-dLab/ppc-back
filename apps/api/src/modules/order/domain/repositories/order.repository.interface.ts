import { OrderEntity } from '../entities/order.entity';


export interface IOrderRepository {
  create(order: OrderEntity): Promise<OrderEntity>;
  findById(id: bigint): Promise<OrderEntity | null>;
  findByUid(uid: string): Promise<OrderEntity | null>;
  findByUserId(userId: bigint): Promise<OrderEntity[]>;
  update(id: bigint, order: Partial<OrderEntity>): Promise<OrderEntity>;
  softDelete(id: bigint): Promise<void>;

  delete(id: bigint): Promise<void>;
}

export const ORDER_REPOSITORY = Symbol('IOrderRepository');
