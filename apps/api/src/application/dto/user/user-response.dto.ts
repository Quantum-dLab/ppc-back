import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserEntity, UserRole } from '../../../domain/entities/user.entity';

export class UserResponseDto {
  @ApiProperty({
    description: 'User public unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  uid: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: UserRole.USER,
  })
  role: UserRole;

  @ApiProperty({
    description: 'Whether the user account is active',
    example: true,
  })
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'Last successful login timestamp',
    example: '2026-06-29T12:30:00.000Z',
    nullable: true,
  })
  lastLoginAt: Date | null;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2026-06-29T12:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2026-06-29T12:30:00.000Z',
  })
  updatedAt: Date;

  static fromEntity(user: UserEntity): UserResponseDto {
    const dto = new UserResponseDto();
    dto.uid = user.uid;
    dto.email = user.email;
    dto.role = user.role;
    dto.isActive = user.isActive;
    dto.lastLoginAt = user.lastLoginAt;
    dto.createdAt = user.createdAt;
    dto.updatedAt = user.updatedAt;
    return dto;
  }
}
