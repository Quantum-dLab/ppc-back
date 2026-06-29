import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateCartItemDto {
  @ApiPropertyOptional({
    description: 'New quantity for the cart item',
    example: 3,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;
}
