import { Injectable } from '@nestjs/common';
import {
  CartItemEntity,
  UpdateCartItemProps,
} from '../../domain/entities/cart-item.entity';
import {
  CreateCartItemProps,
  ICartItemRepository,
} from '../../domain/repositories/cart-item.repository.interface';
import { PrismaService } from '@libs/database';
import { CartItem } from '@prisma/client';

@Injectable()
export class PrismaCartItemRepository implements ICartItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(raw: CartItem): CartItemEntity {
    return new CartItemEntity({
      id: raw.id,
      uid: raw.uid,
      cartId: raw.cartId,
      productId: raw.productId,
      quantity: raw.quantity,
    });
  }

  async findByUid(uid: string): Promise<CartItemEntity | null> {
    const raw = await this.prisma.cartItem.findUnique({ where: { uid } });
    return raw ? this.toEntity(raw) : null;
  }

  async findByCartId(cartId: number): Promise<CartItemEntity[]> {
    const rows = await this.prisma.cartItem.findMany({ where: { cartId } });
    return rows.map((row) => this.toEntity(row));
  }

  async findAll(): Promise<CartItemEntity[]> {
    const rows = await this.prisma.cartItem.findMany();
    return rows.map((row) => this.toEntity(row));
  }

  async create(data: CreateCartItemProps): Promise<CartItemEntity> {
    const raw = await this.prisma.cartItem.create({
      data: {
        cartId: data.cartId,
        productId: data.productId,
        quantity: data.quantity ?? 1,
      },
    });
    return this.toEntity(raw);
  }

  async update(
    uid: string,
    data: UpdateCartItemProps,
  ): Promise<CartItemEntity> {
    const raw = await this.prisma.cartItem.update({ where: { uid }, data });
    return this.toEntity(raw);
  }

  async delete(uid: string): Promise<void> {
    await this.prisma.cartItem.delete({ where: { uid } });
  }
}
