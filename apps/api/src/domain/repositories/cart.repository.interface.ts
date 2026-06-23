import { CartEntity, UpdateCartProps } from '../entities/cart.entity';

export interface CreateCartProps {
  userId: number;
}

export interface ICartRepository {
  findByUid(uid: string): Promise<CartEntity | null>;
  findAll(): Promise<CartEntity[]>;
  create(cart: CreateCartProps): Promise<CartEntity>;
  update(uid: string, cart: UpdateCartProps): Promise<CartEntity>;
  delete(uid: string): Promise<void>;
}

export const CART_REPOSITORY = Symbol('ICartRepository');
