import { PagingDto, PagingResponseDto } from '@libs/shared';
import { CartEntity } from '../entities/cart.entity';

export interface CreateCartProps {
  uid: string;
}

export interface ICartRepository {
  findByUid(uid: string): Promise<CartEntity | null>;
  findAll(pagingDto: PagingDto): Promise<PagingResponseDto<CartEntity>>;
  create(cart: CreateCartProps): Promise<CartEntity>;
  delete(uid: string): Promise<void>;
}

export const CART_REPOSITORY = Symbol('ICartRepository');
