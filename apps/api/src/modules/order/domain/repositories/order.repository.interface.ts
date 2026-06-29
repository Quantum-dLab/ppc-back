import { PagingDto, PagingResponseDto } from '@libs/shared';
import { CreateOrderInput, OrderEntity } from '../entities/order.entity';
import { OrderStatus } from '../enums/order-status.enum';

export interface IOrderRepository {
  create(input: CreateOrderInput): Promise<OrderEntity>;
  findById(id: bigint): Promise<OrderEntity | null>;
  findByUid(uid: string): Promise<OrderEntity | null>;
  findByUserId(
    userId: bigint,
    query: PagingDto,
  ): Promise<PagingResponseDto<OrderEntity>>;
  findAll(query: PagingDto): Promise<PagingResponseDto<OrderEntity>>;
  updateStatus(uid: string, status: OrderStatus): Promise<OrderEntity>;
  updateStatusById(id: bigint, status: OrderStatus): Promise<OrderEntity>;
  softDelete(id: bigint): Promise<void>;
  restore(id: bigint): Promise<void>;
  delete(id: bigint): Promise<void>;
}

export const ORDER_REPOSITORY = Symbol('IOrderRepository');
