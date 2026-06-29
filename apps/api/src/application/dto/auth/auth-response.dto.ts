import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserResponseDto } from '../user/user-response.dto';

export class AuthTokenResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Refresh token used to issue a new access token',
    example: 'd9f5b527bb0f41f1a4e6d0f4494c9a5f',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'Authenticated user profile',
    type: UserResponseDto,
  })
  user: UserResponseDto;

  static fromResult(result: {
    accessToken: string;
    refreshToken: string;
    user: UserEntity;
  }): AuthTokenResponseDto {
    const dto = new AuthTokenResponseDto();
    dto.accessToken = result.accessToken;
    dto.refreshToken = result.refreshToken;
    dto.user = UserResponseDto.fromEntity(result.user);
    return dto;
  }
}

export class MessageResponseDto {
  @ApiProperty({
    description: 'Operation result message',
    example: 'Logout successful',
  })
  message: string;

  static of(message: string): MessageResponseDto {
    const dto = new MessageResponseDto();
    dto.message = message;
    return dto;
  }
}
