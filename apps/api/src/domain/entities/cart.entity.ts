import { Exclude } from 'class-transformer';

export interface UpdateCartProps {
  userId?: bigint;
}

export class CartEntity {
  @Exclude()
  readonly id!: bigint;
  uid!: string;
  @Exclude()
  userId!: bigint;
  readonly createdAt!: Date;
  updatedAt!: Date;

  constructor(partial: Partial<CartEntity>) {
    Object.assign(this, partial);
  }

  update(data: UpdateCartProps): void {
    if (data.userId !== undefined) this.userId = data.userId;
    this.updatedAt = new Date();
  }
}
