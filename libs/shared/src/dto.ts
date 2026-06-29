import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PagingDto {
  @ApiPropertyOptional({
    description: 'Requested page number',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  public page: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page',
    example: 10,
    default: 10,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  public limit: number = 10;
}

export class PaginationMetaDto {
  @ApiProperty({ example: 1 })
  currentPage?: number;

  @ApiProperty({ example: 20 })
  itemsPerPage?: number;

  @ApiProperty({ example: 340 })
  totalItems?: number;

  @ApiProperty({ example: 17 })
  totalPages?: number;
}

export class PagingResponseDto<T> {
  @ApiProperty({
    description:
      'The rows returned from database per given limit and page number',
  })
  public rows?: Partial<T>[];

  @ApiProperty({
    description: 'The meta data of result-set per given limit and page number',
  })
  public meta?: PaginationMetaDto;
}
