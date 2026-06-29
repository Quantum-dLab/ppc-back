import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token returned from login or register',
    example: 'd9f5b527bb0f41f1a4e6d0f4494c9a5f',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
