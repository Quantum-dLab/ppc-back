import { UserEntity, UserRole } from '../entities/user.entity';

export interface CreateUserProps {
  email: string;
  passwordHash?: string | null;
  googleId?: string | null;
  role?: UserRole;
}

export interface IUserRepository {
  findByUid(uid: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findByGoogleId(googleId: string): Promise<UserEntity | null>;
  findAll(): Promise<UserEntity[]>;
  create(data: CreateUserProps): Promise<UserEntity>;
  update(uid: string, data: Partial<UserEntity>): Promise<UserEntity>;
}
export const USER_REPOSITORY = Symbol('IUserRepository');
