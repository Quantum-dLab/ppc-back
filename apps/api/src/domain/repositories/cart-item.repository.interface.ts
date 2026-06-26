import {
  CartItemEntity,
  UpdateCartItemProps,
} from '../entities/cart-item.entity';

export interface CreateCartItemProps {
  cartId: bigint;
  productId: bigint;
  quantity?: number;
}

export interface ICartItemRepository {
  findByUid(uid: string): Promise<CartItemEntity | null>;
  findByCartId(cartId: number): Promise<CartItemEntity[]>;
  findAll(): Promise<CartItemEntity[]>;
  create(item: CreateCartItemProps): Promise<CartItemEntity>;
  update(uid: string, item: UpdateCartItemProps): Promise<CartItemEntity>;
  delete(uid: string): Promise<void>;
}

export const CART_ITEM_REPOSITORY = Symbol('ICartItemRepository');
