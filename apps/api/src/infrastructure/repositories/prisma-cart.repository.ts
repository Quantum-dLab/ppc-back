import { Injectable } from '@nestjs/common';
import { CartEntity, UpdateCartProps } from '../../domain/entities/cart.entity';
import {
  CreateCartProps,
  ICartRepository,
} from '../../domain/repositories/cart.repository.interface';
import { PrismaService } from '@libs/database';
import { Cart } from '@prisma/client';

@Injectable()
export class PrismaCartRepository implements ICartRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(raw: Cart): CartEntity {
    return new CartEntity({
      id: raw.id,
      uid: raw.uid,
      userId: raw.userId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  async findByUid(uid: string): Promise<CartEntity | null> {
    const raw = await this.prisma.cart.findUnique({ where: { uid } });
    return raw ? this.toEntity(raw) : null;
  }

  async findAll(): Promise<CartEntity[]> {
    const rows = await this.prisma.cart.findMany();
    return rows.map((row) => this.toEntity(row));
  }

  async create(data: CreateCartProps): Promise<CartEntity> {
    const raw = await this.prisma.cart.create({ data });
    return this.toEntity(raw);
  }

  async update(uid: string, data: UpdateCartProps): Promise<CartEntity> {
    const raw = await this.prisma.cart.update({ where: { uid }, data });
    return this.toEntity(raw);
  }

  async delete(uid: string): Promise<void> {
    await this.prisma.cart.delete({ where: { uid } });
  }
}
