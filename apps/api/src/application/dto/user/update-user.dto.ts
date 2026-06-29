import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../../../domain/entities/user.entity';

export class UpdateUserDto {
  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    required: false,
    example: UserRole.ADMIN,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'role must be one of: USER, ADMIN' })
  role?: UserRole;

  @ApiProperty({
    description: 'Whether the user account is active',
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean;
}
