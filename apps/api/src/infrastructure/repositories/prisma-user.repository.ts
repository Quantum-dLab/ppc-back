import { Injectable } from '@nestjs/common';
import { UserEntity, UserRole } from '../../domain/entities/user.entity';
import {
  CreateUserProps,
  IUserRepository,
} from '../../domain/repositories/user.repository.interface';
import { PrismaService } from '@libs/database';
import { User } from '@prisma/client';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(raw: User): UserEntity {
    return new UserEntity({
      id: raw.id,
      uid: raw.uid,
      email: raw.email,
      passwordHash: raw.passwordHash,
      refreshTokenHash: raw.refreshTokenHash,
      googleId: raw.googleId,
      role: raw.role as UserRole,
      isActive: raw.isActive,
      lastLoginAt: raw.lastLoginAt,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  async findByUid(uid: string): Promise<UserEntity | null> {
    const raw = await this.prisma.user.findUnique({ where: { uid } });
    return raw ? this.toEntity(raw) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {


      const raw = await this.prisma.user.findUnique({ where: { email } });

      return raw ? this.toEntity(raw) : null;
 
  }


  async findByGoogleId(googleId: string): Promise<UserEntity | null> {
    const raw = await this.prisma.user.findUnique({ where: { googleId } });
    return raw ? this.toEntity(raw) : null;
  }

  async findAll(): Promise<UserEntity[]> {
    const rows = await this.prisma.user.findMany();
    return rows.map((r) => this.toEntity(r));
  }

  async create(data: CreateUserProps): Promise<UserEntity> {
    const raw = await this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash ?? null,
        refreshTokenHash: null,
        googleId: data.googleId ?? null,
        role: data.role ?? UserRole.USER,
      },
    });
    return this.toEntity(raw);
  }

  async update(uid: string, data: Partial<UserEntity>): Promise<UserEntity> {
    const raw = await this.prisma.user.update({
      where: { uid },
      data: {
        ...(data.passwordHash !== undefined && {
          passwordHash: data.passwordHash,
        }),
        ...(data.refreshTokenHash !== undefined && {
          refreshTokenHash: data.refreshTokenHash,
        }),
        ...(data.googleId !== undefined && { googleId: data.googleId }),
        ...(data.role !== undefined && { role: data.role }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.lastLoginAt !== undefined && {
          lastLoginAt: data.lastLoginAt,
        }),
      },
    });
    return this.toEntity(raw);
  }
}
