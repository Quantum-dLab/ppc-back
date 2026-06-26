import { Exclude, Expose } from 'class-transformer';

export class CartEntity {
  @Exclude()
  readonly id!: bigint;
  uid!: string;
  @Exclude()
  userId!: bigint;

  @Expose()
  get userUid(): string {
    return this.user?.uid ?? '';
  }

  @Exclude()
  user?: { uid: string };
  readonly createdAt!: Date;
  updatedAt!: Date;

  constructor(partial: Partial<CartEntity>) {
    Object.assign(this, partial);
  }
}
