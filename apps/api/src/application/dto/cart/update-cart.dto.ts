import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateCartDto {
  @IsOptional()
  @Transform(({ value }) => (value ? BigInt(value) : undefined))
  userId?: bigint;
}
