import { CreateOrderInput, OrderEntity } from '../entities/order.entity';

export interface IOrderRepository {
  create(input:CreateOrderInput): Promise<OrderEntity>;
  findById(id: bigint): Promise<OrderEntity | null>;
  findByUid(uid: string): Promise<OrderEntity | null>;
  findByUserId(userId: bigint): Promise<OrderEntity[]>;
//   update(id: bigint, order: Partial<OrderEntity>): Promise<OrderEntity>;
  softDelete(id: bigint): Promise<void>;
  restore(id:BigInt):Promise<void>
  delete(id: bigint): Promise<void>;
}

export const ORDER_REPOSITORY = Symbol('IOrderRepository');
