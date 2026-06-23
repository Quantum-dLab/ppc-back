/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Exclude } from 'class-transformer';

export interface UpdateCartItemProps {
  quantity?: number;
}

export class CartItemEntity {
  @Exclude()
  readonly id!: bigint;
  readonly uid!: string;
  @Exclude()
  cartId!: bigint;
  @Exclude()
  readonly productId!: bigint;
  quantity!: number;

  constructor(partial: Partial<CartItemEntity>) {
    Object.assign(this, partial);
  }

  update(data: UpdateCartItemProps): void {
    if (data.quantity !== undefined) this.quantity = data.quantity;
  }
}
