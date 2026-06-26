import { Injectable } from '@nestjs/common';
import { CartEntity } from '../../domain/entities/cart.entity';
import {
  CreateCartProps,
  ICartRepository,
} from '../../domain/repositories/cart.repository.interface';
import { PrismaService } from '@libs/database';
import { Cart } from '@prisma/client';
import { PagingDto, PagingResponseDto } from '@libs/shared';
type CartWithUser = Cart & { user?: { uid: string } };

@Injectable()
export class PrismaCartRepository implements ICartRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(raw: CartWithUser): CartEntity {
    return new CartEntity({
      id: raw.id,
      uid: raw.uid,
      userId: raw.userId,
      user: raw.user,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  async findByUid(uid: string): Promise<CartEntity | null> {
    const raw = await this.prisma.cart.findUnique({
      where: { uid },
      include: this.cartInclude,
    });
    return raw ? this.toEntity(raw) : null;
  }

  async findAll(pagingDto: PagingDto): Promise<PagingResponseDto<CartEntity>> {
    const { page, limit } = pagingDto;
    const skip = (page - 1) * limit;

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.cart.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: this.cartInclude,
      }),
      this.prisma.cart.count(),
    ]);

    return {
      rows: rows.map((r) => this.toEntity(r)),
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(data: CreateCartProps): Promise<CartEntity> {
    const raw = await this.prisma.cart.create({
      data: {
        user: {
          connect: {
            uid: data.uid,
          },
        },
      },
      include: this.cartInclude,
    });
    return this.toEntity(raw);
  }

  async delete(uid: string): Promise<void> {
    await this.prisma.cart.delete({ where: { uid } });
  }

  private readonly cartInclude = {
    user: {
      select: {
        uid: true,
      },
    },
  };
}
