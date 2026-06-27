import { Exclude } from 'class-transformer';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface UpdateUserProps {
  passwordHash?: string | null;
  refreshTokenHash?: string | null;
  googleId?: string | null;
  role?: UserRole;
  isActive?: boolean;
  lastLoginAt?: Date;
}

export class UserEntity {
  @Exclude()
  readonly id!: bigint;
  readonly uid!: string;
  email!: string;
  @Exclude()
  passwordHash!: string | null;
  @Exclude()
  refreshTokenHash!: string | null;
  @Exclude()
  googleId!: string | null;
  role!: UserRole;
  isActive!: boolean;
  lastLoginAt!: Date | null;
  readonly createdAt!: Date;
  updatedAt!: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  update(data: UpdateUserProps): void {
    if (data.passwordHash !== undefined) this.passwordHash = data.passwordHash;
    if (data.refreshTokenHash !== undefined) {
      this.refreshTokenHash = data.refreshTokenHash;
    }
    if (data.googleId !== undefined) this.googleId = data.googleId;
    if (data.role !== undefined) this.role = data.role;
    if (data.isActive !== undefined) this.isActive = data.isActive;
    if (data.lastLoginAt !== undefined) this.lastLoginAt = data.lastLoginAt;
    this.updatedAt = new Date();
  }

  // Explicit projection for HTTP responses: there is no global serializer
  // wired up to honor @Exclude(), and the bigint `id` cannot be JSON-serialized as is.
  toPublic() {
    return {
      uid: this.uid,
      email: this.email,
      role: this.role,
      isActive: this.isActive,
      lastLoginAt: this.lastLoginAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
